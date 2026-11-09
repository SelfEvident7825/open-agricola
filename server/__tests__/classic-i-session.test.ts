import { afterEach, describe, expect, it } from 'vitest'
import { getCardDefinition } from '../../shared/cards/catalog'
import { deriveVirtualTileCol, getLogicalFields } from '../../shared/cards/helpers/card-field'
import { ALL_CARD_IMPLS } from '../../shared/cards/register-all'
import type { GameState, Resource } from '../../shared/contract/types'
import { familySize, markAllWorkersUsed } from '../../shared/domain/player'
import type { GameSession, SessionResponse } from '../game/authoritative-session'
import { build as buildRooms } from './_helpers/audit/ae-negative-28-construct'
import { playMinor, playOccupation, sessionOptions } from './_helpers/card-regression-session'
import { completePlowUse } from './_helpers/plow-use'
import { createWorkSession } from './_helpers/session-fixtures'
const options = {
  playerCount: 4,
  gameEdition: 'classic' as const,
  ordinaryCardDeckSeed: 42,
}
const sessions: GameSession[] = []
afterEach(() => {
  for (const s of sessions.splice(0)) s.dispose()
})
const id = (number: number) =>
  Object.keys(ALL_CARD_IMPLS).find((id) => id.startsWith(`OLD_I${number}_`))!
const make = (cards: string[], configure?: (state: GameState) => void, played = true) => {
  const s = createWorkSession({
    options,
    configure: (state) => {
      for (const p of state.players) {
        p.minorHand = ['__test_placeholder__']
        p.occupationHand = ['__test_placeholder__']
        p.minorPlayed = []
        p.occupationPlayed = []
        p.improvements = []
        p.cardStates = {}
        for (const key of Object.keys(p.resources)) p.resources[key as keyof Resource] = 0
      }
      const p = state.players[0]!
      for (const card of cards) {
        const kind = getCardDefinition(card)?.playerActionCardType ?? getCardDefinition(card)?.kind
        if (kind === 'occupation') (played ? p.occupationPlayed : p.occupationHand).push(card)
        else (played ? p.minorPlayed : p.minorHand).push(card)
      }
      configure?.(state)
    },
  })
  sessions.push(s)
  return s
}
const ok = (r: SessionResponse) => {
  expect(r.ok, r.error).toBe(true)
  return r
}
const accept = (s: GameSession, start: SessionResponse, preferred?: string): SessionResponse => {
  let r = ok(start)
  for (let i = 0; i < 16 && r.interaction.stateId === 'wait'; i++) {
    const int = r.interaction
    if (int.request.kind === 'confirm-next-player' || int.request.kind === 'farm-select') break
    if (int.request.kind === 'animal-reorg') {
      r = ok(
        s.resolveChoice(int.playerIndex, 'confirm', {
          zones: int.request.zones,
        }),
      )
      continue
    }
    if (int.request.kind === 'confirm-player-switch') {
      r = ok(s.resolveChoice(int.request.fromPlayerIndex, 'confirm'))
      continue
    }
    const choices = sessionOptions(r).filter((o) => !o.disabled)
    const option =
      choices.find((o) => o.value === preferred) ??
      choices.find((o) => !['__skip__', '__pass__', '__done__'].includes(o.value))
    if (!option) break
    r = ok(s.resolveChoice(int.playerIndex, option.value))
  }
  return r
}
describe('classic I — four-player actions and undo', () => {
  const cases: [number, string, Partial<Resource>, Partial<Resource>, number?][] = [
    [74, 'grain-seeds', {}, { grain: 3 }],
    [95, 'fishing', { food: 2 }, { food: 3 }],
    [95, 'reed-bank', { reed: 2 }, { reed: 2, food: 1 }],
    [79, 'forest', { wood: 3 }, { wood: 5 }],
    [82, 'western-quarry', { stone: 2 }, { stone: 3 }, 5],
    [229, 'grain-seeds', {}, { grain: 1, food: 1 }],
    [237, 'traveling-players', { food: 3 }, { food: 6 }],
    [253, 'forest', { wood: 3 }, { wood: 1, boar: 1 }],
    [251, 'reed-bank', { reed: 2 }, { reed: 2, food: 2 }],
    [255, 'western-quarry', { stone: 2 }, { stone: 2, food: 2 }, 5],
  ]
  it.each(cases)(
    'I%i at %s grants %j → %j and restores on undo',
    (n, space, pile, expected, round = 1) => {
      const s = make([id(n)], (state) => {
        state.round = round
        state.roundActionOrder[0] = space
        state.players[0]!.resources.food = [251, 255].includes(n) ? 1 : 0
        Object.assign(state.actionSpaces.find((a) => a.id === space)!.resources, pile)
      })
      const r = accept(s, s.takeAction(0, space))
      expect(r.state.players[0]!.resources).toMatchObject(expected)
      const u = ok(s.undoAction())
      expect(u.state.actionSpaces.find((a) => a.id === space)!.resources).toMatchObject(pile)
      expect(u.state.players[0]!.resources.wood).toBe(0)
    },
  )
  it.each([74, 79, 82, 95, 229, 237, 251, 253, 255])(
    'I%i cannot trigger from a card still in hand',
    (n) => {
      const s = make(
        [id(n)],
        (state) => {
          state.actionSpaces.find((a) => a.id === 'forest')!.resources.wood = 3
        },
        false,
      )
      expect(ok(s.takeAction(0, 'forest')).state.players[0]!.resources).toMatchObject({
        wood: 3,
        food: 0,
        boar: 0,
      })
    },
  )
  it.each([
    [80, 'forest', { wood: 3, food: 0 }, { wood: 2, food: 0 }, { wood: 1, food: 0 }],
    [234, 'forest', { wood: 3, food: 0 }, { wood: 2, food: 1 }, { wood: 1, food: 0 }],
    [251, 'reed-bank', { reed: 2 }, { reed: 1, food: 2 }, { reed: 1, food: 0 }],
    [255, 'western-quarry', { stone: 2 }, { stone: 1, food: 2 }, { stone: 1, food: 0 }],
    [257, 'traveling-players', { food: 2 }, { food: 2 }, { grain: 1 }],
  ] as const)(
    'I%i resolves opponent transfers with the owner choosing',
    (n, space, pile, actor, owner) => {
      const s = make([], (state) => {
        state.roundActionOrder[0] = space
        state.players[1]!.occupationPlayed = [id(n)]
        if (n === 80) {
          state.players[1]!.occupationPlayed = []
          state.players[1]!.minorPlayed = [id(n)]
        }
        state.players[1]!.resources.food = [234, 251, 255].includes(n) ? 1 : 0
        Object.assign(state.actionSpaces.find((a) => a.id === space)!.resources, pile)
      })
      const r = accept(s, s.takeAction(0, space))
      expect(r.state.players[0]!.resources).toMatchObject(actor)
      expect(r.state.players[1]!.resources).toMatchObject(owner)
      if ([234, 251, 255].includes(n)) expect(s.undoAction().ok).toBe(false)
      else expect(ok(s.undoAction()).state.players[1]!.resources.wood).toBe(0)
    },
  )
  it('I229 rejects a penniless opponent, then takes the tax before awarding grain', () => {
    const s = make([], (state) => {
      state.players[1]!.occupationPlayed = [id(229)]
    })
    expect(s.takeAction(0, 'grain-seeds').ok).toBe(false)
    s.state.players[0]!.resources.food = 1
    s.loadState(s.state)
    const r = accept(s, s.takeAction(0, 'grain-seeds'))
    expect(r.state.players[0]!.resources).toMatchObject({ grain: 1, food: 0 })
    expect(r.state.players[1]!.resources.food).toBe(2)
  })
  it.each([233])(
    'I%i permits one growth without room in a clay hut, then consumes the privilege',
    (n) => {
      const s = make([id(n)], (state) => {
        state.roundActionOrder[0] = 'wish-children'
        state.players[0]!.houseType = 'clay'
      })
      const r = accept(s, s.takeAction(0, 'wish-children'))
      expect(familySize(r.state.players[0]!)).toBe(3)
      expect(r.state.players[0]!.cardStates[id(n)]?.extraData?.used).toBe(true)
      expect(familySize(ok(s.undoAction()).state.players[0]!)).toBe(2)
    },
  )
  it('I233 does not allow growth without room in a wooden hut', () => {
    const s = make([id(233)], (state) => {
      state.roundActionOrder[0] = 'wish-children'
    })
    expect(s.takeAction(0, 'wish-children').ok).toBe(false)
  })
  it.each([
    [241, 'clay', 2, { clay: 6, reed: 4 }],
    [243, 'clay', 2, { clay: 6, reed: 4 }],
    [91, 'wood', 2, { wood: 10, reed: 2 }],
    [99, 'clay', 1, { clay: 5 }],
  ] as const)('I%i builds %s ×%i for the printed cost', (n, house, count, paid) => {
    const s = make([id(n)], (state) => {
      state.players[0]!.houseType = house
      Object.assign(state.players[0]!.resources, paid)
    })
    expect(buildRooms(s, count, paid).r.state.players[0]!.rooms).toBe(2 + count)
  })
  it('I220 builds the Well via a minor action for one wood and one stone', () => {
    const s = make([id(220)], (state) => {
      Object.assign(state.players[0]!.resources, { wood: 1, stone: 1 })
      state.availableMajorImprovements = ['Major_Well']
    })
    const r = accept(s, s.takeAction(0, 'meeting-place'), 'Major_Well')
    expect(r.state.players[0]!.improvements).toContain('Major_Well')
    expect(r.state.players[0]!.resources).toMatchObject({ wood: 0, stone: 0 })
  })
  it.each([1, 2, 3])(
    'I219 adds the right number of goods when sowing %i distinct fields',
    (count) => {
      const s = make([id(219)], (state) => {
        state.roundActionOrder[0] = 'grain-utilization'
        state.players[0]!.resources.grain = count
        state.players[0]!.fields = Array.from({ length: count }, (_, i) => ({
          row: 0,
          col: i,
          stacks: [],
        }))
      })
      accept(s, s.takeAction(0, 'grain-utilization'))
      const r = accept(
        s,
        s.commitSelectionChoice(0, {
          crops: Array.from({ length: count }, (_, i) => ({
            row: 0,
            col: i,
            crop: 'grain',
          })),
        }),
      )
      expect(r.state.players[0]!.fields.map((f) => f.stacks[0]!.remaining)).toEqual(
        Array(count).fill(count === 1 ? 5 : count === 2 ? 4 : 3),
      )
    },
  )
  it('I219 counts the two I78 wood columns as two fields', () => {
    const s = make([id(219), id(78)], (state) => {
      state.roundActionOrder[0] = 'grain-utilization'
      state.players[0]!.resources.wood = 2
    })
    accept(s, s.takeAction(0, 'grain-utilization'))
    const r = accept(
      s,
      s.commitSelectionChoice(0, {
        crops: [0, 1].map((i) => ({
          row: -1,
          col: deriveVirtualTileCol(id(78), i),
          crop: 'wood',
        })),
      }),
    )
    expect(getLogicalFields(r.state.players[0]!).map((f) => f.stacks[0]!.remaining)).toEqual([4, 4])
  })
  it.each([63, 68])('I%i plows exactly two fields and is reversible', (n) => {
    const s = make([id(n)], (state) => {
      if (n === 63) state.players[0]!.cardStates[id(n)] = { stack: ['field', 'field'] }
    })
    const r = completePlowUse(s, ok(s.takeAction(0, 'farmland')), id(n))
    expect(r.state.players[0]!.fields).toHaveLength(2)
    expect(ok(s.undoAction()).state.players[0]!.fields).toHaveLength(0)
  })
  it('I68 allows another player to hire the harrow once for two food', () => {
    const s = make([], (state) => {
      state.players[1]!.minorPlayed = [id(68)]
      state.players[0]!.resources.food = 2
    })
    const r = completePlowUse(s, ok(s.takeAction(0, 'farmland')), id(68))
    expect(r.state.players[0]!.fields).toHaveLength(2)
    expect(r.state.players.map((p) => p.resources.food)).toEqual([0, 2, 0, 0])
    expect(r.state.players[1]!.fields).toHaveLength(0)
    expect(r.state.players[1]!.cardStates[id(68)]?.extraData?.users).toEqual([
      r.state.players[0]!.id,
    ])
  })
  it('I251 records the first opportunity even when the owner declines', () => {
    const s = make([], (state) => {
      state.players[1]!.occupationPlayed = [id(251)]
      state.players[1]!.resources.food = 1
      state.actionSpaces.find((a) => a.id === 'reed-bank')!.resources.reed = 2
    })
    let r = ok(s.takeAction(0, 'reed-bank'))
    for (
      let i = 0;
      i < 10 &&
      r.interaction.stateId === 'wait' &&
      r.interaction.request.kind !== 'confirm-next-player';
      i++
    ) {
      if (r.interaction.request.kind === 'confirm-player-switch')
        r = ok(s.resolveChoice(r.interaction.request.fromPlayerIndex, 'confirm'))
      else r = ok(s.resolveChoice(r.interaction.playerIndex, '__skip__'))
    }
    expect(r.state.players[0]!.resources.reed).toBe(2)
    expect(r.state.players[1]!.cardStates[id(251)]?.extraData?.seenRound).toBe(1)
  })
})

const finishRound = (s: GameSession, start: SessionResponse) => {
  let r = ok(start)
  for (let n = 0; n < 80 && r.interaction.stateId === 'wait'; n++) {
    const i = r.interaction
    if (i.request.kind === 'feed') {
      r = ok(s.resolveChoice(i.playerIndex, 'confirm', { selections: [] }))
      continue
    }
    if (i.request.kind === 'confirm-player-switch') {
      r = ok(s.resolveChoice(i.request.fromPlayerIndex, 'confirm'))
      continue
    }
    if (i.request.kind === 'confirm-next-player') {
      r = ok(s.resolveChoice(i.playerIndex, 'confirm'))
      continue
    }
    if (i.request.kind === 'animal-reorg') {
      r = ok(s.resolveChoice(i.playerIndex, 'confirm', { zones: i.request.zones }))
      continue
    }
    const o =
      sessionOptions(r).find(
        (o) => !o.disabled && !['__skip__', '__pass__', '__done__', 'cancel'].includes(o.value),
      ) ?? sessionOptions(r).find((o) => !o.disabled)
    expect(o, JSON.stringify(i)).toBeDefined()
    r = ok(s.resolveChoice(r.interaction.playerIndex, o!.value))
  }
  return r
}
describe('classic I — purchases, harvesting and multiplayer choices', () => {
  it('I70 reacts once when an opponent plows three fields with one plow use', () => {
    const plow = 'OLD_E61_RidingPlough'
    const s = make([plow], (state) => {
      state.players[0]!.cardStates[plow] = {
        stack: ['field', 'field', 'field', 'field'],
      }
      state.players[1]!.minorPlayed = [id(70)]
    })
    let r = ok(s.takeAction(0, 'farmland'))
    for (
      let i = 0;
      i < 30 &&
      r.interaction.stateId === 'wait' &&
      r.interaction.request.kind !== 'confirm-next-player';
      i++
    ) {
      const int = r.interaction
      if (int.request.kind === 'confirm-player-switch') {
        r = ok(s.resolveChoice(int.request.fromPlayerIndex, 'confirm'))
        continue
      }
      if (int.request.kind === 'farm-select' && int.request.farm.farmType === 'plow') {
        r = ok(
          s.commitSelectionChoice(int.playerIndex, {
            tile: int.request.farm.selectableTiles[0],
          }),
        )
        continue
      }
      const choice = sessionOptions(r).find(
        (o) => !o.disabled && !['__skip__', '__done__', '__pass__'].includes(o.value),
      )
      expect(choice, JSON.stringify(int)).toBeDefined()
      r = ok(s.resolveChoice(int.playerIndex, choice!.value))
    }
    expect(r.state.players[0]!.fields).toHaveLength(3)
    expect(r.state.players[1]!.fields).toHaveLength(1)
  })
  it('I68 cannot combine with I63 on the same visit', () => {
    const s = make([id(63), id(68)], (state) => {
      state.players[0]!.cardStates[id(63)] = { stack: ['field', 'field'] }
    })
    const r = completePlowUse(s, ok(s.takeAction(0, 'farmland')), id(63))
    expect(r.state.players[0]!.fields).toHaveLength(2)
  })
  it('I225 plows after taking grain seeds', () => {
    const s = make([id(225)])
    const r = completePlowUse(s, ok(s.takeAction(0, 'grain-seeds')), id(225))
    expect(r.state.players[0]!.fields).toHaveLength(1)
    expect(r.state.players[0]!.resources.grain).toBe(1)
  })
  it.each([
    [240, 'cattle-market', 'cattle'],
    [259, 'sheep-market', 'sheep'],
  ] as const)('I%i provides an extra animal at its market', (n, space, animal) => {
    const s = make([id(n)], (state) => {
      state.roundActionOrder[0] = space
      state.players[0]!.resources.food = 1
      state.players[0]!.pastures = [
        {
          id: 'animals',
          tiles: [
            { row: 0, col: 1 },
            { row: 0, col: 2 },
          ],
          animalType: null,
          animalCount: 0,
        },
      ]
      state.actionSpaces.find((a) => a.id === space)!.resources[animal] = 1
    })
    const r = accept(s, s.takeAction(0, space))
    expect(r.state.players[0]!.resources[animal]).toBe(2)
    expect(r.state.players[0]!.resources.food).toBe(n === 259 ? 0 : 1)
  })
  it('I245 gives its owner extra grain and a vegetable while supplying grain to all opponents', () => {
    const s = make([id(245)])
    const r = accept(s, s.takeAction(0, 'grain-seeds'))
    expect(r.state.players.map((p) => p.resources.grain)).toEqual([2, 1, 1, 1])
    expect(r.state.players[0]!.resources.vegetable).toBe(1)
  })
  it('I249 lets the owner play an occupation for one food after another player performs', () => {
    const s = make([], (state) => {
      state.players[1]!.occupationPlayed = [id(249)]
      state.players[1]!.occupationHand = [id(235)]
      state.players[1]!.resources.food = 1
      state.actionSpaces.find((a) => a.id === 'traveling-players')!.resources.food = 2
    })
    const r = accept(s, s.takeAction(0, 'traveling-players'))
    expect(r.state.players[1]!.occupationPlayed).toContain(id(235))
    expect(r.state.players[1]!.resources.food).toBe(0)
  })
  it('I261 gives grain before using a newly revealed baking space', () => {
    const s = make([id(261)], (state) => {
      state.roundActionOrder[0] = 'grain-utilization'
      state.players[0]!.improvements = ['Major_Fireplace1']
    })
    const r = accept(s, s.takeAction(0, 'grain-utilization'))
    expect(r.state.players[0]!.resources).toMatchObject({ grain: 0, food: 2 })
  })
  it('I244 skips the next harvest including feeding', () => {
    const s = make(
      [id(244)],
      (state) => {
        state.round = 4
        state.players[0]!.fields = [{ row: 0, col: 1, stacks: [{ kind: 'grain', remaining: 3 }] }]
        for (const p of state.players) p.resources.food = 20
      },
      false,
    )
    accept(s, playOccupation(s, id(244)))
    for (const p of s.state.players) markAllWorkersUsed(s.state, p)
    s.loadState(s.state)
    const r = finishRound(s, s.performRoundEnd())
    expect(r.state.players[0]!.resources).toMatchObject({
      grain: 0,
      food: 20,
      begging: 0,
    })
    expect(r.state.players[0]!.fields[0]!.stacks[0]!.remaining).toBe(3)
    expect(r.state.players[1]!.resources.food).toBe(16)
  })
  it('I252 breeds pigs at the end of round 12', () => {
    const s = make([id(252)], (state) => {
      state.round = 12
      state.players[0]!.resources.boar = 2
      state.players[0]!.pastures = [
        {
          id: 'pigs',
          tiles: [
            { row: 0, col: 1 },
            { row: 0, col: 2 },
          ],
          animalType: 'boar',
          animalCount: 2,
        },
      ]
      for (const p of state.players) markAllWorkersUsed(state, p)
    })
    const r = finishRound(s, s.performRoundEnd())
    expect(r.state.players[0]!.resources.boar).toBe(3)
  })
  it('I97 receives one food for a batch of two animals cooked by an opponent', () => {
    const s = make([], (state) => {
      state.players[1]!.minorPlayed = [id(97)]
      state.players[0]!.improvements = ['Major_CookingHearth1']
      state.players[0]!.resources.sheep = 2
      state.players[0]!.pastures = [
        {
          id: 'sheep',
          tiles: [{ row: 0, col: 1 }],
          animalType: 'sheep',
          animalCount: 2,
        },
      ]
    })
    ok(s.takeAction(0, 'farmland'))
    let r = ok(s.takeAnytimeAction(0, 'exchange'))
    const option = sessionOptions(r).find((o) => (o.effectPreview?.resourcesPaid?.sheep ?? 0) > 0)!
    expect(option).toBeDefined()
    r = accept(s, s.resolveChoice(0, 'bulk:' + option.value.split(':')[1] + '=2'))
    expect(r.state.players[0]!.resources.food).toBe(4)
    expect(r.state.players[1]!.resources.food).toBe(1)
  })
  it('I265 releases four fences before offering its optional two-food construction', () => {
    const s = make([id(265)], (state) => {
      state.round = 6
      state.players[0]!.resources.food = 2
      state.players[0]!.cardStates[id(265)] = {
        extraData: { rounds: [7, 11], reserved: 8 },
      }
      for (const p of state.players) markAllWorkersUsed(state, p)
    })
    const r = accept(s, s.performRoundEnd())
    expect(r.interaction).toMatchObject({
      stateId: 'wait',
      request: { kind: 'farm-select', farm: { farmType: 'fence' } },
    })
    expect(r.state.players[0]!.resources.food).toBe(0)
    expect(r.state.players[0]!.cardStates[id(265)]?.extraData?.reserved).toBe(4)
  })
  it.each([
    [96, { wood: 2 }],
    [96, { clay: 2 }],
    [104, { grain: 3 }],
    [64, {}],
  ] as const)('I%i pays the printed cost, grants its reward and passes left (%j)', (n, paid) => {
    const s = make(
      [id(n)],
      (state) => {
        state.round = 5
        Object.assign(state.players[0]!.resources, paid)
      },
      false,
    )
    const r = accept(s, playMinor(s, id(n)))
    expect(r.state.players[0]!.minorPlayed).not.toContain(id(n))
    expect(r.state.players[1]!.minorHand).toContain(id(n))
    expect(
      r.state.players[0]!.resources[n === 96 ? 'reed' : n === 104 ? 'vegetable' : 'food'],
    ).toBe(n === 64 ? 4 : 2)
  })
  it('I64 is unavailable with a played occupation', () => {
    const s = make(
      [id(64)],
      (state) => {
        state.players[0]!.occupationPlayed = [id(235)]
      },
      false,
    )
    const r = s.takeAction(0, 'meeting-place')
    expect(sessionOptions(r).some((o) => o.value === id(64) && !o.disabled)).toBe(false)
  })
  it.each([
    [65, 'Major_ClayOven', { stone: 1 }],
    [66, 'Major_Well', { stone: 2, wood: 1 }],
    [85, 'Major_CookingHearth1', {}],
  ] as const)(
    'I%i returns the required improvement and cleans its future goods',
    (n, returned, paid) => {
      const s = make(
        [id(n)],
        (state) => {
          state.players[0]!.improvements = [returned]
          state.availableMajorImprovements = state.availableMajorImprovements.filter(
            (c) => c !== returned,
          )
          Object.assign(state.players[0]!.resources, paid)
          state.futureMeeples = [
            {
              id: 'old-reward',
              cardId: returned,
              playerId: state.players[0]!.id,
              round: 8,
              resources: { food: 1 },
              actionId: null,
            },
          ]
        },
        false,
      )
      const r = accept(s, playMinor(s, id(n)))
      expect(r.state.players[0]!.minorPlayed).toContain(id(n))
      expect(r.state.players[0]!.improvements).not.toContain(returned)
      expect(r.state.availableMajorImprovements).toContain(returned)
      expect(r.state.futureMeeples.some((x) => x.cardId === returned)).toBe(false)
    },
  )
  it('I85 cannot return a Fireplace in place of a Cooking Hearth', () => {
    const s = make(
      [id(85)],
      (state) => {
        state.players[0]!.improvements = ['Major_Fireplace1']
      },
      false,
    )
    const r = s.takeAction(0, 'meeting-place')
    expect(sessionOptions(r).some((o) => o.value === id(85) && !o.disabled)).toBe(false)
  })
  it('I87 gives its owner four food and each opponent one food for a newly built Well', () => {
    const s = make([id(220)], (state) => {
      state.players[1]!.minorPlayed = [id(87)]
      Object.assign(state.players[0]!.resources, { wood: 1, stone: 1 })
      state.availableMajorImprovements = ['Major_Well']
    })
    const r = accept(s, s.takeAction(0, 'meeting-place'), 'Major_Well')
    expect(r.state.players.map((p) => p.resources.food)).toEqual([1, 4, 1, 1])
  })
  it('I262 schedules one food on every remaining round when another player builds the Well', () => {
    const s = make([id(220)], (state) => {
      state.round = 11
      state.players[1]!.occupationPlayed = [id(262)]
      Object.assign(state.players[0]!.resources, { wood: 1, stone: 1 })
      state.availableMajorImprovements = ['Major_Well']
    })
    const r = accept(s, s.takeAction(0, 'meeting-place'), 'Major_Well')
    expect(
      r.state.futureMeeples
        .filter((x) => x.cardId === id(262))
        .map((x) => [x.round, x.playerId, x.resources.food]),
    ).toEqual([12, 13, 14].map((round) => [round, r.state.players[1]!.id, 1]))
  })
  it.each([
    [231, 'stone', 3, 3, 'food'],
    [242, 'clay', 5, 2, 'clay'],
  ] as const)(
    'I%i activates the appropriate future income on play',
    (n, house, count, amount, res) => {
      const s = make(
        [id(n)],
        (state) => {
          state.round = 11
          state.players[0]!.houseType = house
        },
        false,
      )
      const r = accept(s, playOccupation(s, id(n)))
      expect(
        r.state.futureMeeples
          .filter((x) => x.cardId === id(n))
          .map((x) => [x.round, x.resources[res]]),
      ).toEqual([12, 13, 14].slice(0, count).map((round) => [round, amount]))
    },
  )
  it.each([100, 337, 230])('I%i creates a usable extra action space when played', (n) => {
    const s = make(
      [id(n)],
      (state) => {
        Object.assign(state.players[0]!.resources, { wood: 2, stone: 2 })
        if (n === 337) state.players[0]!.occupationPlayed = [id(235), id(256), id(258)]
      },
      false,
    )
    const r = accept(s, n === 230 ? playOccupation(s, id(n)) : playMinor(s, id(n)))
    const space = r.state.actionSpaces.find((a) => a.id === id(n))
    expect(space).toBeDefined()
    if (n === 230) expect(space!.resources.clay).toBe(3)
  })
  it.each([
    [100, 0, 'food', 3],
    [337, 1, 'clay', 5],
    [230, 3, 'clay', 4],
  ] as const)('another player uses I%i and pays its owner', (n, fee, resource, amount) => {
    const s = make([], (state) => {
      ;(n === 230 ? state.players[1]!.occupationPlayed : state.players[1]!.minorPlayed).push(id(n))
      state.players[0]!.resources.food = fee
    })
    if (n === 230) {
      s.state.actionSpaces.find((a) => a.id === id(n))!.resources.clay = 4
      s.loadState(s.state)
    }
    const r = accept(s, s.takeAction(0, id(n)))
    expect(r.state.players[0]!.resources[resource]).toBe(amount)
    expect(r.state.players[1]!.resources.food).toBe(fee)
  })
  it.each([100, 337])('I%i owner can choose two bonus points instead of resources', (n) => {
    const s = make([id(n)])
    let r = ok(s.takeAction(0, id(n)))
    const option = sessionOptions(r).find(
      (o) =>
        o.labelKey === 'actions.bonus-vp.name' ||
        o.effectPreview?.kind === 'bonusVp' ||
        o.effectPreview?.bonusVp === 2,
    )
    expect(option, JSON.stringify(r.interaction)).toBeDefined()
    r = accept(s, s.resolveChoice(0, option!.value))
    expect(r.state.players[0]!.cardStates[id(n)]?.counters?.bonusVp).toBe(2)
  })
  it('I92 and I226 take a private harvest at the end of a non-harvest round, leaving the vegetable planted', () => {
    const s = make([id(92), id(226)], (state) => {
      state.round = 2
      state.players[0]!.fields = [{ row: 0, col: 1, stacks: [{ kind: 'vegetable', remaining: 2 }] }]
      for (const p of state.players) markAllWorkersUsed(state, p)
    })
    const r = finishRound(s, s.performRoundEnd())
    expect(r.state.players[0]!.resources.vegetable).toBe(1)
    expect(r.state.players[0]!.fields[0]!.stacks[0]!.remaining).toBe(2)
    expect(r.state.players[0]!.resources.begging).toBe(0)
  })
  it('I86 sows only grain in stacks of two after the private field phase', () => {
    const s = make([id(92), id(86)], (state) => {
      state.round = 2
      state.players[0]!.fields = [{ row: 0, col: 1, stacks: [{ kind: 'grain', remaining: 1 }] }]
      for (const p of state.players) markAllWorkersUsed(state, p)
    })
    let r = accept(s, s.performRoundEnd())
    expect(r.interaction).toMatchObject({
      stateId: 'wait',
      request: { kind: 'farm-select', farm: { farmType: 'sow' } },
    })
    r = ok(
      s.commitSelectionChoice(0, {
        crops: [{ row: 0, col: 1, crop: 'grain' }],
      }),
    )
    expect(r.state.players[0]!.fields[0]!.stacks).toEqual([{ kind: 'grain', remaining: 2 }])
    expect(r.state.players[0]!.resources.grain).toBe(0)
  })
  it('I103 offers only the player taking a private field phase the milling trade', () => {
    const s = make([id(92)], (state) => {
      state.round = 2
      state.players[1]!.minorPlayed = [id(103)]
      state.players[0]!.fields = [{ row: 0, col: 1, stacks: [{ kind: 'grain', remaining: 1 }] }]
      state.players[1]!.resources.grain = 1
      for (const p of state.players) markAllWorkersUsed(state, p)
    })
    const r = finishRound(s, s.performRoundEnd())
    expect(r.state.players.map((p) => p.resources.food)).toEqual([2, 1, 0, 0])
    expect(r.state.players[0]!.resources.grain).toBe(0)
    expect(r.state.players[1]!.resources.grain).toBe(1)
  })
  it('I103 permits each of four players one milling trade after a real field phase', () => {
    const s = make([id(103)], (state) => {
      state.round = 4
      for (const p of state.players) {
        p.resources.food = 20
        p.resources.grain = 2
        markAllWorkersUsed(state, p)
      }
    })
    const r = finishRound(s, s.performRoundEnd())
    expect(r.state.players.map((p) => p.resources.grain)).toEqual([1, 1, 1, 1])
    expect(r.state.players.map((p) => p.resources.food)).toEqual([22, 18, 18, 18])
  })
  it('I248 collects fishing food on return home after visiting reed bank', () => {
    const s = make([id(248)], (state) => {
      state.round = 2
      state.actionSpaces.find((a) => a.id === 'reed-bank')!.resources.reed = 2
      state.actionSpaces.find((a) => a.id === 'fishing')!.resources.food = 5
    })
    accept(s, s.takeAction(0, 'reed-bank'))
    for (const p of s.state.players) markAllWorkersUsed(s.state, p)
    s.loadState(s.state)
    const r = finishRound(s, s.performRoundEnd())
    expect(r.state.players[0]!.resources.food).toBe(5)
    expect(r.state.actionSpaces.find((a) => a.id === 'fishing')!.resources.food).toBe(1)
  })
  it('I223 takes one grain from a chosen opponent and compensates that opponent with two food', () => {
    const s = make([id(223)], (state) => {
      state.round = 4
      for (const p of state.players) {
        p.resources.food = 20
        markAllWorkersUsed(state, p)
      }
      state.players[1]!.fields = [{ row: 0, col: 1, stacks: [{ kind: 'grain', remaining: 3 }] }]
    })
    const r = finishRound(s, s.performRoundEnd())
    expect(r.state.players.map((p) => p.resources.food)).toEqual([16, 18, 16, 16])
    expect(r.state.players[0]!.resources.grain).toBe(1)
    expect(r.state.players[1]!.fields[0]!.stacks[0]!.remaining).toBe(1)
  })
  it('I260 lets a non-starting player place first after paying the starting player one food', () => {
    const s = make([], (state) => {
      state.round = 2
      state.players[1]!.occupationPlayed = [id(260)]
      state.players[1]!.resources.food = 1
      for (const p of state.players) markAllWorkersUsed(state, p)
    })
    let r = ok(s.performRoundEnd())
    for (let i = 0; i < 16 && r.interaction.stateId === 'wait'; i++) {
      if (r.interaction.request.kind === 'confirm-player-switch') {
        r = ok(s.resolveChoice(r.interaction.request.fromPlayerIndex, 'confirm'))
        continue
      }
      const options = sessionOptions(r)
      const wanted = options.find((o) => o.value === 'grain-seeds')
      if (wanted) {
        r = ok(s.resolveChoice(r.interaction.playerIndex, wanted.value))
        break
      }
      const next = options.find(
        (o) => !o.disabled && !['__skip__', '__done__', '__pass__'].includes(o.value),
      )
      expect(next, JSON.stringify(r.interaction)).toBeDefined()
      r = ok(s.resolveChoice(r.interaction.playerIndex, next!.value))
    }
    expect(r.state.players[1]!.resources).toMatchObject({ food: 0, grain: 1 })
    expect(r.state.players[0]!.resources.food).toBe(1)
    expect(r.state.actionSpaces.find((a) => a.id === 'grain-seeds')!.takenBy[0]?.playerId).toBe(
      r.state.players[1]!.id,
    )
  })
})

describe('classic I — placement, renovation and cross-player regressions', () => {
  it.each(['forest', 'sheep-market'])(
    'I88 places two people with an animal market in either order (%s first)',
    (first) => {
      const second = first === 'forest' ? 'sheep-market' : 'forest'
      const s = make([id(88)], (state) => {
        state.round = 14
        state.actionSpaces.find((a) => a.id === 'forest')!.resources.wood = 3
        state.actionSpaces.find((a) => a.id === 'sheep-market')!.resources.sheep = 1
      })
      const r = accept(s, s.takeAction(0, first), second)
      expect(
        r.state.actionSpaces
          .filter((a) => a.takenBy?.some((w) => w.playerId === r.state.players[0]!.id))
          .map((a) => a.id)
          .sort(),
      ).toEqual(['forest', 'sheep-market'])
      expect(r.state.players[0]!.resources).toMatchObject({ wood: 3, sheep: 1 })
      expect(r.interaction).toMatchObject({
        stateId: 'wait',
        request: { kind: 'confirm-next-player' },
      })
    },
  )
  it('I88 cannot place the second person on a second non-market space', () => {
    const s = make([id(88)], (state) => {
      state.round = 14
      state.actionSpaces.find((a) => a.id === 'forest')!.resources.wood = 3
      state.actionSpaces.find((a) => a.id === 'sheep-market')!.resources.sheep = 1
    })
    let r = ok(s.takeAction(0, 'forest'))
    const use = sessionOptions(r).find((o) => o.value !== '__skip__' && !o.disabled)!
    r = ok(s.resolveChoice(0, use.value))
    expect(
      sessionOptions(r).every((o) =>
        ['sheep-market', 'pig-market', 'cattle-market'].includes(o.value),
      ),
    ).toBe(true)
    expect(s.resolveChoice(0, 'grain-seeds').ok).toBe(false)
  })
  it.each([true, false])('I67 offers baking only when played (%s)', (played) => {
    const s = make(
      [id(67)],
      (state) => {
        state.players[0]!.improvements = ['Major_Fireplace1']
        state.players[0]!.resources.grain = 1
      },
      played,
    )
    const r = accept(s, s.takeAction(0, 'farmland'))
    expect(r.state.players[0]!.resources).toMatchObject({
      grain: played ? 0 : 1,
      food: played ? 2 : 0,
    })
    expect(r.interaction).toMatchObject({
      stateId: 'wait',
      request: { kind: 'farm-select', farm: { farmType: 'plow' } },
    })
  })
  it.each([true, false])(
    'I77 grants sheep only for a newly enclosed large pasture (%s)',
    (large) => {
      const s = make([id(77)], (state) => {
        state.round = 14
        state.players[0]!.resources.wood = 8
      })
      accept(s, s.takeAction(0, 'fencing'))
      const edges = large
        ? ['H-0-1', 'H-0-2', 'H-2-1', 'H-2-2', 'V-0-1', 'V-1-1', 'V-0-3', 'V-1-3']
        : ['H-0-1', 'H-1-1', 'V-0-1', 'V-0-2']
      const r = accept(s, s.commitSelectionChoice(0, { edges }))
      expect(r.state.players[0]!.resources).toMatchObject({
        sheep: large ? 2 : 0,
        wood: large ? 0 : 4,
      })
    },
  )
  it('I228 plays a second improvement after the meeting-place minor', () => {
    const s = make([id(228)], (state) => {
      state.players[0]!.minorHand = [id(83), id(89)]
      Object.assign(state.players[0]!.resources, { wood: 1, clay: 3 })
    })
    const r = accept(s, playMinor(s, id(83)), id(89))
    expect(r.state.players[0]!.minorPlayed).toEqual(expect.arrayContaining([id(83), id(89)]))
    expect(r.state.players[0]!.resources).toMatchObject({ wood: 0, clay: 0 })
  })
  it.each([true, false])('I241 admits one-clay renovation only while played (%s)', (played) => {
    const s = make(
      [id(241)],
      (state) => {
        state.round = 14
        state.players[0]!.roomTiles = [0, 1, 2].map((row) => ({
          row,
          col: 0,
        }))
        state.players[0]!.rooms = 3
        Object.assign(state.players[0]!.resources, { clay: 1, reed: 1 })
      },
      played,
    )
    if (!played) {
      expect(s.takeAction(0, 'house-redevelopment').ok).toBe(false)
      return
    }
    const r = accept(s, s.takeAction(0, 'house-redevelopment'))
    expect(r.state.players[0]!.houseType).toBe('clay')
    expect(r.state.players[0]!.resources).toMatchObject({ clay: 0, reed: 0 })
  })
  it('I224 pays the owner once when another player sows two fields in a four-player game', () => {
    const s = make([], (state) => {
      state.roundActionOrder[0] = 'grain-utilization'
      state.players[1]!.occupationPlayed = [id(224)]
      state.players[0]!.resources.grain = 2
      state.players[0]!.fields = [1, 2].map((col) => ({
        row: 0,
        col,
        stacks: [],
      }))
    })
    accept(s, s.takeAction(0, 'grain-utilization'))
    const r = accept(
      s,
      s.commitSelectionChoice(0, {
        crops: [1, 2].map((col) => ({ row: 0, col, crop: 'grain' })),
      }),
    )
    expect(r.state.players.map((p) => p.resources.food)).toEqual([0, 1, 0, 0])
  })
  it('I232 pays after another family grows one person larger', () => {
    const s = make([], (state) => {
      state.roundActionOrder[0] = 'wish-children'
      state.players[0]!.roomTiles = [0, 1, 2].map((row) => ({ row, col: 0 }))
      state.players[0]!.rooms = 3
      state.players[1]!.occupationPlayed = [id(232)]
    })
    const r = accept(s, s.takeAction(0, 'wish-children'))
    expect(familySize(r.state.players[0]!)).toBe(3)
    expect(r.state.players.map((p) => p.resources.food)).toEqual([0, 1, 0, 0])
  })
  it('I90 adds crops only to farm fields beside a room', () => {
    const s = make([id(90)], (state) => {
      state.roundActionOrder[0] = 'grain-utilization'
      state.players[0]!.roomTiles = [
        { row: 0, col: 0 },
        { row: 1, col: 0 },
      ]
      state.players[0]!.resources.grain = 2
      state.players[0]!.fields = [1, 2].map((col) => ({
        row: 0,
        col,
        stacks: [],
      }))
    })
    accept(s, s.takeAction(0, 'grain-utilization'))
    const r = accept(
      s,
      s.commitSelectionChoice(0, {
        crops: [1, 2].map((col) => ({ row: 0, col, crop: 'grain' })),
      }),
    )
    expect(r.state.players[0]!.fields.map((f) => f.stacks[0]!.remaining)).toEqual([5, 3])
  })
  it('I263 offers a paid fence action after its marked space', () => {
    const s = make([id(263)], (state) => {
      state.players[0]!.resources.wood = 4
      state.players[0]!.cardStates[id(263)] = {
        extraData: { space: 'grain-seeds' },
      }
    })
    accept(s, s.takeAction(0, 'grain-seeds'))
    const r = accept(
      s,
      s.commitSelectionChoice(0, {
        edges: ['H-0-1', 'H-1-1', 'V-0-1', 'V-0-2'],
      }),
    )
    expect(r.state.players[0]!.resources).toMatchObject({ wood: 0, grain: 1 })
    expect(r.state.players[0]!.pastures).toHaveLength(1)
  })
  it('I265 constructs the released four fences without wood and preserves its later reserve', () => {
    const s = make([id(265)], (state) => {
      state.round = 6
      state.players[0]!.resources.food = 2
      state.players[0]!.cardStates[id(265)] = {
        extraData: { rounds: [7, 11], reserved: 8 },
      }
      for (const p of state.players) markAllWorkersUsed(state, p)
    })
    accept(s, s.performRoundEnd())
    const r = accept(
      s,
      s.commitSelectionChoice(0, {
        edges: ['H-0-1', 'H-1-1', 'V-0-1', 'V-0-2'],
      }),
    )
    expect(r.state.players[0]!.resources).toMatchObject({ wood: 0, food: 0 })
    expect(r.state.players[0]!.fenceSegments).toHaveLength(4)
    expect(r.state.players[0]!.cardStates[id(265)]?.extraData?.reserved).toBe(4)
  })
})

describe('classic I — end game and harvest ordering', () => {
  it('I101 adds one housed animal before scoring', () => {
    const s = make([id(101)], (state) => {
      state.round = 14
      state.players[0]!.resources.sheep = 1
      state.players[0]!.pastures = [
        { id: 'sheep', tiles: [{ row: 0, col: 1 }], animalType: 'sheep', animalCount: 1 },
      ]
      for (const p of state.players) {
        p.resources.food = 20
        markAllWorkersUsed(state, p)
      }
    })
    const r = finishRound(s, s.performRoundEnd())
    expect(r.state.players[0]!.resources.sheep).toBe(2)
    expect(r.state.players[0]!.resources.food).toBe(16)
  })
  it('I97 feeds after the other three players', () => {
    const s = make([id(97)], (state) => {
      state.round = 4
      for (const p of state.players) {
        p.resources.food = 0
        p.resources.grain = 1
        markAllWorkersUsed(state, p)
      }
    })
    let r = ok(s.performRoundEnd())
    const order: number[] = []
    for (let n = 0; n < 60 && r.interaction.stateId === 'wait'; n++) {
      const i = r.interaction
      if (i.request.kind === 'feed') {
        order.push(i.playerIndex)
        r = ok(s.resolveChoice(i.playerIndex, 'confirm', { selections: [] }))
      } else if (i.request.kind === 'confirm-player-switch')
        r = ok(s.resolveChoice(i.request.fromPlayerIndex, 'confirm'))
      else if (i.request.kind === 'confirm-next-player')
        r = ok(s.resolveChoice(i.playerIndex, 'confirm'))
      else {
        const option = sessionOptions(r).find((o) => !o.disabled)
        if (!option) break
        r = ok(s.resolveChoice(i.playerIndex, option.value))
      }
    }
    expect(order).toHaveLength(4)
    expect(order[3]).toBe(0)
    expect(new Set(order)).toEqual(new Set([0, 1, 2, 3]))
  })
  it('I254 builds a stable for one wood at the start of a stone-house round', () => {
    const s = make([id(254)], (state) => {
      state.round = 2
      state.players[0]!.houseType = 'stone'
      state.players[0]!.resources.wood = 1
      for (const p of state.players) markAllWorkersUsed(state, p)
    })
    const offered = accept(s, s.performRoundEnd())
    expect(offered.interaction).toMatchObject({
      stateId: 'wait',
      request: { kind: 'farm-select', farm: { farmType: 'stable' } },
    })
    const r = accept(s, s.commitSelectionChoice(0, { stables: [{ row: 0, col: 1 }] }))
    expect(r.state.players[0]!.resources.wood).toBe(0)
    expect(r.state.players[0]!.stableTiles).toEqual([{ row: 0, col: 1 }])
  })
})

describe('classic I — holiday work rotation', () => {
  it('I71 skips round-14 work without removing or starving the family', () => {
    const s = make([id(71)], (state) => {
      state.round = 13
      for (const p of state.players) {
        p.resources.food = 20
        markAllWorkersUsed(state, p)
      }
    })
    const r = finishRound(s, s.performRoundEnd())
    expect(r.state.round).toBe(14)
    expect(r.state.currentPlayerIndex).not.toBe(0)
    expect(familySize(r.state.players[0]!)).toBe(2)
    expect(r.state.players[0]!.resources.food).toBe(16)
    expect(s.takeAction(0, 'grain-seeds').ok).toBe(false)
  })
  it('I227 records five distinct people placed by another player', () => {
    const s = make([], (state) => {
      state.round = 14
      state.players[1]!.occupationPlayed = [id(227)]
      for (const p of state.players) {
        p.resources.food = 20
        if (p !== state.players[0]) markAllWorkersUsed(state, p)
      }
      state.players[0]!.workers.forEach((w) => {
        w.isActive = true
        w.isNewborn = false
      })
      state.actionSpaces.find((a) => a.id === 'forest')!.resources.wood = 3
      state.actionSpaces.find((a) => a.id === 'fishing')!.resources.food = 2
      state.actionSpaces.find((a) => a.id === 'reed-bank')!.resources.reed = 1
    })
    let r = s.getState()
    for (const space of ['grain-seeds', 'forest', 'fishing', 'reed-bank', 'day-laborer']) {
      r = accept(s, s.takeAction(0, space))
      if (r.interaction.stateId === 'wait' && r.interaction.request.kind === 'confirm-next-player')
        r = ok(s.resolveChoice(r.interaction.playerIndex, 'confirm'))
    }
    expect(r.state.players[0]!.cardStates[id(227)]?.extraData?.round14Workers).toHaveLength(5)
    expect(r.state.players[1]!.cardStates[id(227)]?.extraData?.round14Workers).toBeUndefined()
  })
})
