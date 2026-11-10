import { afterEach, describe, expect, it } from 'vitest'
import type { GameState } from '../../shared/contract/types'
import { GameSession, type SessionResponse } from '../game/authoritative-session'
import { createWorkSession } from './_helpers/session-fixtures'
import { getActiveCardRegistry } from '../../shared/cards/active-registry'
import { markAllWorkersUsed } from '../../shared/domain/player'
import { rehydrateState, serializeSessionSnapshot } from '../../shared/session/serialization'
import { OLD_K276_Constable } from '../../shared/cards/classic/K/OLD_K276_Constable'
import { OLD_K282_HouseSteward } from '../../shared/cards/classic/K/OLD_K282_HouseSteward'
import { OLD_K283_WoodDeliveryman } from '../../shared/cards/classic/K/OLD_K283_WoodDeliveryman'
import { OLD_K285_Tinsmith } from '../../shared/cards/classic/K/OLD_K285_Tinsmith'
import { OLD_K287_StorehouseClerk } from '../../shared/cards/classic/K/OLD_K287_StorehouseClerk'
import { OLD_K288_StorehouseKeeper } from '../../shared/cards/classic/K/OLD_K288_StorehouseKeeper'
import { OLD_K277_Manufacturer } from '../../shared/cards/classic/K/OLD_K277_Manufacturer'
import { OLD_K279_Scholar } from '../../shared/cards/classic/K/OLD_K279_Scholar'

const cards = [
  OLD_K276_Constable,
  OLD_K282_HouseSteward,
  OLD_K283_WoodDeliveryman,
  OLD_K285_Tinsmith,
  OLD_K287_StorehouseClerk,
  OLD_K288_StorehouseKeeper,
  OLD_K277_Manufacturer,
  OLD_K279_Scholar,
]
const sessions: GameSession[] = []
afterEach(() => sessions.splice(0).forEach(session => session.dispose()))
function bind(session: GameSession) {
  session.withCtx(() => cards.forEach(card => getActiveCardRegistry()!.loadImpl(card.meta.id, card.impl)))
  return session
}

function setup(cardId: string, configure?: (state: GameState) => void, played = true) {
  const session = createWorkSession({
    seed: 7287,
    options: { playerCount: 4, gameEdition: 'classic' },
    configure(state) {
      for (const player of state.players) player.resources.food = 40
      const owner = state.players[0]!
      owner.occupationPlayed = played ? [cardId] : []
      owner.occupationHand = played ? ['__test_placeholder__'] : [cardId]
      configure?.(state)
    },
  })
  sessions.push(session)
  return bind(session)
}

function play(session: GameSession, cardId: string) {
  let response = session.takeAction(0, 'lessons')
  expect(response.ok, response.error).toBe(true)
  if (response.interaction.stateId === 'wait' && response.interaction.request.kind === 'choice') {
    expect(response.interaction.request.options.map(option => option.value)).toContain(cardId)
    response = session.resolveChoice(0, cardId)
  }
  expect(response.ok, response.error).toBe(true)
  expect(response.state.players[0]!.occupationPlayed).toContain(cardId)
  expect(response.state.log).toContainEqual(expect.objectContaining({ key: 'log.playOccupation' }))
  expect(response.scores).toHaveLength(4)
  return response
}

function bonus(response: SessionResponse, id: string) {
  return response.scores!.map(score => score.categories.flatMap(category => category.entries)
    .filter(entry => entry.type === 'bonus' && entry.cardId === id)
    .reduce(
      (sum, entry) => sum + entry.score,
      0
    ))
}

function nextRound(session: GameSession) {
  session.state.players.forEach(player => markAllWorkersUsed(session.state, player))
  session.loadState(session.state)
  bind(session)
  const response = session.performRoundEnd()
  expect(response.ok, response.error).toBe(true)
  return response
}

function choiceOptions(response: SessionResponse) {
  if (response.interaction.stateId !== 'wait' || response.interaction.request.kind !== 'choice') throw new Error('Expected choices')
  return response.interaction.request.options
}

describe(
  'classic K early occupations — shared scores and timed gains',
  () => {
    it.each([OLD_K276_Constable.meta.id, OLD_K282_HouseSteward.meta.id])(
      '%s pays the old wood threshold when really played',
      cardId => {
        const session = setup(cardId, state => {
          state.round = 11
        }, false)
        expect(play(session, cardId).state.players[0]!.resources.wood).toBe(2)
      }
    )
    it(
      'K276 gives five points to each eligible player, including nonowners, and none for begging',
      () => {
        const cardId = OLD_K276_Constable.meta.id
        const session = setup(
          cardId,
          state => {
            state.players.forEach((player, index) => {
              player.roomTiles = [{ row: 0, col: 0 }, { row: 0, col: 1 }]
              player.rooms = 2
              player.fields = [{ row: 0, col: 2, stacks: [] }, { row: 0, col: 3, stacks: [] }]
              player.pastures = [{
                id: 'full-farm',
                animalType: 'sheep',
                animalCount: 1,
                tiles: [
                  { row: 0, col: 4 },
                  ...Array.from({ length: 10 }, (_, tile) => ({ row: 1 + Math.floor(tile / 5), col: tile % 5 })),
                ],
              },]
              Object.assign(player.resources, { grain: 1, vegetable: 1, sheep: 1, boar: 1, cattle: 1, begging: index % 2 === 0 ? 1 : 0 })
            })
          }
        )
        const response = session.getState()
        expect(bonus(response, cardId)).toEqual([0, 5, 0, 5])
        expect(response.interaction.stateId).toBe('idle')
        expect(session.getState().scores).toEqual(response.scores)
      }
    )
    it(
      'K282 awards all tied room leaders and does not privilege its owner',
      () => {
        const cardId = OLD_K282_HouseSteward.meta.id
        const session = setup(
          cardId,
          state => {
            for (const index of [1, 3]) {
              state.players[index]!.roomTiles.push({ row: 0, col: 0 })
              state.players[index]!.rooms = 3
            }
          }
        )
        expect(bonus(session.getState(), cardId)).toEqual([0, 3, 0, 3])
      }
    )
    it(
      'K283 schedules only later rounds 8–14, survives recovery and collects one wood in round 8',
      () => {
        const cardId = OLD_K283_WoodDeliveryman.meta.id
        let session = setup(cardId, state => {
          state.round = 7
        }, false)
        const bought = play(session, cardId)
        expect(bought.state.futureMeeples.filter(entry => entry.cardId === cardId).map(entry => entry.round)).toEqual([8, 9, 10, 11, 12, 13, 14])
        session = bind(new GameSession(rehydrateState(JSON.parse(JSON.stringify(serializeSessionSnapshot(session.state, session))))))
        sessions.push(session)
        const response = nextRound(session)
        expect(response.state.round).toBe(8)
        expect(response.state.players[0]!.resources.wood).toBe(1)
        expect(response.state.futureMeeples.filter(entry => entry.cardId === cardId).map(entry => entry.round)).toEqual([9, 10, 11, 12, 13, 14])
        expect(response.state.events).toContainEqual(expect.objectContaining({ type: 'resource.moved', sourceCardId: cardId, resources: { wood: 1 } }))
        expect(response.scores).toHaveLength(4)
      }
    )
    it.each([false, true])(
      'K287 uses each threshold independently once at round start (eligible=%s)',
      eligible => {
        const cardId = OLD_K287_StorehouseClerk.meta.id
        const session = setup(
          cardId,
          state => Object.assign(
            state.players[0]!.resources,
            {
              wood: eligible ? 8 : 7,
              clay: eligible ? 7 : 6,
              reed: eligible ? 6 : 5,
              stone: eligible ? 5 : 4,
            }
          )
        )
        const response = nextRound(session)
        expect(response.state.round).toBe(2)
        expect(response.state.players[0]!.resources).toMatchObject(eligible ? { wood: 9, clay: 8, reed: 7, stone: 6 } : { wood: 7, clay: 6, reed: 5, stone: 4 })
        expect(response.interaction.stateId).toBe('idle')
        expect(response.scores).toHaveLength(4)
      }
    )
  }
)

describe(
  'classic K early occupations — exchange and taking goods',
  () => {
    it.each([undefined, 'Major_Well', 'OLD_I66_VillageWell'])(
      'K285 checks wells belonging to any player: %s',
      well => {
        const cardId = OLD_K285_Tinsmith.meta.id
        const session = setup(
          cardId,
          state => {
            state.players[0]!.resources.clay = 2
            if (well === 'Major_Well') state.players[1]!.improvements = [well]
            else if (well) state.players[2]!.minorPlayed = [well]
          }
        )
        let response = session.takeAnytimeAction(0, 'exchange')
        const recipes = choiceOptions(response).filter(option => option.sourceCard === cardId)
        const improved = recipes.find(option => option.effectPreview?.kind === 'resourceExchange' && option.effectPreview.resourcesPaid?.clay === 2 && option.effectPreview.resourcesGained?.food === 3)
        expect(Boolean(improved)).toBe(Boolean(well))
        const option = improved ?? recipes[0]!
        expect(option).toBeDefined()
        const foodBefore = response.state.players[0]!.resources.food
        response = session.resolveChoice(0, option.value)
        expect(response.ok, response.error).toBe(true)
        expect(response.state.players[0]!.resources).toMatchObject({ clay: 0, food: foodBefore + (well ? 3 : 2) })
        expect(response.state.events).toContainEqual(expect.objectContaining({ type: 'resource.exchanged', exchangeSource: cardId }))
        expect(response.scores).toHaveLength(4)
      }
    )
    it(
      'K288 takes both goods before offering exactly one clay or grain and rejects invalid choices',
      () => {
        const cardId = OLD_K288_StorehouseKeeper.meta.id
        const session = setup(cardId)
        let response = session.takeAction(0, 'resource-market-4')
        expect(response.ok, response.error).toBe(true)
        expect(response.state.players[0]!.resources).toMatchObject({ reed: 1, stone: 1, clay: 0, grain: 0 })
        const options = choiceOptions(response)
        expect(options).toHaveLength(2)
        const grain = options.find(option => option.effectPreview?.kind === 'resourceExchange' && option.effectPreview.resourcesGained?.grain === 1)
        expect(grain, JSON.stringify(options)).toBeDefined()
        expect(session.resolveChoice(0, 'invalid-k288').ok).toBe(false)
        response = session.resolveChoice(0, grain!.value)
        expect(response.ok, response.error).toBe(true)
        expect(response.state.players[0]!.resources).toMatchObject({ reed: 1, stone: 1, clay: 0, grain: 1 })
        expect(response.state.events).toContainEqual(expect.objectContaining({ type: 'resource.moved', sourceCardId: cardId, resources: { grain: 1 } }))
        expect(response.scores).toHaveLength(4)
      }
    )
    it(
      'K288 does not trigger on taking reed alone or on another player’s market use',
      () => {
        const cardId = OLD_K288_StorehouseKeeper.meta.id
        const session = setup(cardId)
        const response = session.takeAction(0, 'reed-bank')
        expect(response.ok, response.error).toBe(true)
        expect(response.state.players[0]!.resources).toMatchObject({ clay: 0, grain: 0 })
        expect(response.interaction).toMatchObject({ stateId: 'wait', request: { kind: 'confirm-next-player' } })
        expect(session.resolveChoice(0, 'confirm').ok).toBe(true)
        const other = session.takeAction(1, 'resource-market-4')
        expect(other.ok, other.error).toBe(true)
        expect(other.state.players[1]!.resources).toMatchObject({ reed: 1, stone: 1, clay: 0, grain: 0 })
      }
    )
    it(
      'K288 follows actual mixed goods on an accumulation space, not its printed name',
      () => {
        const cardId = OLD_K288_StorehouseKeeper.meta.id
        const session = setup(
          cardId,
          state => {
            Object.assign(state.actionSpaces.find(space => space.id === 'reed-bank')!.resources, { reed: 1, stone: 1 })
          }
        )
        let response = session.takeAction(0, 'reed-bank')
        expect(response.ok, response.error).toBe(true)
        expect(response.state.players[0]!.resources).toMatchObject({ reed: 1, stone: 1 })
        const clay = choiceOptions(response).find(option => option.effectPreview?.kind === 'resourceExchange' && option.effectPreview.resourcesGained?.clay === 1)!
        expect(clay).toBeDefined()
        response = session.resolveChoice(0, clay.value)
        expect(response.ok, response.error).toBe(true)
        expect(response.state.players[0]!.resources).toMatchObject({ clay: 1, grain: 0 })
      }
    )
  }
)

describe(
  'classic K early occupations — development permissions',
  () => {
    it.each([
      ['Major_Joinery', { wood: 0, stone: 2 }],
      ['Major_Pottery', { clay: 1, stone: 1 }],
      ['Major_Basket', { reed: 2, stone: 0 }],
    ] as const)(
      'K277 builds %s during a minor-only action and waives exactly two goods',
      (target, resources) => {
        const session = setup(
          OLD_K277_Manufacturer.meta.id,
          state => {
            const owner = state.players[0]!
            owner.houseType = 'clay'
            Object.assign(owner.resources, { wood: 0, clay: 0, reed: 0, stone: 0 }, resources)
          }
        )
        let response = session.takeAction(0, 'meeting-place')
        expect(response.ok, response.error).toBe(true)
        const accept = choiceOptions(response).find(option => option.labelKey === 'actions.improvement.name')
        if (accept) response = session.resolveChoice(0, accept.value)
        if (!response.state.players[0]!.improvements.includes(target)) {
          const options = choiceOptions(response)
          expect(options.map(option => option.value)).toContain(target)
          response = session.resolveChoice(0, target)
        }
        expect(response.ok, response.error).toBe(true)
        expect(response.state.players[0]!.improvements).toContain(target)
        expect(response.state.players[0]!.resources).toMatchObject({ wood: 0, clay: 0, reed: 0, stone: 0 })
        expect(response.state.log).toContainEqual(expect.objectContaining({ key: 'log.playImprovement' }))
        expect(response.scores).toHaveLength(4)
      }
    )
    it(
      'K277 does not grant a wooden-house owner a major during a minor-only action',
      () => {
        const session = setup(
          OLD_K277_Manufacturer.meta.id,
          state => {
            Object.assign(state.players[0]!.resources, { wood: 2, clay: 2, reed: 2, stone: 2 })
            state.players[0]!.minorHand = ['OLD_E11_Field']
          }
        )
        let response = session.takeAction(0, 'meeting-place')
        expect(response.ok, response.error).toBe(true)
        const accept = choiceOptions(response).find(option => option.labelKey === 'actions.improvement.name')
        if (accept) response = session.resolveChoice(0, accept.value)
        expect(choiceOptions(response).some(option => option.value.startsWith('Major_'))).toBe(false)
        expect(session.resolveChoice(0, 'Major_Pottery').ok).toBe(false)
      }
    )
    it.each(['wood', 'clay'] as const)(
      'K279 is inactive in a %s house at round start',
      houseType => {
        const session = setup(
          OLD_K279_Scholar.meta.id,
          state => {
            state.players[0]!.houseType = houseType
            state.players[0]!.occupationHand = ['OLD_K276_Constable']
          }
        )
        const response = nextRound(session)
        expect(response.interaction.stateId).toBe('idle')
        expect(response.state.players[0]!.occupationHand).toContain('OLD_K276_Constable')
        expect(response.state.players[0]!.resources.food).toBe(40)
      }
    )
    it(
      'K279 can buy a major at round start at printed cost without using a worker',
      () => {
        const session = setup(
          OLD_K279_Scholar.meta.id,
          state => {
            state.players[0]!.houseType = 'stone'
            state.players[0]!.resources.clay = 2
          }
        )
        let response = nextRound(session)
        for (let step = 0; step < 4 && !response.state.players[0]!.improvements.includes('Major_Fireplace1'); step++) {
          const options = choiceOptions(response)
          const major = options.find(option => option.value === 'Major_Fireplace1')
          if (major) {
            response = session.resolveChoice(0, major.value);
            break
          }
          const improvement = options.find(option => option.labelKey === 'actions.improvement.name')
            ?? options.find(option => option.value !== '__skip__')
          expect(improvement, JSON.stringify(options)).toBeDefined()
          response = session.resolveChoice(0, improvement!.value)
        }
        expect(response.ok, response.error).toBe(true)
        expect(response.state.players[0]!.improvements).toContain('Major_Fireplace1')
        expect(response.state.players[0]!.resources.clay).toBe(0)
        expect(response.state.players[0]!.resources.food).toBe(40)
        expect(response.state.actionSpaces.every(space => space.takenBy.length === 0)).toBe(true)
        expect(response.state.log).toContainEqual(expect.objectContaining({ key: 'log.playImprovement' }))
        expect(response.scores).toHaveLength(4)
      }
    )
    it(
      'K279 pays exactly one food to play an occupation at round start',
      () => {
        const session = setup(
          OLD_K279_Scholar.meta.id,
          state => {
            state.players[0]!.houseType = 'stone'
            state.players[0]!.occupationHand = ['OLD_K276_Constable']
          }
        )
        let response = nextRound(session)
        for (let step = 0; step < 4 && !response.state.players[0]!.occupationPlayed.includes('OLD_K276_Constable'); step++) {
          const options = choiceOptions(response)
          const option = options.find(option => option.value === 'OLD_K276_Constable')
            ?? options.find(option => option.labelKey === 'actions.occupation.name')
            ?? options.find(option => option.value !== '__skip__')
          expect(option, JSON.stringify(options)).toBeDefined()
          response = session.resolveChoice(0, option!.value)
        }
        expect(response.ok, response.error).toBe(true)
        expect(response.state.players[0]!.occupationPlayed).toContain('OLD_K276_Constable')
        expect(response.state.players[0]!.resources.food).toBe(39)
        expect(response.state.actionSpaces.every(space => space.takenBy.length === 0)).toBe(true)
        expect(response.state.log).toContainEqual(expect.objectContaining({ key: 'log.playOccupation' }))
        expect(response.scores).toHaveLength(4)
      }
    )
    it(
      'K279 can decline its round-start offer without paying or playing anything',
      () => {
        const session = setup(
          OLD_K279_Scholar.meta.id,
          state => {
            state.players[0]!.houseType = 'stone'
            state.players[0]!.occupationHand = ['OLD_K276_Constable']
          }
        )
        let response = nextRound(session)
        expect(choiceOptions(response).map(option => option.value)).toContain('__skip__')
        response = session.resolveChoice(0, '__skip__')
        expect(response.ok, response.error).toBe(true)
        expect(response.interaction.stateId).toBe('idle')
        expect(response.state.players[0]!.occupationHand).toContain('OLD_K276_Constable')
        expect(response.state.players[0]!.resources.food).toBe(40)
      }
    )
  }
)
