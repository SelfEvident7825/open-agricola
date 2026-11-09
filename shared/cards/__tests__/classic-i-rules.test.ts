import { rehydrateState, serializeState } from '../../session/serialization'
import { describe, expect, it } from 'vitest'
import {
  executeExchangeBatch,
  getExchangeCatalog,
  validateExchangeBatch,
} from '../../actions/effects/exchange'
import { reap } from '../../actions/effects/reap'
import { normalizeFutureSchedule } from '../../actions/future-schedule'
import { canEnterSpace } from '../../actions/helpers/placement-availability'
import type { DraftGameEvent } from '../../contract/events'
import type { ActionFlow, Resource } from '../../contract/types'
import { computeAnimalZones } from '../../domain/animal-zones'
import { availableWorkers, familySize, getFamilyTokenLimit } from '../../domain/player'
import { getOwnOrdinaryFenceReserveCount } from '../../domain/supply-tokens'
import { returnSupplyWorkers } from '../../domain/supply-workers'
import { createInitialState } from '../../session/state-bootstrap'
import {
  getCardEffect,
  getHarvestFeedingOrderPriority,
  isWorkerPlacementBlocked,
} from '../card-effects'
import { classicMinors, classicOccupations } from '../catalog'
import { deriveVirtualTileCol, getLogicalFields, mutateLogicalFields } from '../helpers/card-field'
import { readCardExtraData } from '../helpers/card-state'
import { ALL_CARD_IMPLS } from '../register-all'
import { installOfficialCardRegistry } from './card-environment'
installOfficialCardRegistry()
const cards = [...classicMinors, ...classicOccupations]
const id = (n: number) => cards.find((c) => c.id.startsWith(`OLD_I${n}_`))!.id
const setup = (numbers: number[] = []) => {
  const state = createInitialState(42, {
    playerCount: 4,
    gameEdition: 'classic',
    ordinaryCardDeckSeed: 42,
  })
  const player = state.players[0]!
  for (const p of state.players) {
    p.minorPlayed = []
    p.occupationPlayed = []
    p.improvements = []
    p.cardStates = {}
    for (const k of Object.keys(p.resources)) p.resources[k as keyof Resource] = 0
  }
  for (const n of numbers) {
    const card = id(n)
    ;(classicOccupations.some((c) => c.id === card)
      ? player.occupationPlayed
      : player.minorPlayed
    ).push(card)
  }
  return { state, player }
}
const flowGains = (flow: ActionFlow | void): Partial<Resource> => {
  if (!flow) return {}
  if (flow.type === 'leaf')
    return flow.actionId === 'gain' ? (flow.params as Partial<Resource>) : {}
  const result: Partial<Resource> = {}
  for (const child of flow.children)
    for (const [key, value] of Object.entries(flowGains(child)))
      result[key as keyof Resource] = (result[key as keyof Resource] ?? 0) + (value ?? 0)
  return result
}

describe('classic I — four-player printed rules', () => {
  it('all 91 source identities are playable and retain their artwork', () => {
    const deck = cards.filter((c) => c.deck === 'I')
    expect(deck).toHaveLength(91)
    expect(
      deck.every((c) => c.implemented === true && c.artUrl?.startsWith('/assets/classic/I/I')),
    ).toBe(true)
    expect(deck.every((c) => ALL_CARD_IMPLS[c.id] !== undefined)).toBe(true)
  })
  it.each([
    [64, 1, 0],
    [64, 8, 7],
    [64, 14, 13],
    [221, 1, 4],
    [221, 8, 3],
    [221, 11, 2],
    [221, 13, 1],
    [221, 14, 0],
    [227, 1, 4],
    [227, 8, 3],
    [227, 11, 2],
    [227, 13, 1],
    [227, 14, 0],
  ])('I%i played in round %i grants %i food/wood', (n, round, amount) => {
    const { state, player } = setup([n])
    state.round = round
    expect(
      flowGains(getCardEffect(id(n))!.onBuy!(state, player))[n === 64 ? 'food' : 'wood'] ?? 0,
    ).toBe(amount)
  })
  it.each([
    [66, 11, [12, 13, 14], { food: 1 }],
    [72, 12, [13, 14], { food: 1 }],
    [69, 8, [9, 10, 11], { food: 1 }],
    [84, 10, [11, 12, 13, 14], { food: 1 }],
    [235, 10, [11, 12, 13, 14], { wood: 1 }],
    [250, 3, [7, 10, 12, 14], { sheep: 1 }],
    [250, 8, [12], { sheep: 1 }],
  ] as const)('I%i schedules exact future rounds from %i', (n, round, rounds, resources) => {
    const { state, player } = setup([n])
    state.round = round
    getCardEffect(id(n))!.onBuy!(state, player)
    const entries = state.pendingFutureMeeples.flatMap((r) => normalizeFutureSchedule(round, r))
    expect(entries.map((e) => e.round)).toEqual(rounds)
    expect(entries.every((e) => JSON.stringify(e.resources) === JSON.stringify(resources))).toBe(
      true,
    )
  })
  const recipes = [
    [65, 'bake-bread', 'grain', 5, 2],
    [75, 'harvest', 'grain', 2, 2],
    [85, 'anytime', 'vegetable', 4, 0],
    [85, 'anytime', 'sheep', 2, 0],
    [85, 'anytime', 'boar', 3, 0],
    [85, 'anytime', 'cattle', 4, 0],
    [85, 'bake-bread', 'grain', 3, 0],
    [98, 'harvest', 'vegetable', 4, 1],
    [247, 'anytime', 'sheep', 1, 0],
    [247, 'anytime', 'boar', 2, 0],
    [247, 'anytime', 'cattle', 3, 0],
    [256, 'harvest', 'stone', 3, 1],
    [258, 'harvest', 'wood', 2, 1],
  ] as const
  it.each(recipes)('I%i converts %s %s into %i food', (n, window, resource, food, max) => {
    const { state, player } = setup([n])
    player.resources[resource] = 5
    state.roundPhase = window === 'harvest' ? 'harvest' : 'work'
    const recipe = getExchangeCatalog({
      state,
      player,
      windows: [window],
    }).find((t) => t.sourceId === id(n) && t.from[resource] === 1)!
    expect(recipe).toBeDefined()
    const entry = {
      trade: recipe.trade,
      count: 1,
      ...(window === 'harvest' ? { harvestRound: state.round } : {}),
    }
    expect(
      executeExchangeBatch({
        state,
        player,
        entries: [entry],
        reorganizeAnimals: false,
      }).type,
    ).toBe('ok')
    expect(player.resources[resource]).toBe(4)
    expect(player.resources.food).toBe(food)
    if (max && window === 'harvest')
      expect(
        validateExchangeBatch({
          state,
          player,
          entries: [{ ...entry, count: max }],
        }),
      ).toBe(false)
  })
  it.each([5, 6, 7])(
    'I98 scores the fifth and sixth vegetables, including fields (%i)',
    (total) => {
      const { state, player } = setup([98])
      player.resources.vegetable = total - 2
      player.fields = [{ row: 0, col: 1, stacks: [{ kind: 'vegetable', remaining: 2 }] }]
      expect(
        getCardEffect(id(98))!.computeBonusScore!(state, player, {
          categories: [],
        }),
      ).toBe(Math.min(2, total - 4))
    },
  )
  it.each([
    [0, 0],
    [1, 1],
    [2, 1],
    [3, 2],
    [4, 2],
    [5, 3],
    [7, 3],
  ])('I246 gives food at the old cattle thresholds (%i)', (cattle, food) => {
    const { state, player } = setup([246])
    player.resources.cattle = cattle
    expect(flowGains(getCardEffect(id(246))!.onHarvestFieldPhase!(state, player)).food ?? 0).toBe(
      food,
    )
    expect(
      getCardEffect(id(246))!.computeBonusScore!(state, player, {
        categories: [],
      }),
    ).toBe(Math.floor(cattle / 2))
  })
  it('I93 counts animals of every player only during real harvest', () => {
    const { state, player } = setup([93])
    state.players[1]!.resources.sheep = 5
    state.players[2]!.resources.cattle = 6
    expect(flowGains(getCardEffect(id(93))!.onHarvestFieldPhase!(state, player))).toEqual({
      food: 3,
    })
    expect(getCardEffect(id(93))!.onAfterReap).toBeUndefined()
  })
  it.each([
    [83, 89, 0],
    [89, 94, 0],
    [94, 83, 2],
    [83, 83, 2],
  ])('only the highest road scores: I%i vs I%i', (own, other, expected) => {
    const { state, player } = setup([own])
    state.players[1]!.minorPlayed = [id(other)]
    expect(
      getCardEffect(id(own))!.computeBonusScore!(state, player, {
        categories: [],
      }),
    ).toBe(expected)
  })
  it('I73 provides an independent next-round guest, never a sixth family member', () => {
    const { state, player } = setup([73])
    state.round = 6
    player.workers.forEach((w) => {
      w.isActive = true
      w.isNewborn = false
    })
    getCardEffect(id(73))!.onBuy!(state, player)
    player.minorPlayed = [] // passing must not cancel the guest
    expect(availableWorkers(state, player)).toHaveLength(5)
    expect(familySize(player)).toBe(5)
    expect(getFamilyTokenLimit(player)).toBe(5)
    returnSupplyWorkers(state)
    state.round = 7
    expect(availableWorkers(state, player)).toHaveLength(6)
    const restored = rehydrateState(
      JSON.parse(JSON.stringify(serializeState(state, { actionHooks: undefined }))),
    ).state
    expect(availableWorkers(restored, restored.players[0]!)).toHaveLength(6)
    returnSupplyWorkers(state)
    expect(availableWorkers(state, player)).toHaveLength(5)
  })
  it.each([13, 14])('I71 blocks all round-14 workers, including a guest (%i)', (round) => {
    const { state, player } = setup([71, 73])
    state.round = 13
    getCardEffect(id(73))!.onBuy!(state, player)
    state.round = round
    expect(isWorkerPlacementBlocked(state, player)).toBe(round === 14)
    expect(availableWorkers(state, player)).toHaveLength(round === 14 ? 3 : 2)
  })
  it('I78 has two independently counted fields, harvests and mutates both', () => {
    const { state, player } = setup([78])
    expect(cards.find((c) => c.id === id(78))!.cardField?.separateFields).toBe(true)
    const m = mutateLogicalFields(state, player)
    for (let i = 0; i < 2; i++)
      expect(m.place({ row: -1, col: deriveVirtualTileCol(id(78), i) }, 'wood', 3).ok).toBe(true)
    expect(getLogicalFields(player).filter((f) => f.stacks.length)).toHaveLength(2)
    expect(reap(state, player).reapSummary.resources).toEqual({ wood: 2 })
    expect(getLogicalFields(player).map((f) => f.stacks[0]?.remaining)).toEqual([2, 2])
  })
  it.each(['harvest', 'private-field-phase'])(
    'I226 retains farm and card vegetables during %s',
    (phase) => {
      const { state, player } = setup([226])
      const field = 'OLD_E18_BeanField'
      player.minorPlayed.push(field)
      player.fields = [{ row: 0, col: 1, stacks: [{ kind: 'vegetable', remaining: 1 }] }]
      mutateLogicalFields(state, player).place({ fieldId: 'card:' + field }, 'vegetable', 1)
      const events: DraftGameEvent[] = []
      reap(
        state,
        player,
        { emit: (e) => events.push(e), emitMany: (es) => events.push(...es) },
        { trigger: { phase } },
      )
      expect(player.resources.vegetable).toBe(2)
      expect(getLogicalFields(player).map((f) => f.stacks[0]?.remaining)).toEqual([1, 1])
      expect(events.filter((e) => e.type === 'farm.cropRemoved')).toHaveLength(0)
      expect(
        events.filter((e) => e.type === 'resource.moved').every((e) => e.from.kind === 'supply'),
      ).toBe(true)
    },
  )
  it('I238 reveals only future spaces, grants exclusive early access, then releases naturally', () => {
    const { state, player } = setup([238])
    state.round = 10
    const effect = getCardEffect(id(238))!
    effect.onRoundStart!(state, player)
    expect(state.actionSpaces.some((s) => s.exclusiveUse)).toBe(false)
    state.round = 11
    effect.onRoundStart!(state, player)
    for (const space of state.actionSpaces.filter((s) => s.exclusiveUse)) {
      expect(canEnterSpace(space, player, state)).toBe(true)
      expect(canEnterSpace(space, state.players[1]!, state)).toBe(false)
      expect(
        canEnterSpace(space, state.players[1]!, {
          ...state,
          round: space.exclusiveUse!.untilRound,
        }),
      ).toBe(true)
    }
  })
  it.each([1, 5, 9])('I265 reserves only deliverable fences (played round %i)', (round) => {
    const { state, player } = setup([265])
    state.round = round
    getCardEffect(id(265))!.onBuy!(state, player)
    const count = round === 1 ? 8 : round === 5 ? 4 : 0
    expect(getOwnOrdinaryFenceReserveCount(player)).toBe(15 - count)
    if (count) {
      state.round = round + 6
      getCardEffect(id(265))!.onRoundStart!(state, player)
      expect(getOwnOrdinaryFenceReserveCount(player)).toBe(19 - count)
    }
  })
  it('I263 takes one actual supply fence and binds its chosen action space', () => {
    const { state, player } = setup([263])
    getCardEffect(id(263))!.resolveChoice!(state, player, 'forest', {
      sourceCard: id(263),
    })
    expect(readCardExtraData(player, id(263), 'space')).toBe('forest')
    expect(getOwnOrdinaryFenceReserveCount(player)).toBe(14)
  })
  it('I97 feeds later without changing the priority of the other three players', () => {
    const { state } = setup([97])
    expect(state.players.map((p) => getHarvestFeedingOrderPriority(state, p))).toEqual([1, 0, 0, 0])
  })
  it('I221 awards all tied leaders and counts Village Well once', () => {
    const { state, player } = setup([221, 66])
    state.players[1]!.improvements = ['Major_Well']
    expect(getCardEffect(id(221))!.computeSharedPostScore!(state, player, [])).toEqual([
      { playerId: player.id, score: 3 },
      { playerId: state.players[1]!.id, score: 3 },
    ])
  })
  it('I102 combines the two named capacity extensions while keeping their restrictions', () => {
    const { state, player } = setup([102])
    player.minorPlayed.push('OLD_E59_DrinkingTrough')
    player.occupationPlayed.push('OLD_E29_ShepherdsPipe')
    expect(computeAnimalZones(player, state).find((z) => z.cardId === id(102))?.capacity).toBe(7)
    const effect = getCardEffect(id(102))!
    const zone = computeAnimalZones(player, state).find((z) => z.cardId === id(102))!
    expect(
      effect.getInvalidAnimals!(
        player,
        zone,
        [
          ...Array(3).fill({ type: 'sheep' }),
          ...Array(3).fill({ type: 'boar' }),
          { type: 'cattle' },
        ],
        state,
      ),
    ).toHaveLength(0)
    expect(
      effect.getInvalidAnimals!(player, zone, Array(4).fill({ type: 'boar' }), state),
    ).toHaveLength(1)
  })
})
