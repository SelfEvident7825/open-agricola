import { describe, expect, it } from 'vitest'
import type { ActionMutationContext, GameState, PlayerState, Resource, Worker } from '../../../contract/types'
import { familyGrowthAction } from '../family-growth'

const resources = (): Resource => ({
  wood: 0,
  clay: 0,
  reed: 0,
  stone: 0,
  food: 0,
  grain: 0,
  vegetable: 0,
  sheep: 0,
  boar: 0,
  cattle: 0,
  begging: 0,
})

const stats = (): PlayerState['stats'] => ({
  placedFarmers: 0,
  firstPlayerCount: 0,
  totalRoomsBuilt: 0,
  totalMajorBuilt: 0,
  totalMinorBuilt: 0,
  totalOccupationBuilt: 0,
  harvestedGrain: 0,
  harvestedVegetable: 0,
  resourcesFromBoard: {},
  resourcesFromCards: {},
  resourcesConverted: {},
  foodFromConversion: {},
  draftHistory: [],
  draftDiscarded: [],
})

const worker = (
  id: string,
  isActive: boolean,
  removedFromSupply = false,
): Worker => ({
  id,
  isActive,
  isNewborn: false,
  removedFromSupply,
})

const player = (workers: Worker[]): PlayerState => ({
  id: 'p1',
  name: 'Alice',
  color: 'red',
  resources: resources(),
  workers,
  rooms: 2,
  houseType: 'wood',
  fields: [],
  roomTiles: [],
  stableTiles: [],
  improvements: [],
  minorHand: [],
  minorPlayed: [],
  occupationHand: [],
  occupationPlayed: [],
  extraOccupationsFromCards: [],
  playedCards: [],
  houseAnimals: {},
  stableAnimals: {},
  pastures: [],
  fenceSegments: [],
  majorEffects: { wellRounds: 0 },
  startPlayer: false,
  activeModifiers: [],
  cardStates: {},
  stats: stats(),
  supplyTokensConsumed: {},
})

const state = (p: PlayerState): GameState => ({
  players: [p],
  actionSpaces: [],
} as unknown as GameState)

describe('family-growth supply gate', () => {
  it('does not treat existing temporary workers as growth candidates without an explicit capability', () => {
    const temporary = worker('3', false)
    temporary.supplyUse = { status: 'temporary', sourceCard: 'test-card', availableFromRound: 1 }
    const p = player([worker('1', true), worker('2', true), temporary])
    p.rooms = 3
    expect(familyGrowthAction.canBeExecutedByPlayer!(state(p), p)).toBe(false)
  })

  it('excludes the person performing growth while retaining ordinary newborn supply', () => {
    const temporary = worker('3', false)
    temporary.supplyUse = {
      status: 'temporary', sourceCard: 'test-card', availableFromRound: 1, familyGrowthEligible: true,
    }
    const p = player([worker('1', true), worker('2', true), temporary])
    p.rooms = 3
    const context = { actionContext: { placedWorkerId: '3' } }
    expect(familyGrowthAction.canBeExecutedByPlayer!(state(p), p, context)).toBe(false)
    p.workers.push(worker('4', false))
    expect(familyGrowthAction.canBeExecutedByPlayer!(state(p), p, context)).toBe(true)
  })

  it('promotes a placed eligible person without recalling it or recording another placement', () => {
    const temporary = worker('3', false)
    temporary.supplyUse = {
      status: 'temporary', sourceCard: 'test-card', availableFromRound: 1, familyGrowthEligible: true,
    }
    const p = player([worker('1', true), worker('2', true), temporary])
    p.rooms = 3
    const game = state(p)
    game.actionSpaces = [{ id: 'forest', takenBy: [{ playerId: p.id, workerId: '3' }] }] as GameState['actionSpaces']
    const context = {
      state: game, player: p, space: { id: 'wish-children' }, actionContext: { placedWorkerId: '1' },
    } as ActionMutationContext
    expect(familyGrowthAction.resolveChoice!(context, 'join-family:3')).toEqual({ type: 'ok' })
    expect(temporary).toMatchObject({ isActive: true, isNewborn: false })
    expect(temporary.supplyUse).toBeUndefined()
    expect(game.actionSpaces[0]!.takenBy).toEqual([{ playerId: p.id, workerId: '3' }])
    expect(p.stats.placedFarmers).toBe(0)
  })

  it('uses a relocated person identity rather than an earlier placement snapshot', () => {
    const temporary = worker('3', false)
    temporary.supplyUse = {
      status: 'temporary', sourceCard: 'test-card', availableFromRound: 1, familyGrowthEligible: true,
    }
    const p = player([worker('1', true), worker('2', true), temporary])
    p.rooms = 3
    expect(familyGrowthAction.canBeExecutedByPlayer!(state(p), p, {
      actionContext: { viaCardJump: true, workerId: '3', placedWorkerId: '1' },
    })).toBe(false)
    expect(familyGrowthAction.canBeExecutedByPlayer!(state(p), p, {
      actionContext: { viaCardJump: true, workerId: '1', placedWorkerId: '3' },
    })).toBe(true)
    expect(familyGrowthAction.canBeExecutedByPlayer!(state(p), p, {
      actionContext: { viaCardJump: true, placedWorkerId: '3' },
    })).toBe(true)
  })

  it('does not allow skip-room growth when all inactive workers were removed from supply', () => {
    const p = player([
      worker('1', true),
      worker('2', true),
      worker('3', false, true),
      worker('4', false, true),
      worker('5', false, true),
    ])

    expect(
      familyGrowthAction.canBeExecutedByPlayer!(
        state(p),
        p,
        { actionContext: { skipRoomCheck: true } },
      ),
    ).toBe(false)
  })
})
