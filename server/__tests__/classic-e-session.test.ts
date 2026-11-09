import { afterEach, describe, expect, it } from 'vitest'
import type { GameState, Resource } from '../../shared/contract/types'
import { getCardDefinition } from '../../shared/cards/catalog'
import { createWorkSession } from './_helpers/session-fixtures'
import { playMinor, playOccupation, sessionOptions } from './_helpers/card-regression-session'
import { completePlowUse } from './_helpers/plow-use'
import { deriveVirtualTileCol } from '../../shared/cards/helpers/card-field'
import type { GameSession, SessionResponse } from '../game/authoritative-session'
import { ALL_CARD_IMPLS } from '../../shared/cards/register-all'
const options = { playerCount: 4, gameEdition: 'classic' as const, ordinaryCardDeckSeed: 42 }
const sessions: GameSession[] = []
afterEach(() => {
  for (const s of sessions.splice(0)) s.dispose()
})
const id = (number: number) =>
  Object.keys(ALL_CARD_IMPLS).find((id) => id.startsWith(`OLD_E${number}_`))!
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
      r = ok(s.resolveChoice(int.playerIndex, 'confirm', { zones: int.request.zones }))
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
describe('classic E — four-player work actions', () => {
  const cases: Array<[number, string, Partial<Resource>, Partial<Resource>, number?]> = [
    [12, 'fishing', { food: 2 }, { food: 3 }],
    [12, 'fishing', { food: 2 }, { food: 4 }, 8],
    [30, 'fishing', { food: 2 }, { food: 3, reed: 1 }],
    [35, 'grain-seeds', {}, { grain: 2 }],
    [54, 'day-laborer', {}, { food: 2, stone: 3 }],
    [147, 'vegetable-seeds', {}, { grain: 1, vegetable: 1 }, 9],
    [152, 'forest', { wood: 3 }, { wood: 3, food: 1 }],
    [166, 'day-laborer', {}, { food: 2, vegetable: 1 }],
    [167, 'traveling-players', { food: 2 }, { food: 2, grain: 1 }],
    [168, 'grain-seeds', {}, { grain: 1, vegetable: 1 }],
    [176, 'forest', { wood: 3 }, { wood: 4 }],
    [188, 'clay-pit', { clay: 2 }, { clay: 4 }],
    [202, 'day-laborer', {}, { food: 2, grain: 1 }],
    [206, 'pig-market', { boar: 1 }, { boar: 2 }, 9],
    [212, 'traveling-players', { food: 2 }, { food: 4 }],
    [212, 'traveling-players', { food: 5 }, { food: 5 }],
  ]
  it.each(cases)(
    'E%i at %s grants the printed resources',
    (number, space, pile, expected, round = 1) => {
      const card = id(number)
      const s = make([card], (state) => {
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
        state.round = round
        for (const a of state.actionSpaces) a.roundAvailable = 1
        const action = state.actionSpaces.find((a) => a.id === space)
        expect(action, space).toBeDefined()
        Object.assign(action!.resources, pile)
      })
      const r = accept(s, s.takeAction(0, space))
      expect(r.state.players[0]!.resources).toMatchObject(expected)
      for (const p of r.state.players.slice(1)) expect(p.resources.food).toBe(0)
      const u = ok(s.undoAction())
      expect(u.state.players[0]!.resources).toMatchObject(
        Object.fromEntries(Object.keys(expected).map((k) => [k, 0])),
      )
    },
  )
  it.each([12, 30, 35, 54, 147, 152, 166, 167, 168, 176, 188, 202, 206, 212])(
    'E%i in hand grants no fishing bonus',
    (number) => {
      const s = make(
        [id(number)],
        (state) => {
          state.actionSpaces.find((a) => a.id === 'fishing')!.resources.food = 2
        },
        false,
      )
      const r = ok(s.takeAction(0, 'fishing'))
      expect(r.state.players[0]!.resources).toMatchObject({
        food: 2,
        wood: 0,
        grain: 0,
        vegetable: 0,
        reed: 0,
      })
    },
  )
  it('E169 returns a collected food before E212 tops up the net take to four', () => {
    const s = make([id(169), id(212)], (state) => {
      state.actionSpaces.find((a) => a.id === 'traveling-players')!.resources.food = 2
    })
    const r = accept(s, s.takeAction(0, 'traveling-players'))
    expect(r.state.players[0]!.resources).toMatchObject({ food: 4, vegetable: 1 })
    expect(r.state.actionSpaces.find((a) => a.id === 'traveling-players')!.resources.food).toBe(1)
  })
  it('E161 pays each other holder once even if that player owns two listed cards', () => {
    const s = make([id(161)], (state) => {
      state.actionSpaces.find((a) => a.id === 'fishing')!.resources.food = 3
      state.players[1]!.minorPlayed = [id(12), id(22)]
      state.players[2]!.minorPlayed = [id(30)]
    })
    const r = accept(s, s.takeAction(0, 'fishing'))
    expect(r.state.players.map((p) => p.resources.food)).toEqual([4, 1, 1, 0])
  })
  it.each([61, 62])(
    'E%i plows three fields using one complete use; undo restores the stack',
    (number) => {
      const card = id(number)
      const s = make([card], (state) => {
        state.players[0]!.cardStates[card] = { stack: Array(number === 61 ? 4 : 2).fill('field') }
      })
      const r = completePlowUse(s, ok(s.takeAction(0, 'farmland')), card)
      expect(r.state.players[0]!.fields).toHaveLength(3)
      expect(r.state.players[0]!.cardStates[card]?.stack).toHaveLength(number === 61 ? 2 : 0)
      expect(ok(s.undoAction()).state.players[0]!.fields).toHaveLength(0)
    },
  )
  it('E32 grows a newly sown vegetable on the E18 card field by one', () => {
    const s = make([id(18), id(32)], (state) => {
      state.players[0]!.resources.vegetable = 1
      state.roundActionOrder[0] = 'grain-utilization'
      state.players[0]!.cardStates[id(18)] = { extraData: { cardFieldStacks: [null] } }
    })
    const r = accept(s, s.takeAction(0, 'grain-utilization'))
    expect(r.interaction.stateId).toBe('wait')
    const done = ok(
      s.commitSelectionChoice(0, {
        crops: [{ row: -1, col: deriveVirtualTileCol(id(18), 0), crop: 'vegetable' }],
      }),
    )
    expect(done.state.players[0]!.resources.vegetable).toBe(0)
    expect(done.state.players[0]!.cardStates[id(18)]?.extraData?.cardFieldStacks).toEqual([
      { crop: 'vegetable', remaining: 3 },
    ])
  })
  it('E172 charges the extra two food and E173 can be played free by another player', () => {
    const s = make(
      [id(172)],
      (state) => {
        state.players[0]!.resources.food = 2
        state.players[1]!.occupationHand = [id(173)]
      },
      false,
    )
    const r = accept(s, playOccupation(s, id(172)))
    expect(r.state.players[0]!.occupationPlayed).toContain(id(172))
    expect(r.state.players[0]!.resources.food).toBe(0)
    expect(r.state.players[1]!.occupationPlayed).toContain(id(173))
    expect(r.state.players[1]!.resources.food).toBe(0)
  })
  it('E38 returns two played improvements, their future goods and their effects', () => {
    const card = id(38)
    const s = make(
      [card],
      (state) => {
        const p = state.players[0]!
        p.minorPlayed = [id(24), id(30)]
        p.cardStates[id(24)] = {}
        state.futureMeeples = [
          {
            id: 'pending-food',
            cardId: id(24),
            playerId: p.id,
            round: 5,
            resources: { food: 2 },
            actionId: null,
          },
        ]
      },
      false,
    )
    const r = accept(s, playMinor(s, card))
    expect(r.state.players[0]!.minorPlayed).toEqual([card])
    expect(r.state.futureMeeples).toHaveLength(0)
    expect(getCardDefinition(card)?.vp).toBe(2)
  })
})
import { build as buildRooms } from './_helpers/audit/ae-negative-28-construct'
import { markAllWorkersUsed } from '../../shared/domain/player'
import { computeAnimalZones } from '../../shared/domain/animal-zones'
import { getExchangeCatalog } from '../../shared/actions/effects/exchange'
import { classicMinors, classicOccupations } from '../../shared/cards/catalog'
const allId = (n: number) =>
  [...classicMinors, ...classicOccupations].find((c) => c.id.startsWith(`OLD_E${n}_`))!.id
describe('classic E — payments, cross-player rules and round transitions', () => {
  const rooms: Array<[number[], 'wood' | 'clay' | 'stone', number, Partial<Resource>]> = [
    [[13], 'wood', 1, { wood: 2, reed: 2 }],
    [[13], 'wood', 2, { wood: 4, reed: 4 }],
    [[218], 'wood', 2, { wood: 6, reed: 4 }],
    [[218], 'clay', 1, { clay: 3, reed: 2 }],
    [[218], 'stone', 1, { stone: 3, reed: 2 }],
    [[13, 218], 'wood', 1, { wood: 2, reed: 2 }],
    [[13, 157], 'wood', 1, { wood: 2, reed: 1 }],
    [[37], 'clay', 1, { clay: 2, wood: 1, reed: 1 }],
    [[37], 'clay', 2, { clay: 4, wood: 2, reed: 2 }],
    [[37, 218], 'clay', 1, { clay: 2, wood: 1, reed: 1 }],
    [[36], 'wood', 1, { wood: 5, clay: 2 }],
    [[157], 'stone', 1, { stone: 5, reed: 1 }],
    [[211], 'stone', 1, { stone: 4, reed: 2 }],
  ]
  it.each(rooms)('%j builds %s rooms ×%i for %j', (numbers, houseType, count, paid) => {
    const s = make(numbers.map(allId), (state) => {
      state.players[0]!.houseType = houseType
      Object.assign(state.players[0]!.resources, paid)
    })
    const { r } = buildRooms(s, count, paid)
    expect(r.state.players[0]!.rooms).toBe(2 + count)
  })
  it('Axe and Carpenter do not combine to make a free wooden room', () => {
    const s = make([id(13), id(218)], (state) => {
      state.players[0]!.resources.reed = 2
    })
    const r = s.takeAction(0, 'farm-expansion')
    expect(r.state.players[0]!.rooms).toBe(2)
    expect(
      sessionOptions(r).some((o) => o.labelKey === 'actions.construct.name' && !o.disabled),
    ).toBe(false)
  })
  it('E163 may use an opponent-occupied Farmland and actually plow', () => {
    const s = make([id(163)], (state) => {
      const p = state.players[1]!
      state.actionSpaces.find((a) => a.id === 'farmland')!.takenBy = [
        { playerId: p.id, workerId: p.workers[0]!.id },
      ]
    })
    const r = completePlowUse(s, ok(s.takeAction(0, 'farmland')), id(163), 0)
    expect(r.state.players[0]!.fields).toHaveLength(1)
  })
  it('E341 rewards Potter after play and does not give food or reed', () => {
    const s = make([id(341)], (state) => {
      state.players[0]!.occupationHand = [allId(214)]
      state.players[0]!.resources.food = 1
    })
    const r = accept(s, playOccupation(s, allId(214)))
    expect(r.state.players[0]!.resources).toMatchObject({ clay: 4, food: 0, reed: 0 })
  })
  it('E341 retroactively grants two wood for an owned Joinery', () => {
    const s = make(
      [id(341)],
      (state) => {
        state.players[0]!.improvements = ['Major_Joinery']
        state.availableMajorImprovements = state.availableMajorImprovements.filter(
          (id) => id !== 'Major_Joinery',
        )
      },
      false,
    )
    const r = accept(s, playOccupation(s, id(341)))
    expect(r.state.players[0]!.resources.wood).toBe(2)
  })
  it('E164 creates an empty accumulation space and collects the first two wood next round', () => {
    const s = make([id(164)], undefined, false)
    const played = accept(s, playOccupation(s, id(164)))
    expect(played.state.actionSpaces.find((a) => a.id === id(164))?.resources.wood).toBe(0)
    const state = s.getState().state
    for (const p of state.players) markAllWorkersUsed(state, p)
    s.loadState(state)
    const next = ok(s.performRoundEnd())
    expect(next.state.actionSpaces.find((a) => a.id === id(164))?.resources.wood).toBe(2)
  })
  it('E178 offers the free room at round 11 when played before round 5', () => {
    const card = id(178),
      s = make([card], (state) => {
        state.round = 10
        state.players[0]!.cardStates[card] = { extraData: { eligible: true } }
        for (const p of state.players) markAllWorkersUsed(state, p)
      })
    let r = accept(s, s.performRoundEnd())
    expect(r.interaction).toMatchObject({
      stateId: 'wait',
      request: { kind: 'farm-select', farm: { farmType: 'room' } },
    })
    if (
      r.interaction.stateId === 'wait' &&
      r.interaction.request.kind === 'farm-select' &&
      r.interaction.request.farm.farmType === 'room'
    )
      r = ok(
        s.commitSelectionChoice(0, { rooms: [r.interaction.request.farm.selectableTiles[0]!] }),
      )
    expect(r.state.players[0]!.rooms).toBe(3)
    expect(r.state.players[0]!.resources.wood).toBe(0)
  })
  it('E194 pays one food to plow at round start only in a stone house', () => {
    const s = make([id(194)], (state) => {
      state.round = 5
      state.players[0]!.houseType = 'stone'
      state.players[0]!.resources.food = 1
      for (const p of state.players) markAllWorkersUsed(state, p)
    })
    const r = completePlowUse(s, ok(s.performRoundEnd()), id(194), 1)
    expect(r.state.players[0]!.fields).toHaveLength(1)
    expect(r.state.players[0]!.resources.food).toBe(0)
  })
  it('E190 played in a clay house immediately schedules food for every later round', () => {
    const s = make(
      [id(190)],
      (state) => {
        state.round = 10
        state.players[0]!.houseType = 'clay'
      },
      false,
    )
    const r = accept(s, playOccupation(s, id(190)))
    expect(
      r.state.futureMeeples.filter((e) => e.cardId === id(190)).map((e) => [e.round, e.resources]),
    ).toEqual([11, 12, 13, 14].map((round) => [round, { food: 1 }]))
  })
  it('E29 and E216 permit mixed pasture assignment without letting boars use sheep-only slots', () => {
    const s = make([id(29), id(216)], (state) => {
      const p = state.players[0]!
      p.pastures = [{ id: 'mix', tiles: [{ row: 0, col: 1 }], animalType: null, animalCount: 0 }]
      p.resources.sheep = 2
      p.resources.boar = 3
      state.actionSpaces.find((a) => a.id === 'sheep-market')!.roundAvailable = 1
      state.actionSpaces.find((a) => a.id === 'sheep-market')!.resources.sheep = 1
    })
    let r = ok(s.takeAction(0, 'sheep-market'))
    expect(r.interaction).toMatchObject({ stateId: 'wait', request: { kind: 'animal-reorg' } })
    const bad = s.resolveChoice(0, 'confirm', {
      zones: [
        {
          id: 'mix',
          zoneType: 'pasture',
          animalType: null,
          animalCount: 5,
          animalCounts: { sheep: 2, boar: 3 },
        },
      ],
    })
    expect(bad.ok).toBe(false)
    r = ok(
      s.resolveChoice(0, 'confirm', {
        zones: [
          {
            id: 'mix',
            zoneType: 'pasture',
            animalType: null,
            animalCount: 4,
            animalCounts: { sheep: 2, boar: 2 },
          },
          {
            id:
              r.interaction.stateId === 'wait' && r.interaction.request.kind === 'animal-reorg'
                ? r.interaction.request.zones.find((z) => z.zoneType === 'house')!.id
                : '',
            zoneType: 'house',
            animalType: 'sheep',
            animalCount: 1,
          },
        ],
      }),
    )
    expect(r.state.players[0]!.pastures[0]!.animalCounts).toEqual({ sheep: 2, boar: 2 })
    s.loadState(r.state)
    expect(
      s.withCtx(() => computeAnimalZones(s.state.players[0]!, s.state)).find((z) => z.id === 'mix')
        ?.animalCounts,
    ).toEqual({ sheep: 2, boar: 2 })
  })
  const exchanges: Array<[number, Partial<Resource>, Partial<Resource>]> = [
    [17, { grain: 1 }, { food: 2 }],
    [158, { wood: 1 }, { food: 1 }],
    [209, { stone: 1 }, { food: 2 }],
    [185, { clay: 3 }, { stone: 2 }],
    [186, { clay: 3 }, { stone: 1 }],
    [171, { wood: 3 }, { stone: 1 }],
  ]
  it.each(exchanges)(
    'E%i executes an actual anytime conversion and rejects a second unpaid conversion',
    (n, cost, gain) => {
      const card = allId(n),
        s = make([card], (state) => Object.assign(state.players[0]!.resources, cost))
      ok(s.takeAction(0, 'farmland'))
      let r = ok(s.takeAnytimeAction(0, 'exchange'))
      const trade =
        sessionOptions(r).find(
          (o) =>
            o.sourceCard === card &&
            JSON.stringify(o.labelParams?.resourcesGained ?? o.effectPreview?.resourcesGained) ===
              JSON.stringify(gain),
        ) ?? sessionOptions(r).find((o) => o.sourceCard === card)
      expect(trade, JSON.stringify(r.interaction)).toBeDefined()
      r = ok(s.resolveChoice(0, trade!.value))
      expect(r.state.players[0]!.resources).toMatchObject(gain)
      for (const key of Object.keys(cost))
        expect(r.state.players[0]!.resources[key as keyof Resource]).toBe(0)
    },
  )
})
const choose = (s: GameSession, r: SessionResponse, value: string) => {
  expect(r.interaction.stateId, JSON.stringify(r.interaction)).toBe('wait')
  expect(
    sessionOptions(r).some((o) => o.value === value && !o.disabled),
    JSON.stringify(r.interaction),
  ).toBe(true)
  return ok(
    s.resolveChoice(r.interaction.stateId === 'wait' ? r.interaction.playerIndex : 0, value),
  )
}
const buyInjected = (s: GameSession, card: string) => {
  let r = ok(s.takeAction(0, 'meeting-place'))
  for (let i = 0; i < 4; i++) {
    const o =
      sessionOptions(r).find((o) => o.value === card) ??
      sessionOptions(r).find((o) => o.value.startsWith('action-improvement-'))
    expect(o, JSON.stringify(r.interaction)).toBeDefined()
    r = choose(s, r, o!.value)
    if (o!.value === card || r.state.players[0]!.improvements.includes(card)) return r
  }
  throw new Error('Improvement choice not reached')
}
const bakeChoice = (s: GameSession, r: SessionResponse, provider: string, count = 1) => {
  for (let i = 0; i < 5; i++) {
    const o =
      sessionOptions(r).find((o) => o.value === `count-${provider}-${count}`) ??
      sessionOptions(r).find((o) => o.value === provider) ??
      sessionOptions(r).find((o) => o.labelKey === 'actions.bakeBread.name')
    if (!o) break
    r = choose(s, r, o.value)
    if (o.value.startsWith('count-')) break
  }
  return r
}
describe('classic E — baking, cooking and card purchases', () => {
  it.each([1, 2])('E41 and E155 grant per-action and per-grain bonuses for %i grain', (count) => {
    const s = make([id(41), id(155)], (state) => {
      state.roundActionOrder[0] = 'grain-utilization'
      const p = state.players[0]!
      p.resources.grain = count
      p.improvements = ['Major_Fireplace1']
    })
    const r = accept(
      s,
      bakeChoice(s, ok(s.takeAction(0, 'grain-utilization')), 'Major_Fireplace1', count),
    )
    expect(r.state.players[0]!.resources).toMatchObject({ grain: 0, food: count * 3 + 2 })
  })
  it('E149 reacts to another player baking without granting its own extra food', () => {
    const s = make([], (state) => {
      state.roundActionOrder[0] = 'grain-utilization'
      for (const p of state.players.slice(0, 2)) {
        p.resources.grain = 1
        p.improvements = ['Major_Fireplace1']
      }
      state.players[1]!.occupationPlayed = [id(149)]
      state.players[2]!.occupationPlayed = [id(155)]
    })
    let r = bakeChoice(s, ok(s.takeAction(0, 'grain-utilization')), 'Major_Fireplace1')
    for (let i = 0; i < 12 && r.state.players[1]!.resources.grain > 0; i++) {
      if (r.interaction.stateId !== 'wait') break
      if (r.interaction.request.kind === 'confirm-player-switch') {
        r = ok(s.resolveChoice(r.interaction.request.fromPlayerIndex, 'confirm'))
        continue
      }
      const baked = bakeChoice(s, r, 'Major_Fireplace1')
      if (baked !== r) {
        r = baked
        continue
      }
      const o = sessionOptions(r).find(
        (o) => !['__skip__', '__pass__', '__done__'].includes(o.value),
      )
      expect(o, JSON.stringify(r.interaction)).toBeDefined()
      r = choose(s, r, o!.value)
    }
    r = accept(s, r)
    expect(r.state.players.map((p) => p.resources.food)).toEqual([2, 2, 2, 0])
    expect(r.state.players[1]!.resources.grain).toBe(0)
  })
  it('E149 gives one extra food for its owner ordinary baking', () => {
    const s = make([id(149)], (state) => {
      state.roundActionOrder[0] = 'grain-utilization'
      state.players[0]!.resources.grain = 2
      state.players[0]!.improvements = ['Major_Fireplace1']
    })
    const r = accept(
      s,
      bakeChoice(s, ok(s.takeAction(0, 'grain-utilization')), 'Major_Fireplace1', 2),
    )
    expect(r.state.players[0]!.resources).toMatchObject({ grain: 0, food: 5 })
  })
  it('E25 spices and E19 crock count a batch of two cooked vegetables once', () => {
    const s = make([id(25), id(19)], (state) => {
      state.players[0]!.resources.vegetable = 2
      state.players[0]!.improvements = ['Major_Fireplace1']
    })
    ok(s.takeAction(0, 'farmland'))
    let r = ok(s.takeAnytimeAction(0, 'exchange'))
    const o = sessionOptions(r).find(
      (o) =>
        o.sourceCard === 'Major_Fireplace1' && (o.effectPreview?.resourcesPaid?.vegetable ?? 0) > 0,
    )
    expect(o, JSON.stringify(r.interaction)).toBeDefined()
    const index = o!.value.split(':')[1]
    r = accept(s, ok(s.resolveChoice(0, `bulk:${index}=2`)))
    expect(r.state.players[0]!.resources).toMatchObject({ vegetable: 0, food: 7 })
  })
  it('E162 offers animal cooking only while an oven is owned', () => {
    const s = make([id(162)], (state) => {
      const p = state.players[0]!
      p.resources.boar = 1
      p.houseAnimals = { [`${p.roomTiles[0]!.row}-${p.roomTiles[0]!.col}`]: 'boar' }
      p.improvements = ['Major_ClayOven']
    })
    ok(s.takeAction(0, 'farmland'))
    let r = ok(s.takeAnytimeAction(0, 'exchange'))
    const o = sessionOptions(r).find(
      (o) => o.sourceCard === id(162) && o.effectPreview?.resourcesPaid?.boar === 1,
    )
    expect(o).toBeDefined()
    r = accept(s, choose(s, r, o!.value))
    expect(r.state.players[0]!.resources).toMatchObject({ boar: 0, food: 3 })
    const noOven = make([id(162)], (state) => {
      state.players[0]!.resources.boar = 1
    })
    expect(
      noOven
        .withCtx(() =>
          getExchangeCatalog({
            state: noOven.state,
            player: noOven.state.players[0]!,
            windows: ['anytime'],
          }),
        )
        .some((e) => e.sourceId === id(162)),
    ).toBe(false)
  })
  it('E15 buys Clay Oven on the minor-only action with one fewer clay', () => {
    const s = make([id(15)], (state) => {
      Object.assign(state.players[0]!.resources, { clay: 2, stone: 1 })
      state.availableMajorImprovements = ['Major_ClayOven']
    })
    const r = accept(s, buyInjected(s, 'Major_ClayOven'))
    expect(r.state.players[0]!.improvements).toContain('Major_ClayOven')
    expect(r.state.players[0]!.resources).toMatchObject({ clay: 0, stone: 0 })
  })
  it('E33 buys Pottery free on a minor-only action and removes it from supply', () => {
    const s = make([id(33)], (state) => {
      state.availableMajorImprovements = ['Major_Pottery']
    })
    const r = accept(s, buyInjected(s, 'Major_Pottery'))
    expect(r.state.players[0]!.improvements).toContain('Major_Pottery')
    expect(r.state.availableMajorImprovements).not.toContain('Major_Pottery')
    expect(r.state.players[0]!.resources).toMatchObject({ clay: 0, stone: 0 })
  })
  it('E14 returns a Clay Oven and immediately bakes two grain for ten food', () => {
    const s = make(
      [id(14)],
      (state) => {
        const p = state.players[0]!
        p.improvements = ['Major_ClayOven']
        p.resources.grain = 2
        state.availableMajorImprovements = state.availableMajorImprovements.filter(
          (c) => c !== 'Major_ClayOven',
        )
      },
      false,
    )
    let r = playMinor(s, id(14))
    for (let i = 0; i < 6 && r.state.players[0]!.resources.grain > 0; i++) {
      const baked = bakeChoice(s, r, id(14), 2)
      if (baked !== r) {
        r = baked
        continue
      }
      const o = sessionOptions(r).find(
        (o) => !['__skip__', '__pass__', '__done__', 'cancel'].includes(o.value),
      )
      expect(o, JSON.stringify(r.interaction)).toBeDefined()
      r = choose(s, r, o!.value)
    }
    r = accept(s, r)
    expect(r.state.players[0]!.improvements).not.toContain('Major_ClayOven')
    expect(r.state.availableMajorImprovements).toContain('Major_ClayOven')
    expect(r.state.players[0]!.resources).toMatchObject({ grain: 0, food: 10 })
    expect(r.state.players[0]!.minorPlayed).toContain(id(14))
  })
  it('E14 cannot be played without returning an oven', () => {
    const s = make([id(14)], undefined, false)
    const r = playMinor(s, id(14))
    expect(r.state.players[0]!.minorHand).toContain(id(14))
    expect(r.state.players[0]!.minorPlayed).not.toContain(id(14))
  })
  it('E184 pays eight times and consumes the shop from top to bottom', () => {
    const card = id(184),
      s = make([card], (state) => {
        const p = state.players[0]!
        p.resources.food = 8
        p.cardStates[card] = {
          stack: ['vegetable', 'reed', 'clay', 'wood', 'vegetable', 'stone', 'grain', 'reed'],
        }
      })
    ok(s.takeAction(0, 'farmland'))
    let r = s.getState()
    for (const resource of [
      'reed',
      'grain',
      'stone',
      'vegetable',
      'wood',
      'clay',
      'reed',
      'vegetable',
    ] as const) {
      const before = r.state.players[0]!.resources[resource]
      const a = r.interaction.anytimeActions.find(
        (a) => a.sourceCard === card || a.id.includes(card),
      )
      expect(a).toBeDefined()
      r = ok(s.takeAnytimeAction(0, a!.id))
      expect(r.state.players[0]!.resources[resource]).toBe(before + 1)
    }
    expect(r.state.players[0]!.resources.food).toBe(0)
    expect(r.state.players[0]!.cardStates[card]?.stack).toHaveLength(0)
    expect(r.interaction.anytimeActions.some((a) => a.id.includes(card))).toBe(false)
  })
  it('E50 renovates wood to clay at normal cost, then disappears from anytime options', () => {
    const card = id(50),
      s = make([card], (state) => Object.assign(state.players[0]!.resources, { clay: 2, reed: 1 }))
    ok(s.takeAction(0, 'farmland'))
    const a = s.getState().interaction.anytimeActions.find((a) => a.id.includes(card))
    expect(a).toBeDefined()
    const r = accept(s, ok(s.takeAnytimeAction(0, a!.id)))
    expect(r.state.players[0]!.houseType).toBe('clay')
    expect(r.state.players[0]!.resources).toMatchObject({ clay: 0, reed: 0 })
    expect(r.interaction.anytimeActions.some((a) => a.id.includes(card))).toBe(false)
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
    r = choose(s, r, o!.value)
  }
  return r
}
describe('classic E — remaining multi-step rules', () => {
  it.each([
    [151, 5, 'wood'],
    [191, 4, 'stone'],
  ] as const)('E%i grants exactly one free room', (number, rooms, houseType) => {
    const card = id(number),
      s = make([card], (state) => {
        const p = state.players[0]!
        p.rooms = rooms
        p.houseType = houseType
        p.roomTiles = [
          { row: 2, col: 0 },
          { row: 1, col: 0 },
          { row: 2, col: 1 },
          { row: 1, col: 1 },
          { row: 2, col: 2 },
        ].slice(0, rooms)
        p.cardStates[card] = { extraData: { hasRoom: true } }
      })
    ok(s.takeAction(0, 'farmland'))
    const a = s.getState().interaction.anytimeActions.find((a) => a.id.includes(card))
    expect(a).toBeDefined()
    let r = accept(s, ok(s.takeAnytimeAction(0, a!.id)))
    expect(r.interaction).toMatchObject({
      stateId: 'wait',
      request: { kind: 'farm-select', farm: { farmType: 'room' } },
    })
    if (
      r.interaction.stateId === 'wait' &&
      r.interaction.request.kind === 'farm-select' &&
      r.interaction.request.farm.farmType === 'room'
    )
      r = ok(
        s.commitSelectionChoice(0, { rooms: [r.interaction.request.farm.selectableTiles[0]!] }),
      )
    expect(r.state.players[0]!.rooms).toBe(rooms + 1)
    expect(r.state.players[0]!.resources).toMatchObject({ wood: 0, stone: 0, reed: 0 })
    expect(r.interaction.anytimeActions.some((a) => a.id.includes(card))).toBe(false)
  })
  it('E180 gains a vegetable then sows only one vegetable field', () => {
    const s = make(
      [id(180)],
      (state) => {
        state.players[0]!.fields = [
          { row: 0, col: 1, stacks: [] },
          { row: 0, col: 2, stacks: [] },
        ]
        Object.assign(state.players[0]!.resources, { grain: 1, vegetable: 1 })
      },
      false,
    )
    let r = accept(s, playOccupation(s, id(180)))
    expect(r.interaction).toMatchObject({ stateId: 'wait', request: { kind: 'farm-select' } })
    expect(s.commitSelectionChoice(0, { crops: [{ row: 0, col: 1, crop: 'grain' }] }).ok).toBe(
      false,
    )
    expect(
      s.commitSelectionChoice(0, {
        crops: [
          { row: 0, col: 1, crop: 'vegetable' },
          { row: 0, col: 2, crop: 'vegetable' },
        ],
      }).ok,
    ).toBe(false)
    r = ok(s.commitSelectionChoice(0, { crops: [{ row: 0, col: 1, crop: 'vegetable' }] }))
    expect(r.state.players[0]!.fields[0]!.stacks).toEqual([{ kind: 'vegetable', remaining: 2 }])
    expect(r.state.players[0]!.resources).toMatchObject({ vegetable: 1, grain: 1 })
  })
  it('E49 charges two food for its extra occupation after the normal lesson', () => {
    const s = make([id(49)], (state) => {
      state.players[0]!.occupationHand = [id(147), allId(148)]
      state.players[0]!.resources.food = 2
    })
    const r = accept(s, playOccupation(s, id(147)))
    expect(r.state.players[0]!.occupationPlayed).toEqual([id(147), allId(148)])
    expect(r.state.players[0]!.resources).toMatchObject({ food: 0, vegetable: 1 })
  })
  it('E192 provides the two food before paying a lesson', () => {
    const s = make([id(192)], (state) => {
      state.players[0]!.occupationHand = [id(147)]
    })
    const r = accept(s, playOccupation(s, id(147)))
    expect(r.state.players[0]!.occupationPlayed).toContain(id(147))
    expect(r.state.players[0]!.resources).toMatchObject({ food: 1, vegetable: 1 })
  })
  it('E159 uses an occupied family-growth space when a room is available', () => {
    const s = make([id(159)], (state) => {
      state.round = 14
      const p = state.players[0]!
      p.rooms = 3
      p.roomTiles.push({ row: 2, col: 1 })
      const space = state.actionSpaces.find((a) => a.id === 'wish-children')!
      space.roundAvailable = 1
      space.takenBy = [
        { playerId: state.players[1]!.id, workerId: state.players[1]!.workers[0]!.id },
      ]
    })
    const r = accept(s, s.takeAction(0, 'wish-children'))
    expect(r.state.players[0]!.workers.filter((w) => w.isActive)).toHaveLength(3)
  })
  it('E199 reduces renovation materials and E200 permits wood directly to stone', () => {
    const s = make([id(199), id(200)], (state) => {
      state.round = 14
      state.players[0]!.resources.reed = 1
      state.actionSpaces.find((a) => a.id === 'house-redevelopment')!.roundAvailable = 1
    })
    let r = ok(s.takeAction(0, 'house-redevelopment'))
    for (let i = 0; i < 5 && r.state.players[0]!.houseType === 'wood'; i++) {
      const o =
        sessionOptions(r).find((o) => o.value === 'stone') ??
        sessionOptions(r).find(
          (o) =>
            o.labelKey === 'actions.renovateHouse.name' ||
            o.value.startsWith('action-renovate-house-'),
        )
      expect(o, JSON.stringify(r.interaction)).toBeDefined()
      r = choose(s, r, o!.value)
    }
    expect(r.state.players[0]!.houseType).toBe('stone')
    expect(r.state.players[0]!.resources).toMatchObject({ reed: 0, stone: 0 })
  })
  it('E182 rewards its owner when another player builds a baking improvement', () => {
    const s = make(
      [allId(20)],
      (state) => {
        state.players[0]!.resources.clay = 1
        state.players[1]!.occupationPlayed = [id(182)]
      },
      false,
    )
    const r = accept(s, playMinor(s, allId(20)))
    expect(r.state.players[1]!.resources).toMatchObject({ wood: 1, food: 1 })
  })
  it.each([34, 196])('E%i returns wood to the action space', (number) => {
    const s = make([id(number)], (state) => {
      state.actionSpaces.find((a) => a.id === 'forest')!.resources.wood = 3
    })
    const r = accept(s, s.takeAction(0, 'forest'))
    expect(r.state.players[0]!.resources).toMatchObject({
      wood: number === 34 ? 1 : 2,
      food: number === 34 ? 3 : 2,
    })
    expect(r.state.actionSpaces.find((a) => a.id === 'forest')!.resources.wood).toBe(
      number === 34 ? 2 : 1,
    )
  })
  it('E153 removes only two of three begging cards at final scoring', () => {
    const s = make([id(153)], (state) => {
      state.round = 14
      for (const p of state.players) {
        p.resources.food = 100
        markAllWorkersUsed(state, p)
      }
      state.players[0]!.resources.begging = 3
    })
    const r = finishRound(s, s.performRoundEnd())
    expect(r.state.gameOver).toBe(true)
    expect(r.state.players[0]!.resources.begging).toBe(1)
  })
  it('E215 returns available animals and records a penalty for each missing species', () => {
    const s = make([id(215)], (state) => {
      state.round = 14
      for (const p of state.players) {
        p.resources.food = 100
        markAllWorkersUsed(state, p)
      }
      const p = state.players[0]!
      p.resources.sheep = 1
      p.houseAnimals = { [`${p.roomTiles[0]!.row}-${p.roomTiles[0]!.col}`]: 'sheep' }
    })
    const r = finishRound(s, s.performRoundEnd())
    expect(r.state.gameOver).toBe(true)
    expect(r.state.players[0]!.resources.sheep).toBe(0)
    expect(r.state.players[0]!.cardStates[id(215)]?.counters?.unreturned).toBe(2)
    const entries = r.scores?.[0]?.categories.flatMap((c) => c.entries ?? [])
    expect(
      entries
        ?.filter((e) => 'cardId' in e && e.cardId === id(215))
        .reduce((n, e) => n + e.score, 0),
    ).toBe(-2)
  })
})

describe('classic E — fence rewards and passing cards', () => {
  const edges = ['H-0-1', 'H-1-1', 'V-0-1', 'V-0-2']
  it.each([false, true])('E160 gives the first pig, then cattle (already fenced: %s)', (used) => {
    const card = id(160),
      s = make([card, id(175)], (state) => {
        state.round = 14
        state.players[0]!.resources.wood = 1
        state.players[0]!.cardStates[card] = { extraData: { fenced: used } }
      })
    accept(s, s.takeAction(0, 'fencing'))
    const r = accept(s, ok(s.commitSelectionChoice(0, { edges, palisadeEdges: [] })))
    expect(r.state.players[0]!.resources).toMatchObject({
      wood: 0,
      boar: used ? 0 : 1,
      cattle: used ? 1 : 0,
    })
    expect(r.state.players[0]!.fenceSegments).toHaveLength(4)
  })
  it.each([undefined, 14])(
    'E207 builds a free stable only if not already used this round (%s)',
    (usedRound) => {
      const card = id(207),
        s = make([card], (state) => {
          state.round = 14
          state.players[0]!.resources.wood = 4
          state.players[0]!.cardStates[card] = { extraData: { usedRound } }
        })
      accept(s, s.takeAction(0, 'fencing'))
      let r = accept(s, ok(s.commitSelectionChoice(0, { edges, palisadeEdges: [] })))
      if (usedRound === undefined) {
        expect(r.interaction).toMatchObject({
          stateId: 'wait',
          request: { kind: 'farm-select', farm: { farmType: 'stable' } },
        })
        if (
          r.interaction.stateId === 'wait' &&
          r.interaction.request.kind === 'farm-select' &&
          r.interaction.request.farm.farmType === 'stable'
        )
          r = ok(
            s.commitSelectionChoice(0, {
              stables: [r.interaction.request.farm.selectableTiles[0]!],
            }),
          )
        expect(r.state.players[0]!.stableTiles).toHaveLength(1)
      } else expect(r.state.players[0]!.stableTiles).toHaveLength(0)
      expect(r.state.players[0]!.resources.wood).toBe(0)
    },
  )
  it('E55 pays the printed price, builds a free stone room and passes to the next player', () => {
    const card = id(55),
      s = make(
        [card],
        (state) => {
          const p = state.players[0]!
          p.houseType = 'stone'
          Object.assign(p.resources, getCardDefinition(card)!.cost)
        },
        false,
      )
    let r = accept(s, playMinor(s, card))
    expect(r.interaction).toMatchObject({
      stateId: 'wait',
      request: { kind: 'farm-select', farm: { farmType: 'room' } },
    })
    if (
      r.interaction.stateId === 'wait' &&
      r.interaction.request.kind === 'farm-select' &&
      r.interaction.request.farm.farmType === 'room'
    )
      r = ok(
        s.commitSelectionChoice(0, { rooms: [r.interaction.request.farm.selectableTiles[0]!] }),
      )
    expect(r.state.players[0]!.rooms).toBe(3)
    expect(r.state.players[0]!.resources.stone).toBe(0)
    expect(r.state.players[1]!.minorHand).toContain(card)
  })
  it.each([16, 42])('E%i grants one chosen good then passes', (number) => {
    const card = id(number),
      s = make([card], undefined, false),
      r = accept(s, playMinor(s, card))
    expect(
      r.state.players[0]!.resources.wood +
        r.state.players[0]!.resources.clay +
        r.state.players[0]!.resources.reed +
        r.state.players[0]!.resources.stone,
    ).toBe(1)
    expect(r.state.players[1]!.minorHand).toContain(card)
    expect(r.state.players[0]!.minorPlayed).not.toContain(card)
  })
  it.each([0, 2])(
    'E164 requires the visitor to transfer two food (visitor starts with %i)',
    (food) => {
      const card = id(164),
        s = make([], (state) => {
          state.players[1]!.occupationPlayed = [card]
          state.players[0]!.resources.food = food
        })
      const state = s.getState().state
      const space = state.actionSpaces.find((a) => a.id === card)
      expect(space).toBeDefined()
      space!.resources.wood = 4
      s.loadState(state)
      const r = s.takeAction(0, card)
      if (food === 0) {
        expect(r.ok).toBe(false)
        expect(r.state.players[0]!.resources.wood).toBe(0)
      } else {
        ok(r)
        expect(r.state.players[0]!.resources).toMatchObject({ food: 0, wood: 4 })
        expect(r.state.players[1]!.resources.food).toBe(2)
      }
    },
  )
})

it('E19 counts two grain baked in a Fireplace as two goods converted to food', () => {
  const s = make([id(19)], (state) => {
    state.roundActionOrder[0] = 'grain-utilization'
    state.players[0]!.resources.grain = 2
    state.players[0]!.improvements = ['Major_Fireplace1']
  })
  const r = accept(
    s,
    bakeChoice(s, ok(s.takeAction(0, 'grain-utilization')), 'Major_Fireplace1', 2),
  )
  expect(r.state.players[0]!.resources).toMatchObject({ grain: 0, food: 5 })
})
