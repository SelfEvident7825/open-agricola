import { afterEach, describe, expect, it } from 'vitest'
import { GameSession, type SessionResponse } from '../game/authoritative-session'
import { createWorkSession } from './_helpers/session-fixtures'
import type { GameState } from '../../shared/contract/types'
import { getActiveCardRegistry } from '../../shared/cards/active-registry'
import { markAllWorkersUsed, familySize, newbornCount, workersAvailable, setActiveWorkerCount } from '../../shared/domain/player'
import { deriveVirtualTileCol, getLogicalFields } from '../../shared/cards/helpers/card-field'
import { OLD_K266_Serf } from '../../shared/cards/classic/K/OLD_K266_Serf'
import { OLD_K267_AdoptiveParents } from '../../shared/cards/classic/K/OLD_K267_AdoptiveParents'
import { OLD_K268_Pieceworker } from '../../shared/cards/classic/K/OLD_K268_Pieceworker'
import { OLD_K270_WetNurse } from '../../shared/cards/classic/K/OLD_K270_WetNurse'
import { OLD_K271_Educator } from '../../shared/cards/classic/K/OLD_K271_Educator'
import { OLD_K272_FrameBuilder } from '../../shared/cards/classic/K/OLD_K272_FrameBuilder'
import { OLD_K273_BasinMaker } from '../../shared/cards/classic/K/OLD_K273_BasinMaker'
import { OLD_K274_OrganicFarmer } from '../../shared/cards/classic/K/OLD_K274_OrganicFarmer'
import { OLD_K278_Forester } from '../../shared/cards/classic/K/OLD_K278_Forester'
import { OLD_K280_Tanner } from '../../shared/cards/classic/K/OLD_K280_Tanner'
import { OLD_K276_Constable } from '../../shared/cards/classic/K/OLD_K276_Constable'
import { OLD_K145_ForestPasture } from '../../shared/cards/classic/K/OLD_K145_ForestPasture'
import { OLD_E58_AnimalYard } from '../../shared/cards/classic/E/OLD_E58_AnimalYard'
import { OLD_E59_DrinkingTrough } from '../../shared/cards/classic/E/OLD_E59_DrinkingTrough'
import { OLD_K282_HouseSteward } from '../../shared/cards/classic/K/OLD_K282_HouseSteward'

const cards = [
  OLD_K145_ForestPasture,
  OLD_E58_AnimalYard,
  OLD_E59_DrinkingTrough,
  OLD_K266_Serf,
  OLD_K267_AdoptiveParents,
  OLD_K268_Pieceworker,
  OLD_K270_WetNurse,
  OLD_K271_Educator,
  OLD_K272_FrameBuilder,
  OLD_K273_BasinMaker,
  OLD_K274_OrganicFarmer,
  OLD_K278_Forester,
  OLD_K280_Tanner,
  OLD_K276_Constable,
  OLD_K282_HouseSteward,
]
const sessions: GameSession[] = []
afterEach(() => sessions.splice(0).forEach(session => session.dispose()))
function make(played: string[], configure?: (state: GameState) => void) {
  const session = createWorkSession({
    seed: 7268,
    options: { playerCount: 4, gameEdition: 'classic' },
    configure(state) {
      state.players.forEach(player => {
        player.resources.food = 40
      })
      state.players[0]!.occupationPlayed = played
      configure?.(state)
    },
  })
  session.withCtx(() => cards.forEach(card => getActiveCardRegistry()!.loadImpl(card.meta.id, card.impl)))
  session.loadState(session.state)
  sessions.push(session)
  return session
}

function options(response: SessionResponse) {
  if (
    response.interaction.stateId !== 'wait' ||
    (response.interaction.request.kind !== 'choice' && response.interaction.request.kind !== 'select-trigger')
  ) {
    throw new Error('Expected choices: ' + JSON.stringify(response.interaction))
  }
  return response.interaction.request.options ?? []
}

function accept(session: GameSession, initial: SessionResponse) {
  let response = initial
  for (let step = 0; step < 30 && response.interaction.stateId === 'wait'; step++) {
    expect(response.ok, response.error).toBe(true)
    const interaction = response.interaction
    if (
      interaction.request.kind === 'farm-select' ||
      interaction.request.kind === 'animal-reorg' ||
      interaction.request.kind === 'confirm-next-player'
    ) break
    if (interaction.request.kind === 'confirm-player-switch') {
      response = session.resolveChoice(interaction.request.fromPlayerIndex, 'confirm')
      continue
    }
    const option = options(response).find(option => !option.disabled && !['__skip__', '__done__', '__pass__'].includes(option.value))
      ?? options(response).find(option => option.value === '__skip__')
    expect(option, JSON.stringify(response.interaction)).toBeDefined()
    response = session.resolveChoice(interaction.playerIndex, option!.value)
  }
  expect(response.ok, response.error).toBe(true)
  return response
}

function build(session: GameSession, count: number) {
  let response = accept(session, session.takeAction(0, 'farm-expansion'))
  expect(response.interaction).toMatchObject({ stateId: 'wait', request: { kind: 'farm-select', farm: { farmType: 'room' } } })
  response = session.commitSelectionChoice(0, { rooms: [{ row: 1, col: 1 }, { row: 2, col: 1 }].slice(0, count) })
  return accept(session, response)
}

function score(response: SessionResponse, cardId: string) {
  expect(response.scores).toHaveLength(4)
  return response.scores![0]!.categories.flatMap(category => category.entries)
    .filter(entry => entry.type === 'bonus' && entry.cardId === cardId).reduce(
      (total, entry) => total + entry.score,
      0
    )
}

describe(
  'classic K early occupations authoritative flows',
  () => {
    it(
      'K270 builds two rooms then pays for two newborns; K267 promotes only one after paying one more food',
      () => {
        const wet = OLD_K270_WetNurse.meta.id
        const adoptive = OLD_K267_AdoptiveParents.meta.id
        const session = make([wet, adoptive], state => Object.assign(state.players[0]!.resources, { wood: 10, reed: 4, food: 3 }))
        let response = build(session, 2)
        expect(response.state.players[0]!.rooms).toBe(4)
        expect(familySize(response.state.players[0]!)).toBe(4)
        expect(newbornCount(response.state.players[0]!)).toBe(2)
        expect(response.state.players[0]!.resources).toMatchObject({ wood: 0, reed: 0, food: 1 })
        expect(response.state.log.filter(entry => entry.key === 'log.familyGrowth')).toHaveLength(2)
        response = session.takeAnytimeAction(0, 'OLD_K267_AdoptiveParents-adoptive-parents-anytime-grow')
        expect(response.ok, response.error).toBe(true)
        expect(response.state.players[0]!.resources.food).toBe(0)
        expect(newbornCount(response.state.players[0]!)).toBe(1)
        expect(workersAvailable(response.state, response.state.players[0]!)).toBe(2)
        expect(session.takeAnytimeAction(0, 'OLD_K267_AdoptiveParents-adoptive-parents-anytime-grow').ok).toBe(false)
        expect(response.scores).toHaveLength(4)
      }
    )
    it.each([1, 3])(
      'K271 charges its owner correctly with %i already played occupations when another player teaches',
      count => {
        const educator = OLD_K271_Educator.meta.id
        const session = make(
          [educator, ...[OLD_K276_Constable.meta.id, OLD_K282_HouseSteward.meta.id].slice(0, count - 1)],
          state => {
            state.currentPlayerIndex = 1
            state.players[0]!.resources.food = 3
            state.players[0]!.occupationHand = [OLD_K274_OrganicFarmer.meta.id]
            state.players[1]!.occupationHand = [OLD_K276_Constable.meta.id]
          }
        )
        const response = accept(session, session.takeAction(1, 'lessons'))
        expect(response.state.players[0]!.occupationPlayed).toContain(OLD_K274_OrganicFarmer.meta.id)
        expect(response.state.players[0]!.resources.food).toBe(count === 1 ? 0 : 1)
        expect(response.state.players[1]!.occupationPlayed).toContain(OLD_K276_Constable.meta.id)
        expect(response.state.players[1]!.resources.food).toBe(40)
        expect(response.state.actionSpaces.filter(space => space.takenBy.some(worker => worker.playerId === response.state.players[0]!.id))).toHaveLength(0)
        expect(response.state.log.filter(entry => entry.key === 'log.playOccupation')).toHaveLength(2)
        expect(response.scores).toHaveLength(4)
      }
    )
    it(
      'K272 replaces two clay per room but only one clay in an entire renovation',
      () => {
        const card = OLD_K272_FrameBuilder.meta.id
        const building = make(
          [card],
          state => {
            state.players[0]!.houseType = 'clay'
            Object.assign(state.players[0]!.resources, { wood: 2, clay: 6, reed: 4 })
          }
        )
        const built = build(building, 2)
        expect(built.state.players[0]!.rooms).toBe(4)
        expect(built.state.players[0]!.resources).toMatchObject({ wood: 0, clay: 0, reed: 0 })
        const renovating = make(
          [card],
          state => {
            state.round = 6
            state.roundActionOrder[0] = 'house-redevelopment'
            Object.assign(state.players[0]!.resources, { wood: 1, clay: 1, reed: 1 })
          }
        )
        const renovated = accept(renovating, renovating.takeAction(0, 'house-redevelopment'))
        expect(renovated.state.players[0]!.houseType).toBe('clay')
        expect(renovated.state.players[0]!.resources).toMatchObject({ wood: 0, clay: 0, reed: 0 })
        expect(renovated.state.log).toContainEqual(expect.objectContaining({
          key: 'log.actionDetail',
          params: expect.objectContaining({ action: 'actions.renovate-house.name' }),
        }))
        expect(renovated.scores).toHaveLength(4)
      }
    )
    it(
      'K278 sows three wood columns and reaps all three into supply in one harvest',
      () => {
        const card = OLD_K278_Forester.meta.id
        const session = make(
          [card],
          state => {
            state.round = 4
            state.roundActionOrder[0] = 'grain-utilization'
            state.players[0]!.resources.wood = 3
          }
        )
        let response = accept(session, session.takeAction(0, 'grain-utilization'))
        expect(response.interaction).toMatchObject({ stateId: 'wait', request: { kind: 'farm-select', farm: { farmType: 'sow' } } })
        response = accept(
          session,
          session.commitSelectionChoice(
            0,
            { crops: [0, 1, 2].map(index => ({ row: -1, col: deriveVirtualTileCol(card, index), crop: 'wood' })) }
          )
        )
        expect(response.state.players[0]!.resources.wood).toBe(0)
        const fields = session.withCtx(() => getLogicalFields(response.state.players[0]!))
        expect(fields).toHaveLength(1)
        expect(fields[0]!.stacks.map(stack => stack.remaining)).toEqual([3, 3, 3])
        session.state.players.forEach(player => markAllWorkersUsed(session.state, player))
        session.loadState(session.state)
        response = accept(session, session.performRoundEnd())
        expect(response.state.players[0]!.resources.wood).toBe(3)
        expect(session.withCtx(() => getLogicalFields(response.state.players[0]!))[0]!.stacks.map(stack => stack.remaining)).toEqual([2, 2, 2])
        expect(response.scores).toHaveLength(4)
      }
    )
    it(
      'K273 and K280 count a batch of cooked boars once each, with Basin Maker paying only the wood actually stored',
      () => {
        const basin = OLD_K273_BasinMaker.meta.id
        const tanner = OLD_K280_Tanner.meta.id
        const session = make(
          [basin, tanner],
          state => {
            const owner = state.players[0]!
            owner.improvements = ['Major_Fireplace1']
            Object.assign(owner.resources, { boar: 2, wood: 4, food: 0 })
            owner.pastures = [{ id: 'boar', tiles: [{ row: 0, col: 0 }], animalType: 'boar', animalCount: 2 }]
          }
        )
        let response = session.takeAnytimeAction(0, 'exchange')
        const boar = options(response).find(option => option.effectPreview?.kind === 'resourceExchange' && (option.effectPreview.resourcesPaid?.boar ?? 0) > 0 && (option.effectPreview.resourcesGained?.food ?? 0) > 0)!
        expect(boar).toBeDefined()
        response = accept(session, session.resolveChoice(0, `bulk:${boar.value.split(':')[1]}=2`))
        expect(response.state.players[0]!.resources).toMatchObject({ boar: 0, wood: 0, food: 4 })
        expect(response.state.players[0]!.cardStates[basin]?.counters?.wood).toBe(4)
        expect(response.state.players[0]!.cardStates[tanner]?.counters?.boar).toBe(2)
        expect(score(response, basin)).toBe(2)
        expect(score(response, tanner)).toBe(1)
        expect(response.state.events.filter(event => event.type === 'resource.exchanged')).toHaveLength(1)
      }
    )
    it(
      'K268 buys one additional reed and stone independently after Resource Market',
      () => {
        const session = make([OLD_K268_Pieceworker.meta.id], state => {
          state.players[0]!.resources.food = 2
        })
        const response = accept(session, session.takeAction(0, 'resource-market-4'))
        expect(response.state.players[0]!.resources).toMatchObject({ reed: 2, stone: 2, food: 1 })
        expect(response.scores).toHaveLength(4)
      }
    )
    it(
      'K266 supplies grain before sowing and can sow it in that same action',
      () => {
        const session = make(
          [OLD_K266_Serf.meta.id],
          state => {
            state.roundActionOrder[0] = 'grain-utilization'
            state.players[0]!.fields = [{ row: 0, col: 0, stacks: [] }]
          }
        )
        let response = accept(session, session.takeAction(0, 'grain-utilization'))
        expect(response.state.players[0]!.resources.grain).toBe(1)
        response = accept(session, session.commitSelectionChoice(0, { crops: [{ row: 0, col: 0, crop: 'grain' }] }))
        expect(response.state.players[0]!.resources.grain).toBe(0)
        expect(response.state.players[0]!.fields[0]!.stacks).toEqual([{ kind: 'grain', remaining: 3 }])
        expect(response.state.log).toContainEqual(expect.objectContaining({ key: 'log.sow' }))
        expect(response.scores).toHaveLength(4)
      }
    )
    it(
      'K270 cannot grow for free and K267 cannot promote without a newborn',
      () => {
        const session = make(
          [OLD_K270_WetNurse.meta.id, OLD_K267_AdoptiveParents.meta.id],
          state => {
            Object.assign(state.players[0]!.resources, { wood: 5, reed: 2, food: 0 })
          }
        )
        const response = build(session, 1)
        expect(response.state.players[0]!.rooms).toBe(3)
        expect(familySize(response.state.players[0]!)).toBe(2)
        expect(response.state.log.filter(entry => entry.key === 'log.familyGrowth')).toHaveLength(0)
        expect(session.takeAnytimeAction(0, 'OLD_K267_AdoptiveParents-adoptive-parents-anytime-grow').ok).toBe(false)
        expect(response.scores).toHaveLength(4)
      }
    )
    it(
      'K271 cannot use the teaching opponent’s food when its owner cannot pay',
      () => {
        const session = make(
          [OLD_K271_Educator.meta.id],
          state => {
            state.currentPlayerIndex = 1
            state.players[0]!.resources.food = 2
            state.players[0]!.occupationHand = [OLD_K274_OrganicFarmer.meta.id]
            state.players[1]!.occupationHand = [OLD_K276_Constable.meta.id]
          }
        )
        const response = accept(session, session.takeAction(1, 'lessons'))
        expect(response.state.players[0]!.occupationHand).toContain(OLD_K274_OrganicFarmer.meta.id)
        expect(response.state.players[0]!.resources.food).toBe(2)
        expect(response.state.players[1]!.resources.food).toBe(40)
        expect(response.state.log.filter(entry => entry.key === 'log.playOccupation')).toHaveLength(1)
        expect(response.scores).toHaveLength(4)
      }
    )
    it(
      'K272 cannot replace both clay in a two-room renovation with one wood',
      () => {
        const session = make(
          [OLD_K272_FrameBuilder.meta.id],
          state => {
            state.round = 6
            state.roundActionOrder[0] = 'house-redevelopment'
            Object.assign(state.players[0]!.resources, { wood: 1, clay: 0, reed: 1 })
          }
        )
        const before = session.getState()
        const response = session.takeAction(0, 'house-redevelopment')
        expect(response.ok).toBe(false)
        expect(response.state.players[0]!.houseType).toBe('wood')
        expect(response.state.players[0]!.resources).toEqual(before.state.players[0]!.resources)
        expect(response.state.log).toEqual(before.state.log)
      }
    )
    it.each([0, 1, 2])(
      'K273 stores wood only when its owner can pay both wood (%i available)',
      wood => {
        const basin = OLD_K273_BasinMaker.meta.id
        const tanner = OLD_K280_Tanner.meta.id
        const session = make(
          [basin, tanner],
          state => {
            state.players[0]!.improvements = ['Major_Fireplace1']
            Object.assign(state.players[0]!.resources, { wood, boar: 1, food: 0 })
            state.players[0]!.houseAnimals = { '0-0': 'boar' }
          }
        )
        let response = session.takeAnytimeAction(0, 'exchange')
        const boar = options(response).find(option => option.effectPreview?.kind === 'resourceExchange' && (option.effectPreview.resourcesPaid?.boar ?? 0) > 0)!
        response = accept(session, session.resolveChoice(0, boar.value))
        expect(response.state.players[0]!.resources).toMatchObject({ wood: wood === 2 ? 0 : wood, boar: 0, food: 2 })
        expect(response.state.players[0]!.cardStates[basin]?.counters?.wood ?? 0).toBe(wood === 2 ? 2 : 0)
        expect(response.state.players[0]!.cardStates[tanner]?.counters?.boar).toBe(1)
        expect(score(response, basin)).toBe(wood === 2 ? 1 : 0)
        expect(score(response, tanner)).toBe(0)
      }
    )
    it.each([0, 1, 2])(
      'K274 counts an occupied four-capacity pasture only with three free spaces (%i animals)',
      count => {
        const card = OLD_K274_OrganicFarmer.meta.id
        const session = make(
          [card],
          state => {
            const owner = state.players[0]!
            owner.resources.sheep = count
            owner.pastures = [{ id: 'organic', tiles: [{ row: 0, col: 1 }], animalType: 'sheep', animalCount: count }]
            owner.stableTiles = [{ row: 0, col: 1 }]
          }
        )
        expect(score(session.getState(), card)).toBe(count === 1 ? 1 : 0)
      }
    )
    it(
      'K274 counts animal-holding cards with spare capacity and excludes an empty holding card',
      () => {
        const organic = OLD_K274_OrganicFarmer.meta.id
        const forest = OLD_K145_ForestPasture.meta.id
        const yard = OLD_E58_AnimalYard.meta.id
        const session = make(
          [organic],
          state => {
            const owner = state.players[0]!
            owner.minorPlayed = [forest, yard, OLD_E59_DrinkingTrough.meta.id]
            owner.resources.boar = 2
            owner.cardStates[forest] = { extraData: { animalCounts: { boar: 1 } } }
            owner.cardStates[yard] = { extraData: { animalCounts: { boar: 1 } } }
          }
        )
        expect(score(session.getState(), organic)).toBe(2)
        session.state.players[0]!.cardStates[yard] = { extraData: { animalCounts: {} } }
        session.state.players[0]!.resources.boar = 1
        session.loadState(session.state)
        expect(score(session.getState(), organic)).toBe(1)
      }
    )
    it(
      'K272 cannot replace four clay in one room with two wood',
      () => {
        const session = make(
          [OLD_K272_FrameBuilder.meta.id],
          state => {
            state.players[0]!.houseType = 'clay'
            Object.assign(state.players[0]!.resources, { wood: 2, clay: 1, reed: 2 })
            state.players[0]!.stableTiles = [{ row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }, { row: 1, col: 4 }]
          }
        )
        const before = session.getState()
        const response = session.takeAction(0, 'farm-expansion')
        expect(response.ok).toBe(false)
        expect(response.state.players[0]!.rooms).toBe(2)
        expect(response.state.players[0]!.resources).toEqual(before.state.players[0]!.resources)
        expect(response.state.log).toEqual(before.state.log)
      }
    )
    it(
      'K266 may decline its bonus and sow its existing grain without a gain or trade',
      () => {
        const session = make(
          [OLD_K266_Serf.meta.id],
          state => {
            state.roundActionOrder[0] = 'grain-utilization'
            state.players[0]!.resources.grain = 1
            state.players[0]!.fields = [{ row: 0, col: 0, stacks: [] }]
          }
        )
        let response = session.takeAction(0, 'grain-utilization')
        const skip = options(response).find(option => option.value === '__skip__')
        expect(skip).toBeDefined()
        response = accept(session, session.resolveChoice(0, skip!.value))
        expect(response.state.players[0]!.resources).toMatchObject({ grain: 1, vegetable: 0 })
        response = accept(session, session.commitSelectionChoice(0, { crops: [{ row: 0, col: 0, crop: 'grain' }] }))
        expect(response.state.players[0]!.resources).toMatchObject({ grain: 0, vegetable: 0 })
        expect(response.state.players[0]!.fields[0]!.stacks).toEqual([{ kind: 'grain', remaining: 3 }])
        expect(response.state.log).toContainEqual(expect.objectContaining({ key: 'log.sow' }))
        expect(response.scores).toHaveLength(4)
      }
    )
    it.each([[5, 1, 0], [4, 2, 1]])(
      'K270 with %i family members builds %i rooms and can pay for only %i newborns',
      (family, rooms, births) => {
        const session = make(
          [OLD_K270_WetNurse.meta.id],
          state => {
            setActiveWorkerCount(state.players[0]!, family)
            state.players[0]!.rooms = family
            state.players[0]!.roomTiles.push(...Array.from({ length: family - 2 }, (_, index) => ({ row: 0, col: index + 1 })))
            Object.assign(state.players[0]!.resources, { wood: rooms * 5, reed: rooms * 2, food: 3 })
          }
        )
        const response = build(session, rooms)
        expect(response.state.players[0]!.rooms).toBe(family + rooms)
        expect(familySize(response.state.players[0]!)).toBe(5)
        expect(newbornCount(response.state.players[0]!)).toBe(births)
        expect(response.state.players[0]!.resources).toMatchObject({ wood: 0, reed: 0, food: 3 - births })
        expect(response.state.log.filter(entry => entry.key === 'log.familyGrowth')).toHaveLength(births)
        expect(response.interaction).toMatchObject({ stateId: 'wait', request: { kind: 'confirm-next-player' } })
        expect(response.scores).toHaveLength(4)
      }
    )
    it(
      'K280 may decline keeping a cooked boar without undoing the food exchange',
      () => {
        const card = OLD_K280_Tanner.meta.id
        const session = make(
          [card],
          state => {
            const owner = state.players[0]!
            owner.improvements = ['Major_Fireplace1']
            Object.assign(owner.resources, { boar: 1, food: 0 })
            owner.houseAnimals = { '0-0': 'boar' }
          }
        )
        let response = session.takeAnytimeAction(0, 'exchange')
        const boar = options(response).find(option => option.effectPreview?.kind === 'resourceExchange' && (option.effectPreview.resourcesPaid?.boar ?? 0) > 0)!
        response = session.resolveChoice(0, boar.value)
        expect(options(response)).toContainEqual(expect.objectContaining({ value: '__skip__' }))
        response = session.resolveChoice(0, '__skip__')
        expect(response.ok, response.error).toBe(true)
        expect(response.state.players[0]!.resources).toMatchObject({ boar: 0, food: 2 })
        expect(response.state.players[0]!.cardStates[card]?.counters?.boar ?? 0).toBe(0)
        expect(response.state.events.filter(event => event.type === 'resource.exchanged')).toHaveLength(1)
        expect(score(response, card)).toBe(0)
      }
    )
  }
)
