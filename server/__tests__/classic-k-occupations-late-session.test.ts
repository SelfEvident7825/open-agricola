import { describe, expect, it } from 'vitest'
import { ALL_CARD_IMPLS } from '../../shared/cards/register-all'
import type { GameState, Resource } from '../../shared/contract/types'
import { familySize, markAllWorkersUsed } from '../../shared/domain/player'
import { captureStateWithHistory } from '../../shared/session/history-streams'
import { GameSession, type SessionResponse } from '../game/authoritative-session'
import { createWorkSession } from './_helpers/session-fixtures'
import { createScenarioEvidence } from './_helpers/scenario-evidence'
import { getChoiceOptions, assertRejectedUnchanged } from './_helpers/session-assertions'
import { playOccupation } from './_helpers/card-regression-session'
import { build as buildRooms } from './_helpers/audit/ae-negative-28-construct'

/* Test plan: all scenarios use a fresh four-player classic work session, fixed hands,
 * empty played zones and zeroed resources unless stated. Public commands cover
 * source-qualified gains, extra food, cost alternatives, delayed purchases,
 * worker relocation, animal housing and breeding, cross-player receipts, random
 * recovery and constrained fencing. Assertions include state, waits, logs and
 * scores; unplayed cards and unrelated actions are negative controls. */
const evidence = createScenarioEvidence(import.meta.url)
const id = (number: number) => Object.keys(ALL_CARD_IMPLS).find(key => key.startsWith(`OLD_K${number}_`))!
const make = (cards: number[], configure?: (state: GameState) => void, played = true) => evidence.track(createWorkSession({
  options: { playerCount: 4, gameEdition: 'classic' },
  configure: state => {
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
    if (played) p.occupationPlayed = cards.map(id)
    else p.occupationHand = cards.map(id)
    configure?.(state)
  },
}))
const ok = (response: SessionResponse) => {
  expect(response.ok, response.error + ' ' + JSON.stringify(response.interaction)).toBe(true)
  expect(response.scores).toHaveLength(4)
  expect(Array.isArray(response.state.log)).toBe(true)
  return response
}
type SettleOptions = {
  round?: boolean
  stop?: (response: SessionResponse) => boolean
  choose?: (response: SessionResponse) => string | undefined
}
const settle = (s: GameSession, response: SessionResponse, options: SettleOptions = {}) => {
  let r = ok(response)
  for (let n = 0; n < 80 && r.interaction.stateId === 'wait'; n++) {
    if (options.stop?.(r)) break
    const i = r.interaction
    if (i.request.kind === 'farm-select' || i.request.kind === 'selection') break
    if (i.request.kind === 'confirm-next-player') {
      if (!options.round) break
      r = ok(s.resolveChoice(i.request.nextPlayerIndex, 'confirm'))
      continue
    }
    if (i.request.kind === 'confirm-player-switch') {
      r = ok(s.resolveChoice(i.request.fromPlayerIndex, 'confirm'))
      continue
    }
    if (i.request.kind === 'animal-reorg') {
      r = ok(s.resolveChoice(i.playerIndex, 'confirm', { zones: i.request.zones }))
      continue
    }
    if (i.request.kind === 'feed') {
      r = ok(s.resolveChoice(i.playerIndex, 'confirm', { selections: [] }))
      continue
    }
    const choices = getChoiceOptions(r).filter(option => !option.disabled)
    const wanted = options.choose?.(r)
    const next = choices.find(option => option.value === wanted)
      ?? choices.find(option => !['__skip__', '__pass__', '__done__', 'cancel'].includes(option.value) && option.labelKey !== 'actions.exchange.name')
      ?? choices.find(option => ['__skip__', '__pass__', '__done__', 'cancel'].includes(option.value))
    expect(next, JSON.stringify(i)).toBeDefined()
    r = ok(s.resolveChoice(i.playerIndex, next!.value))
  }
  evidence.record('settled', {
    resources: r.state.players.map(p => p.resources),
    interaction: r.interaction,
    log: r.state.log.slice(0, 3),
    scores: r.scores,
  })
  return r
}
const endRound = (state: GameState) => {
  for (const p of state.players) markAllWorkersUsed(state, p)
}
const recover = (s: GameSession) => evidence.track(new GameSession({
  state: captureStateWithHistory(s.state),
  sessionCursor: s.createSessionPrivateCursor(),
}))
const animalHome = (state: GameState, kind: 'sheep' | 'boar' | 'cattle', count: number) => {
  const p = state.players[0]!
  p.resources[kind] = count
  p.pastures = [{ id: 'animals', tiles: [{ row: 0, col: 1 }, { row: 0, col: 2 }], animalType: kind, animalCount: count }]
}

describe('classic K late occupations — four-player source-qualified actions', () => {
  it.each([
    [290, 'forest', { wood: 3 }, { wood: 3, clay: 1 }],
    [290, 'clay-pit', { clay: 2 }, { clay: 3 }],
    [292, 'vegetable-seeds', {}, { vegetable: 1, grain: 2 }],
    [296, 'grain-seeds', {}, { grain: 2 }],
  ] as const)('K%i grants the printed reward at %s and undoes it', (number, space, pile, expected) => {
    const s = make([number], state => {
      state.round = 9
      state.roundActionOrder[0] = space
      Object.assign(state.actionSpaces.find(a => a.id === space)!.resources, pile)
    })
    const before = { ...s.state.players[0]!.resources }
    const r = settle(s, s.takeAction(0, space))
    expect(r.state.players[0]!.resources).toMatchObject(expected)
    expect(r.state.log.length).toBeGreaterThan(0)
    expect(ok(s.undoAction()).state.players[0]!.resources).toEqual(before)
  })

  it.each([290, 292, 296, 311])('K%i in hand does not grant a reward', number => {
    const s = make([number], state => {
      state.actionSpaces.find(a => a.id === 'forest')!.resources.wood = 3
    }, false)
    const r = settle(s, s.takeAction(0, 'forest'))
    expect(r.state.players[0]!.resources).toMatchObject({ wood: 3, clay: 0, grain: 0, food: 0 })
  })

  it.each([false, true])('K311 requires the last available person (%s)', last => {
    const s = make([311], state => {
      const p = state.players[0]!
      if (last) {
        state.actionSpaces.find(a => a.id === 'forest')!.takenBy.push({
          playerId: p.id, workerId: p.workers.find(w => w.isActive)!.id,
        })
      }
      state.actionSpaces.find(a => a.id === 'traveling-players')!.resources.food = 2
    })
    const r = settle(s, s.takeAction(0, 'traveling-players'))
    expect(r.state.players[0]!.resources).toMatchObject({ food: last ? 3 : 2, grain: last ? 1 : 0 })
  })

  it('K291 pays its separate four-food cost, then grows without a room', () => {
    const s = make([291], state => {
      state.players[0]!.resources.food = 6
    }, false)
    const r = settle(s, playOccupation(s, id(291)))
    expect(r.state.players[0]!.resources.food).toBe(2)
    expect(familySize(r.state.players[0]!)).toBe(3)
    expect(r.state.players[0]!.occupationPlayed).toContain(id(291))
  })

  it('K291 converts an unaffordable individual food remainder into begging after confirmation', () => {
    const s = make([291], state => {
      state.players[0]!.resources.food = 1
    }, false)
    const pending = ok(playOccupation(s, id(291)))
    expect(pending.interaction.stateId).toBe('wait')
    const r = settle(s, pending)
    expect(r.state.players[0]!.resources).toMatchObject({ food: 0, begging: 3 })
    expect(familySize(r.state.players[0]!)).toBe(3)
  })

  it('K291 cannot be played without a legal family growth candidate', () => {
    const s = make([291], state => {
      const player = state.players[0]!
      player.resources.food = 8
      for (const worker of player.workers) worker.isActive = true
    }, false)
    assertRejectedUnchanged(s, () => s.takeAction(0, 'lessons'))
    expect(s.getState().state.players[0]!.resources.food).toBe(8)
    expect(s.getState().state.players[0]!.occupationHand).toContain(id(291))
  })

  it('K291 cannot use the temporary person to promote itself through lessons', () => {
    const s = make([291], state => {
      const player = state.players[0]!
      player.resources.food = 8
      for (const worker of player.workers.slice(0, 4)) worker.isActive = true
      player.workers[4]!.supplyUse = {
        sourceCard: 'OLD_K138_ReedHut', status: 'temporary',
        familyGrowthEligible: true, availableFromRound: 1,
      }
      state.actionSpaces.find(space => space.id === 'forest')!.takenBy = player.workers.slice(0, 4)
        .map(worker => ({ playerId: player.id, workerId: worker.id }))
    }, false)
    assertRejectedUnchanged(s, () => s.takeAction(0, 'lessons'))
    expect(s.getState().state.players[0]!.resources.food).toBe(8)
    expect(s.getState().state.actionSpaces.find(space => space.id === 'lessons')!.takenBy).toHaveLength(0)
  })

  it('K291 can convert an eligible Reed Hut person into the fifth family member', () => {
    const s = make([291], state => {
      const player = state.players[0]!
      player.resources.food = 8
      for (const worker of player.workers.slice(0, 4)) worker.isActive = true
      player.workers[4]!.supplyUse = {
        sourceCard: 'OLD_K138_ReedHut', status: 'temporary',
        familyGrowthEligible: true, availableFromRound: 1,
      }
    }, false)
    const r = settle(s, playOccupation(s, id(291)))
    expect(familySize(r.state.players[0]!)).toBe(5)
    expect(r.state.players[0]!.resources.food).toBe(4)
    expect(r.state.players[0]!.workers[4]!.supplyUse).toBeUndefined()
    expect(r.interaction).toMatchObject({ stateId: 'wait', request: { kind: 'confirm-next-player' } })
  })

  it('K294 replaces both room reeds with one wood', () => {
    const s = make([294], state => {
      state.players[0]!.resources.wood = 6
    })
    const { r } = buildRooms(s, 1, { wood: 6 })
    expect(r.state.players[0]!.rooms).toBe(3)
    expect(r.state.players[0]!.resources).toMatchObject({ wood: 0, reed: 0 })
  })

  it('K303 offers an anytime stone renovation and pays the regular costs', () => {
    const s = make([303], state => {
      state.players[0]!.houseType = 'clay'
      Object.assign(state.players[0]!.resources, { stone: 2, reed: 1 })
    })
    const r = settle(s, s.takeAnytimeAction(0, id(303) + '-renovate'))
    expect(r.state.players[0]!.houseType).toBe('stone')
    expect(r.state.players[0]!.resources).toMatchObject({ stone: 0, reed: 0 })
  })

  it('K303 cannot renovate a wooden house through its anytime entry', () => {
    const s = make([303], state => Object.assign(state.players[0]!.resources, { stone: 4, reed: 2 }))
    assertRejectedUnchanged(s, () => s.takeAnytimeAction(0, id(303) + '-renovate'))
  })

  it('K299 pays its owner once for a batch cooked by another player', () => {
    const s = make([], state => {
      state.players[1]!.occupationPlayed = [id(299)]
      state.players[0]!.improvements = ['Major_CookingHearth1']
      animalHome(state, 'sheep', 2)
    })
    ok(s.takeAction(0, 'farmland'))
    let r = ok(s.takeAnytimeAction(0, 'exchange'))
    const option = getChoiceOptions(r).find(o => (o.effectPreview?.resourcesPaid?.sheep ?? 0) > 0)!
    expect(option).toBeDefined()
    r = settle(s, s.resolveChoice(0, 'bulk:' + option.value.split(':')[1] + '=2'))
    expect(r.state.players[0]!.resources.food).toBe(4)
    expect(r.state.players[1]!.resources.food).toBe(1)
  })
})

describe('classic K late occupations — schedules and round transitions', () => {
  it.each([293, 302])('K%i schedules only remaining +4/+7/+10 rounds when played', number => {
    const s = make([number], state => {
      state.round = 6
    }, false)
    const r = settle(s, playOccupation(s, id(number)))
    expect(r.state.futureMeeples.filter(m => m.cardId === id(number)).map(m => m.round)).toEqual([10, 13])
    const restored = recover(s).getState()
    expect(restored.state.futureMeeples).toEqual(r.state.futureMeeples)
  })

  it('K298 schedules sheep only when the house is already stone', () => {
    for (const type of ['wood', 'clay', 'stone'] as const) {
      const s = make([298], state => {
        state.round = 11
        state.players[0]!.houseType = type
      }, false)
      const r = settle(s, playOccupation(s, id(298)))
      expect(r.state.futureMeeples.filter(m => m.cardId === id(298)).map(m => m.round)).toEqual(type === 'stone' ? [12, 13, 14] : [])
    }
  })

  it('K295 gives a cow when played and breeds cattle again at round 12 end', () => {
    const purchased = make([295], undefined, false)
    expect(settle(purchased, playOccupation(purchased, id(295))).state.players[0]!.resources.cattle).toBe(1)
    const s = make([295], state => {
      state.round = 12
      animalHome(state, 'cattle', 2)
      endRound(state)
    })
    const r = settle(s, s.performRoundEnd(), { round: true })
    expect(r.state.players[0]!.resources.cattle).toBe(3)
  })

  it.each([1, 2])('K309 checks the two-sheep threshold at work start (%i)', count => {
    const s = make([309], state => {
      animalHome(state, 'sheep', count)
      endRound(state)
    })
    const r = settle(s, s.performRoundEnd(), { round: true })
    expect(r.state.round).toBe(2)
    expect(r.state.players[0]!.resources.food).toBe(count === 2 ? 1 : 0)
  })

  it('K305 records the exact future animal offers when played late', () => {
    const s = make([305], state => {
      state.round = 8
    }, false)
    const r = settle(s, playOccupation(s, id(305)))
    expect(r.state.players[0]!.cardStates[id(305)]?.extraData?.scheduledOffers).toEqual([
      { id: id(305) + '-10', kind: 'animal-purchase', dueRound: 10, animal: 'boar', cost: { food: 1 }, consumed: false },
      { id: id(305) + '-14', kind: 'animal-purchase', dueRound: 14, animal: 'cattle', cost: { food: 1 }, consumed: false },
    ])
  })

  it('K304 preserves the seeded draw and bag after recovery', () => {
    const s = make([304], state => {
      state.players[0]!.cardStates[id(304)] = { extraData: { bag: ['sheep', 'sheep', 'sheep', 'sheep', 'boar', 'boar', 'boar', 'cattle', 'cattle'] } }
      endRound(state)
    })
    const first = settle(s, s.performRoundEnd(), { round: true })
    const restored = recover(s)
    const second = ok(restored.getState())
    expect(first.state.players[0]!.cardStates[id(304)]).toEqual(second.state.players[0]!.cardStates[id(304)])
    expect(first.state.players[0]!.resources).toEqual(second.state.players[0]!.resources)
    expect(first.state.rngTick).toBe(1)
    expect(first.state.players[0]!.cardStates[id(304)]?.extraData?.drawRound).toBe(2)
  })

  it('K308 restores its pending placement and rejects unrevealed spaces', () => {
    const s = make([308], endRound)
    const pending = settle(s, s.performRoundEnd(), { round: true, stop: r => getChoiceOptions(r).some(o => o.value === 'forest') })
    expect(getChoiceOptions(pending).some(o => o.value === 'vegetable-seeds')).toBe(false)
    const restored = recover(s)
    expect(restored.getState().interaction).toEqual(pending.interaction)
    assertRejectedUnchanged(restored, () => restored.resolveChoice(0, 'vegetable-seeds'))
    const before = restored.state.actionSpaces.find(a => a.id === 'forest')!.resources.food
    const r = settle(restored, restored.resolveChoice(0, 'forest'), { round: true })
    expect(r.state.actionSpaces.find(a => a.id === 'forest')!.resources.food).toBe(before + 1)
    expect(r.state.players[0]!.resources.food).toBe(0)
    expect(r.state.events.some(e => e.type === 'resource.moved' && e.sourceCardId === id(308))).toBe(true)
  })
})

describe('classic K late occupations — payments, board choices and recovery', () => {
  it('K289 moves its grain-seeds person to sow at the end of work, preserving person count', () => {
    const s = make([289], state => {
      const p = state.players[0]!
      state.roundActionOrder[0] = 'grain-utilization'
      p.resources.grain = 1
      p.fields = [{ row: 0, col: 1, stacks: [] }]
      state.actionSpaces.find(a => a.id === 'grain-seeds')!.takenBy.push({ playerId: p.id, workerId: p.workers.find(w => w.isActive)!.id })
      endRound(state)
    })
    let r = settle(s, s.performRoundEnd(), { round: true })
    expect(r.interaction).toMatchObject({ stateId: 'wait', playerIndex: 0, request: { kind: 'farm-select', farm: { farmType: 'sow' } } })
    expect(r.state.actionSpaces.find(a => a.id === 'grain-seeds')!.takenBy).toHaveLength(0)
    expect(r.state.actionSpaces.find(a => a.id === 'grain-utilization')!.takenBy).toHaveLength(1)
    r = settle(s, s.commitSelectionChoice(0, { crops: [{ row: 0, col: 1, crop: 'grain' }] }), { round: true })
    expect(r.state.players[0]!.fields[0]!.stacks).toEqual([{ kind: 'grain', remaining: 3 }])
    expect(familySize(r.state.players[0]!)).toBe(2)
  })

  it('K289 cannot move to an occupied sowing action', () => {
    const s = make([289], state => {
      const p = state.players[0]!
      const other = state.players[1]!
      state.roundActionOrder[0] = 'grain-utilization'
      p.resources.grain = 1
      p.fields = [{ row: 0, col: 1, stacks: [] }]
      state.actionSpaces.find(a => a.id === 'grain-seeds')!.takenBy.push({ playerId: p.id, workerId: p.workers.find(w => w.isActive)!.id })
      state.actionSpaces.find(a => a.id === 'grain-utilization')!.takenBy.push({ playerId: other.id, workerId: other.workers.find(w => w.isActive)!.id })
      endRound(state)
    })
    const r = settle(s, s.performRoundEnd(), { round: true })
    expect(r.state.players[0]!.fields[0]!.stacks).toEqual([])
    expect(r.state.players[0]!.resources.grain).toBe(1)
  })

  it('K293 charges one food for its due field and preserves the later fields', () => {
    const s = make([293], state => {
      state.round = 4
      for (const p of state.players) p.resources.food = 10
      state.futureMeeples = [{ id: 'field-5', cardId: id(293), playerId: state.players[0]!.id, round: 5, actionId: null, resources: { field: 1 }, actionContext: { exactCost: { food: 1 } } }]
      endRound(state)
    })
    const pending = settle(s, s.performRoundEnd(), { round: true })
    expect(pending.interaction).toMatchObject({ stateId: 'wait', request: { kind: 'farm-select', farm: { farmType: 'plow' } } })
    const r = settle(s, s.commitSelectionChoice(0, { tile: { row: 0, col: 1 } }), { round: true })
    expect(r.state.players[0]!.fields).toHaveLength(1)
    expect(r.state.players[0]!.resources.food).toBe(5)
    expect(r.state.futureMeeples).toHaveLength(0)
  })

  it('K297 gains an extra sheep from the action space and exchanges three for a pig and cow', () => {
    const s = make([297], state => {
      state.roundActionOrder[0] = 'sheep-market'
      animalHome(state, 'sheep', 0)
      state.actionSpaces.find(a => a.id === 'sheep-market')!.resources.sheep = 2
    })
    let r = settle(s, s.takeAction(0, 'sheep-market'), { stop: r => r.state.players[0]!.resources.sheep === 3 && r.interaction.stateId === 'wait' && r.interaction.request.kind === 'animal-reorg' })
    expect(r.state.players[0]!.resources.sheep).toBe(3)
    r = ok(s.takeAnytimeAction(0, 'exchange'))
    const option = getChoiceOptions(r).find(o => o.effectPreview?.resourcesPaid?.sheep === 3 && o.effectPreview?.resourcesGained?.boar === 1)!
    expect(option).toBeDefined()
    r = settle(s, s.resolveChoice(0, option.value))
    expect(r.state.players[0]!.resources).toMatchObject({ sheep: 0, boar: 1, cattle: 1 })
  })

  it('K300 rejects a second vegetable and converts one during feeding', () => {
    const s = make([300], state => {
      state.round = 4
      state.players[0]!.resources.vegetable = 2
      for (const p of state.players.slice(1)) p.resources.food = 10
      endRound(state)
    })
    const pending = settle(s, s.performRoundEnd(), { round: true, stop: r => r.interaction.stateId === 'wait' && r.interaction.request.kind === 'feed' && r.interaction.playerIndex === 0 })
    expect(pending.interaction).toMatchObject({ stateId: 'wait', request: { kind: 'feed', maxTradeTimesBySourceId: { [id(300)]: 1 } } })
    assertRejectedUnchanged(s, () => s.resolveChoice(0, 'confirm', { selections: [{ sourceId: id(300), exchangeIndex: 0, count: 2, sourceName: id(300) }] }))
    const r = settle(s, s.resolveChoice(0, 'confirm', { selections: [{ sourceId: id(300), exchangeIndex: 0, count: 1, sourceName: id(300) }] }), { round: true })
    expect(r.state.players[0]!.resources).toMatchObject({ vegetable: 1, food: 1, begging: 0 })
    expect(r.state.events.some(e => e.type === 'harvest.feedConverted' && e.source === id(300))).toBe(true)
  })

  it('K301 discounts a two-room build by one wood total and consumes the round use', () => {
    const s = make([301], state => Object.assign(state.players[0]!.resources, { wood: 9, reed: 4 }))
    const { r } = buildRooms(s, 2, { wood: 9, reed: 4 })
    expect(r.state.players[0]!.rooms).toBe(4)
    expect(r.state.players[0]!.cardStates[id(301)]?.extraData?.usedRound).toBe(1)
  })

  it('K305 charges its food when the scheduled sheep is accepted', () => {
    const s = make([305], state => {
      state.round = 6
      state.players[0]!.resources.food = 1
      state.players[0]!.cardStates[id(305)] = { extraData: { scheduledOffers: [{ id: 'sheep-offer', kind: 'animal-purchase', dueRound: 7, animal: 'sheep', cost: { food: 1 }, consumed: false }] } }
      endRound(state)
    })
    const r = settle(s, s.performRoundEnd(), { round: true })
    expect(r.state.players[0]!.resources).toMatchObject({ food: 0, sheep: 1 })
    expect(r.state.players[0]!.cardStates[id(305)]?.extraData?.scheduledOffers).toMatchObject([{ consumed: true, consumedRound: 7 }])
  })

  it('K306 stores two different species in distinct rooms and survives recovery', () => {
    const s = make([306], state => {
      state.roundActionOrder[0] = 'pig-market'
      const p = state.players[0]!
      p.resources.sheep = 1
      p.houseAnimals = { '2-0': 'sheep' }
      state.actionSpaces.find(a => a.id === 'pig-market')!.resources.boar = 1
    })
    const pending = ok(s.takeAction(0, 'pig-market'))
    expect(pending.interaction).toMatchObject({ stateId: 'wait', request: { kind: 'animal-reorg' } })
    if (pending.interaction.stateId !== 'wait' || pending.interaction.request.kind !== 'animal-reorg') throw new Error('Expected housing')
    const rooms = pending.interaction.request.zones.filter(z => z.zoneType === 'house')
    expect(rooms).toHaveLength(2)
    const zones = rooms.map((z, i) => ({ ...z, animalType: i === 0 ? 'sheep' : 'boar', animalCount: 1 }))
    let r = settle(s, s.resolveChoice(0, 'confirm', { zones }))
    expect(Object.values(r.state.players[0]!.houseAnimals).sort()).toEqual(['boar', 'sheep'])
    r = ok(recover(s).getState())
    expect(Object.values(r.state.players[0]!.houseAnimals).sort()).toEqual(['boar', 'sheep'])
  })

  it('K307 purchases two sheep after enclosing new unused farmyard space', () => {
    const s = make([307], state => {
      state.roundActionOrder[0] = 'fencing'
      Object.assign(state.players[0]!.resources, { wood: 4, food: 1 })
    })
    ok(s.takeAction(0, 'fencing'))
    const r = settle(s, s.commitSelectionChoice(0, { edges: ['H-0-1', 'H-1-1', 'V-0-1', 'V-0-2'] }))
    expect(r.state.players[0]!.resources).toMatchObject({ wood: 0, food: 0, sheep: 2 })
    expect(r.state.players[0]!.pastures).toHaveLength(1)
  })

  it('K310 consumes only the matching top resource and restores its stack on undo', () => {
    const s = make([310], state => {
      state.players[0]!.cardStates[id(310)] = { stack: ['stone', 'clay', 'stone', 'clay', 'reed', 'clay', 'wood'] }
      state.actionSpaces.find(a => a.id === 'forest')!.resources.wood = 3
    })
    const r = settle(s, s.takeAction(0, 'forest'))
    expect(r.state.players[0]!.resources.wood).toBe(4)
    expect(r.state.players[0]!.cardStates[id(310)]?.stack).toEqual(['stone', 'clay', 'stone', 'clay', 'reed', 'clay'])
    expect(ok(s.undoAction()).state.players[0]!.cardStates[id(310)]?.stack).toHaveLength(7)
  })

  it('K310 ignores another player receiving the top resource', () => {
    const s = make([], state => {
      state.players[1]!.occupationPlayed = [id(310)]
      state.players[1]!.cardStates[id(310)] = { stack: ['wood'] }
      state.actionSpaces.find(a => a.id === 'forest')!.resources.wood = 3
    })
    const r = settle(s, s.takeAction(0, 'forest'))
    expect(r.state.players[1]!.resources.wood).toBe(0)
    expect(r.state.players[1]!.cardStates[id(310)]?.stack).toEqual(['wood'])
  })

  it('K312 fences the newly built stable for one food and rejects other tiles', () => {
    const s = make([312], state => Object.assign(state.players[0]!.resources, { wood: 2, food: 1 }))
    let r = settle(s, s.takeAction(0, 'farm-expansion'), { choose: r => getChoiceOptions(r).find(o => o.labelKey === 'actions.stables.name')?.value })
    expect(r.interaction).toMatchObject({ stateId: 'wait', request: { kind: 'farm-select', farm: { farmType: 'stable' } } })
    r = settle(s, s.commitSelectionChoice(0, { stables: [{ row: 0, col: 1 }] }))
    expect(r.interaction).toMatchObject({ stateId: 'wait', request: { kind: 'farm-select', farm: { farmType: 'fence' } } })
    assertRejectedUnchanged(s, () => s.commitSelectionChoice(0, { edges: ['H-0-2', 'H-1-2', 'V-0-2', 'V-0-3'] }))
    r = settle(s, s.commitSelectionChoice(0, { edges: ['H-0-1', 'H-1-1', 'V-0-1', 'V-0-2'] }))
    expect(r.state.players[0]!.resources).toMatchObject({ food: 0, wood: 0 })
    expect(r.state.players[0]!.pastures[0]!.tiles).toEqual([{ row: 0, col: 1 }])
    expect(r.state.players[0]!.cardStates[id(312)]?.extraData?.usedRound).toBe(1)
  })

  it('K342 limits purchases to the food collected, not the existing food reserve', () => {
    const s = make([342], state => {
      state.players[0]!.resources.food = 10
      state.actionSpaces.find(a => a.id === 'traveling-players')!.resources.food = 2
    })
    const pending = ok(s.takeAction(0, 'traveling-players'))
    expect(pending.interaction.stateId).toBe('wait')
    const r = settle(s, pending)
    expect(r.state.players[0]!.resources.food).toBe(10)
    expect(r.state.players[0]!.resources.sheep + r.state.players[0]!.resources.boar).toBe(1)
    expect(r.state.players[0]!.resources.cattle).toBe(0)
  })
})

describe('classic K late occupations — cross-card and negative boundaries', () => {
  it('K299 and I97 settle last while retaining the next-round marker order', () => {
    const s = make([299], state => {
      state.round = 4
      state.players[1]!.minorPlayed = ['OLD_I97_Slaughterhouse']
      state.players.forEach((p, i) => {
        p.startPlayer = i === 3
        p.resources.grain = 1
      })
      endRound(state)
    })
    const order: number[] = []
    let r = ok(s.performRoundEnd())
    for (let n = 0; n < 70 && r.interaction.stateId === 'wait'; n++) {
      const i = r.interaction
      if (i.request.kind === 'feed') {
        order.push(i.playerIndex)
        r = ok(s.resolveChoice(i.playerIndex, 'confirm', { selections: [] }))
      } else if (i.request.kind === 'confirm-player-switch') {
        r = ok(s.resolveChoice(i.request.fromPlayerIndex, 'confirm'))
      } else if (i.request.kind === 'confirm-next-player') {
        r = ok(s.resolveChoice(i.request.nextPlayerIndex, 'confirm'))
      } else {
        const next = getChoiceOptions(r).find(o => o.value === '__pass__') ?? getChoiceOptions(r).find(o => !o.disabled)
        expect(next).toBeDefined()
        r = ok(s.resolveChoice(i.playerIndex, next!.value))
      }
    }
    expect(order).toEqual([3, 2, 0, 1])
    expect(r.state.players.map(p => p.resources.begging)).toEqual([4, 4, 4, 4])
  })

  it('K301 preserves the discount when a full-price room payment is selected', () => {
    const s = make([301], state => Object.assign(state.players[0]!.resources, { wood: 5, reed: 2 }))
    const { r } = buildRooms(s, 1, { wood: 5, reed: 2 })
    expect(r.state.players[0]!.cardStates[id(301)]?.extraData?.usedRound).toBeUndefined()
  })

  it('K305 declines an unaffordable offer without granting the animal', () => {
    const s = make([305], state => {
      state.round = 6
      state.players[0]!.cardStates[id(305)] = { extraData: { scheduledOffers: [{ id: 'unaffordable', kind: 'animal-purchase', dueRound: 7, animal: 'sheep', cost: { food: 1 }, consumed: false }] } }
      endRound(state)
    })
    const r = settle(s, s.performRoundEnd(), { round: true })
    expect(r.state.players[0]!.resources).toMatchObject({ food: 0, sheep: 0, begging: 0 })
    expect(r.state.players[0]!.cardStates[id(305)]?.extraData?.scheduledOffers).toMatchObject([{ consumed: true, consumedRound: 7 }])
  })

  it('K307 does not trigger when fencing only an already-used stable tile', () => {
    const s = make([307], state => {
      state.roundActionOrder[0] = 'fencing'
      Object.assign(state.players[0]!.resources, { wood: 4, food: 3 })
      state.players[0]!.stableTiles = [{ row: 0, col: 1 }]
    })
    ok(s.takeAction(0, 'fencing'))
    const r = settle(s, s.commitSelectionChoice(0, { edges: ['H-0-1', 'H-1-1', 'V-0-1', 'V-0-2'] }))
    expect(r.state.players[0]!.resources).toMatchObject({ food: 3, sheep: 0, boar: 0, cattle: 0 })
  })

  it('K312 consumes its once-per-round use before Stablehand builds another stable', () => {
    const s = make([312], state => {
      state.players[0]!.occupationPlayed.push('OLD_E207_Stablehand')
      Object.assign(state.players[0]!.resources, { wood: 2, food: 2 })
    })
    settle(s, s.takeAction(0, 'farm-expansion'), { choose: r => getChoiceOptions(r).find(o => o.labelKey === 'actions.stables.name')?.value })
    settle(s, s.commitSelectionChoice(0, { stables: [{ row: 0, col: 1 }] }))
    const nextStable = settle(s, s.commitSelectionChoice(0, { edges: ['H-0-1', 'H-1-1', 'V-0-1', 'V-0-2'] }))
    expect(nextStable.interaction).toMatchObject({ stateId: 'wait', request: { kind: 'farm-select', farm: { farmType: 'stable' } } })
    const r = settle(s, s.commitSelectionChoice(0, { stables: [{ row: 0, col: 2 }] }))
    expect(r.state.players[0]!.resources.food).toBe(1)
    expect(r.state.players[0]!.stableTiles).toHaveLength(2)
    expect(r.state.players[0]!.pastures).toHaveLength(1)
    expect(r.interaction).toMatchObject({ stateId: 'wait', request: { kind: 'confirm-next-player' } })
  })

  it('K312 does not charge for a stable that cannot form an adjacent pasture', () => {
    const s = make([312], state => {
      const p = state.players[0]!
      Object.assign(p.resources, { wood: 2, food: 1 })
      p.pastures = [{ id: 'existing', tiles: [{ row: 0, col: 1 }], animalType: null, animalCount: 0 }]
      p.fenceSegments = ['H-0-1', 'H-1-1', 'V-0-1', 'V-0-2'].map(edge => ({ edge, type: 'fence' }))
    })
    settle(s, s.takeAction(0, 'farm-expansion'), {
      choose: r => getChoiceOptions(r).find(o => o.labelKey === 'actions.stables.name')?.value,
    })
    const r = settle(s, s.commitSelectionChoice(0, { stables: [{ row: 2, col: 4 }] }))
    expect(r.state.players[0]!.resources).toMatchObject({ wood: 0, food: 1 })
    expect(r.state.players[0]!.pastures).toHaveLength(1)
    expect(r.state.players[0]!.cardStates[id(312)]?.extraData?.usedRound).toBeUndefined()
    expect(r.interaction).toMatchObject({ stateId: 'wait', request: { kind: 'confirm-next-player' } })
  })

  it('K342 can decline its purchase without spending food or gaining an animal', () => {
    const s = make([342], state => {
      state.actionSpaces.find(a => a.id === 'traveling-players')!.resources.food = 3
    })
    const r = settle(s, s.takeAction(0, 'traveling-players'), { choose: r => getChoiceOptions(r).find(o => o.value === '__skip__')?.value })
    expect(r.state.players[0]!.resources).toMatchObject({ food: 3, sheep: 0, boar: 0, cattle: 0 })
  })
})
