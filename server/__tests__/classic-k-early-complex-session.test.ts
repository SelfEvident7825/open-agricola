import { afterEach, describe, expect, it } from 'vitest'
import type { GameState } from '../../shared/contract/types'
import { GameSession, type SessionResponse } from '../game/authoritative-session'
import { createWorkSession } from './_helpers/session-fixtures'
import { getActiveCardRegistry } from '../../shared/cards/active-registry'
import { familySize, markAllWorkersUsed } from '../../shared/domain/player'
import { rehydrateState, serializeSessionSnapshot } from '../../shared/session/serialization'
import { OLD_K269_Acrobat } from '../../shared/cards/classic/K/OLD_K269_Acrobat'
import { OLD_K275_PerpetualStudent } from '../../shared/cards/classic/K/OLD_K275_PerpetualStudent'
import { OLD_K281_TravelingSalesman } from '../../shared/cards/classic/K/OLD_K281_TravelingSalesman'
import { OLD_K284_WoodDistributor } from '../../shared/cards/classic/K/OLD_K284_WoodDistributor'
import { OLD_K286_Smallholder } from '../../shared/cards/classic/K/OLD_K286_Smallholder'
import { OLD_K107_Lumber } from '../../shared/cards/classic/K/OLD_K107_Lumber'
import { OLD_K129_CornSheaf } from '../../shared/cards/classic/K/OLD_K129_CornSheaf'
import { OLD_K291_Lover } from '../../shared/cards/classic/K/OLD_K291_Lover'
import { assertRejectedUnchanged } from './_helpers/session-assertions'
import { OLD_E18_BeanField } from '../../shared/cards/classic/E/OLD_E18_BeanField'
import { deriveVirtualTileCol, getLogicalFields } from '../../shared/cards/helpers/card-field'

const cards = [
  OLD_K269_Acrobat,
  OLD_K275_PerpetualStudent,
  OLD_K281_TravelingSalesman,
  OLD_K284_WoodDistributor,
  OLD_K286_Smallholder,
  OLD_K107_Lumber,
  OLD_K129_CornSheaf,
  OLD_K291_Lover,
  OLD_E18_BeanField,
]
const sessions: GameSession[] = []
afterEach(() => sessions.splice(0).forEach(session => session.dispose()))
const bind = (session: GameSession) => session.withCtx(() =>
  cards.forEach(card => getActiveCardRegistry()!.loadImpl(card.meta.id, card.impl)),
)

function setup(id: string, configure?: (state: GameState) => void) {
  const session = createWorkSession({
    seed: 7284,
    options: { playerCount: 4, gameEdition: 'classic' },
    configure(state) {
      state.players.forEach(player => { player.resources.food = 20 })
      state.players[0]!.occupationPlayed = [id]
      configure?.(state)
    },
  })
  sessions.push(session)
  bind(session)
  return session
}

function options(response: SessionResponse) {
  expect(response.ok, response.error).toBe(true)
  if (response.interaction.stateId !== 'wait' || response.interaction.request.kind !== 'choice') {
    throw new Error('Expected choice: ' + JSON.stringify(response.interaction))
  }
  return response.interaction.request.options
}

function accept(session: GameSession, start: SessionResponse, preferred?: string) {
  let response = start
  for (let i = 0; i < 20 && response.interaction.stateId === 'wait'; i++) {
    const interaction = response.interaction
    if (interaction.request.kind !== 'choice') break
    const choices = options(response).filter(option => !option.disabled)
    const selected = choices.find(option => option.value === preferred || option.value === 'minor:' + preferred || option.value === 'major:' + preferred)
      ?? choices.find(option => option.sourceCard === preferred && !['__skip__', '__done__'].includes(option.value))
      ?? choices.find(option => !['__skip__', '__done__', '__pass__'].includes(option.value))
    if (!selected) break
    response = session.resolveChoice(interaction.playerIndex, selected.value)
    expect(response.ok, response.error).toBe(true)
  }
  return response
}

function finishWorkers(session: GameSession) {
  session.state.players.forEach(player => markAllWorkersUsed(session.state, player))
  session.loadState(session.state)
  bind(session)
  return session.performRoundEnd()
}

describe('classic K complex occupations at the four-player boundary', () => {
  it('K275 plays a random occupation, retains the lesson fee and locks the random observation across recovery', () => {
    let session = setup(OLD_K275_PerpetualStudent.meta.id, state => {
      state.players[0]!.resources.food = 0
      state.players[0]!.occupationHand = ['OLD_K267_AdoptiveParents', 'OLD_K271_Educator']
    })
    let response = accept(session, session.takeAction(0, 'lessons'), OLD_K275_PerpetualStudent.meta.id)
    const played = response.state.players[0]!.occupationPlayed.filter(id => id !== OLD_K275_PerpetualStudent.meta.id)
    expect(played).toHaveLength(1)
    expect(['OLD_K267_AdoptiveParents', 'OLD_K271_Educator']).toContain(played[0])
    expect(response.state.players[0]!.occupationHand).toHaveLength(1)
    expect(response.state.players[0]!.resources.food).toBe(2)
    expect(response.state.rngTick).toBe(1)
    expect(response.state.players[0]!.occupationPlayed).toContain(played[0])
    expect(response.state.log).toContainEqual(expect.objectContaining({ key: 'log.playOccupation' }))
    expect(response.scores).toHaveLength(4)
    const restored = new GameSession(rehydrateState(JSON.parse(JSON.stringify(serializeSessionSnapshot(session.state, session)))))
    sessions.push(restored)
    session = restored
    bind(session)
    response = session.getState()
    expect(response.state.players[0]!.resources.food).toBe(2)
    expect(response.state.rngTick).toBe(1)
    expect(session.undoAction().ok).toBe(false)
  })

  it('K281 replaces a minor action with an actually paid major improvement', () => {
    const session = setup(OLD_K281_TravelingSalesman.meta.id, state => { state.players[0]!.resources.clay = 2 })
    const response = accept(session, session.takeAction(0, 'meeting-place'), 'Major_Fireplace1')
    expect(response.state.players[0]!.improvements).toContain('Major_Fireplace1')
    expect(response.state.players[0]!.resources.clay).toBe(0)
    expect(response.state.log).toContainEqual(expect.objectContaining({ key: 'log.playImprovement' }))
    expect(response.scores).toHaveLength(4)
  })

  it('K281 replaces a major-or-minor action with two separately paid minor cards', () => {
    const session = setup(OLD_K281_TravelingSalesman.meta.id, state => {
      state.roundActionOrder[0] = 'major-improvement'
      state.players[0]!.resources.stone = 1
      state.players[0]!.minorHand = [OLD_K107_Lumber.meta.id, OLD_K129_CornSheaf.meta.id]
    })
    const response = accept(session, session.takeAction(0, 'major-improvement'), OLD_K281_TravelingSalesman.meta.id)
    expect(response.state.players[0]!.resources).toMatchObject({ stone: 0, wood: 3, grain: 1 })
    expect(response.state.players[0]!.minorHand).toEqual([])
    expect(response.state.events.filter(event => event.type === 'card.passed')).toHaveLength(2)
    expect(response.scores).toHaveLength(4)
  })

  it('K281 does not supply an unaffordable major improvement', () => {
    const session = setup(OLD_K281_TravelingSalesman.meta.id)
    const response = accept(session, session.takeAction(0, 'meeting-place'))
    expect(response.state.players[0]!.improvements).toEqual([])
    expect(response.state.players[0]!.resources).toMatchObject({ clay: 0, stone: 0, wood: 0, reed: 0 })
    expect(response.state.events.filter(event => event.type === 'card.played')).toHaveLength(0)
    expect(response.scores).toHaveLength(4)
  })

  it('K275 must play its randomly drawn Lover and pays the separate four-food cost with food then begging', () => {
    const session = setup(OLD_K275_PerpetualStudent.meta.id, state => {
      state.players[0]!.resources.food = 0
      state.players[0]!.occupationHand = [OLD_K291_Lover.meta.id]
    })
    let response = session.takeAction(0, 'lessons')
    const replacement = options(response).find(option => option.sourceCard === OLD_K275_PerpetualStudent.meta.id && option.value !== '__skip__')!
    response = session.resolveChoice(0, replacement.value)
    expect(response.ok, response.error).toBe(true)
    expect(response.state.players[0]!.occupationPlayed).toContain(OLD_K291_Lover.meta.id)
    expect(response.state.players[0]!.resources).toMatchObject({ food: 2, begging: 0 })
    expect(response.interaction).toMatchObject({ stateId: 'wait', playerIndex: 0, request: { kind: 'choice', requiresExplicitChoice: true } })
    const restored = new GameSession(rehydrateState(JSON.parse(JSON.stringify(serializeSessionSnapshot(session.state, session)))))
    sessions.push(restored)
    bind(restored)
    assertRejectedUnchanged(restored, () => restored.resolveChoice(0, '__skip__'))
    assertRejectedUnchanged(restored, () => restored.resolveChoice(1, 'confirm'))
    response = accept(restored, restored.resolveChoice(0, 'confirm'))
    expect(response.state.players[0]!.resources).toMatchObject({ food: 0, begging: 2 })
    expect(familySize(response.state.players[0]!)).toBe(3)
    expect(response.state.players.slice(1).map(player => player.resources.begging)).toEqual([0, 0, 0])
    expect(response.state.rngTick).toBe(1)
    expect(response.state.log).toContainEqual(expect.objectContaining({ key: 'log.playOccupation', params: expect.objectContaining({ occupations: OLD_K291_Lover.meta.id }) }))
    expect(response.scores).toHaveLength(4)
    expect(restored.undoAction().ok).toBe(false)
  })

  it('K284 redistributes only wood as evenly as possible and preserves other accumulated goods', () => {
    const session = setup(OLD_K284_WoodDistributor.meta.id, state => {
      const forest = state.actionSpaces.find(space => space.id === 'forest')!
      forest.resources.wood = 7
      forest.resources.food = 5
    })
    let response = accept(session, finishWorkers(session))
    expect(response.state.round).toBe(2)
    const forest = response.state.actionSpaces.find(space => space.id === 'forest')!
    expect(forest.resources).toMatchObject({ wood: 0, food: 5 })
    expect(['clay-pit', 'reed-bank', 'fishing'].map(id => response.state.actionSpaces.find(space => space.id === id)!.resources.wood)).toEqual([4, 3, 3])
    expect(response.state.players[0]!.resources.wood).toBe(0)
    expect(response.state.events.flatMap(event =>
      event.type === 'resource.moved' && event.from.kind === 'actionSpace' && event.from.spaceId === 'forest'
        ? [event.resources.wood] : [],
    )).toEqual([4, 3, 3])
    expect(response.scores).toHaveLength(4)
    response = session.getState()
    expect(response.interaction.stateId).toBe('idle')
  })

  it('K284 restores the pending distribution without repeating it and rejects uneven allocations', () => {
    const session = setup(OLD_K284_WoodDistributor.meta.id, state => {
      state.actionSpaces.find(space => space.id === 'forest')!.resources.wood = 7
    })
    let response = finishWorkers(session)
    response = session.resolveChoice(0, options(response).find(option => option.value !== '__skip__')!.value)
    expect(options(response).map(option => option.value)).toContain('4,3,3')
    const restored = new GameSession(rehydrateState(JSON.parse(JSON.stringify(serializeSessionSnapshot(session.state, session)))))
    sessions.push(restored)
    bind(restored)
    assertRejectedUnchanged(restored, () => restored.resolveChoice(0, '8,1,1'))
    assertRejectedUnchanged(restored, () => restored.resolveChoice(1, '4,3,3'))
    response = restored.resolveChoice(0, '4,3,3')
    expect(response.ok, response.error).toBe(true)
    expect(response.state.actionSpaces.find(space => space.id === 'forest')!.resources.wood).toBe(0)
    expect(['clay-pit', 'reed-bank', 'fishing'].map(id => response.state.actionSpaces.find(space => space.id === id)!.resources.wood)).toEqual([4, 3, 3])
    expect(response.state.events.filter(event => event.type === 'resource.moved' && event.from.kind === 'actionSpace' && event.from.spaceId === 'forest')).toHaveLength(3)
    expect(response.scores).toHaveLength(4)
  })

  it('K284 may decline distribution without moving the accumulated wood', () => {
    const session = setup(OLD_K284_WoodDistributor.meta.id)
    const response = finishWorkers(session)
    expect(options(response).map(option => option.value)).toContain('__skip__')
    const skipped = session.resolveChoice(0, '__skip__')
    expect(skipped.ok, skipped.error).toBe(true)
    expect(skipped.state.actionSpaces.find(space => space.id === 'forest')!.resources.wood).toBe(6)
    expect(['clay-pit', 'reed-bank', 'fishing'].map(id => skipped.state.actionSpaces.find(space => space.id === id)!.resources.wood ?? 0)).toEqual([0, 0, 0])
    expect(skipped.scores).toHaveLength(4)
  })

  it('K269 moves the actual circus worker only at work-end and receives the target action', () => {
    const session = setup(OLD_K269_Acrobat.meta.id)
    let response = session.takeAction(0, 'traveling-players')
    expect(response.ok, response.error).toBe(true)
    const circus = response.state.actionSpaces.find(space => space.id === 'traveling-players')!
    const workerId = circus.takenBy.find(worker => worker.playerId === response.state.players[0]!.id)!.workerId
    expect(response.state.players[0]!.resources.grain).toBe(0)
    response = accept(session, finishWorkers(session), 'grain-seeds')
    expect(response.state.players[0]!.resources.grain).toBe(1)
    expect(response.state.events).toContainEqual(expect.objectContaining({ type: 'worker.placed', workerId, spaceId: 'grain-seeds', viaCardId: OLD_K269_Acrobat.meta.id }))
    expect(response.state.round).toBe(2)
    expect(response.scores).toHaveLength(4)
  })

  it('K269 cannot use a destination occupied by another player without an enabling ability', () => {
    const session = setup(OLD_K269_Acrobat.meta.id)
    expect(session.takeAction(0, 'traveling-players').ok).toBe(true)
    expect(session.resolveChoice(0, 'confirm').ok).toBe(true)
    expect(session.takeAction(1, 'grain-seeds').ok).toBe(true)
    let response = accept(session, finishWorkers(session))
    expect(response.interaction).toMatchObject({ stateId: 'wait', playerIndex: 0, request: { farm: { farmType: 'plow' } } })
    expect(response.state.players.map(player => player.resources.grain)).toEqual([0, 1, 0, 0])
    response = session.commitSelectionChoice(0, { tile: { row: 0, col: 1 } })
    expect(response.ok, response.error).toBe(true)
    expect(response.state.players[0]!.fields).toHaveLength(1)
    expect(response.state.events.flatMap(event => event.type === 'worker.placed' && event.viaCardId === OLD_K269_Acrobat.meta.id ? [event.spaceId] : [])).toEqual(['farmland'])
    expect(response.scores).toHaveLength(4)
  })

  it.each([2, 3])('K286 grants extra freshly sown grain only with at most two fields (fields=%i)', count => {
    const session = setup(OLD_K286_Smallholder.meta.id, state => {
      state.roundActionOrder[0] = 'grain-utilization'
      state.players[0]!.resources.grain = 1
      state.players[0]!.fields = Array.from({ length: count }, (_, col) => ({ row: 0, col: col + 1, stacks: [] }))
    })
    let response = accept(session, session.takeAction(0, 'grain-utilization'))
    expect(response.interaction).toMatchObject({ stateId: 'wait', request: { farm: { farmType: 'sow' } } })
    response = session.commitSelectionChoice(0, { crops: [{ row: 0, col: 1, crop: 'grain' }] })
    if (count === 2) {
      response = accept(session, response)
      expect(response.interaction).toMatchObject({ stateId: 'wait', request: { kind: 'selection' } })
      response = session.commitSelectionChoice(0, { positions: [{ row: 0, col: 1 }] })
      expect(response.ok, response.error).toBe(true)
    }
    expect(response.state.players[0]!.fields[0]!.stacks).toEqual([{ kind: 'grain', remaining: count === 2 ? 4 : 3 }])
    expect(response.state.players[0]!.resources.grain).toBe(0)
    expect(response.state.log).toContainEqual(expect.objectContaining({ key: 'log.sow' }))
    expect(response.scores).toHaveLength(4)
  })

  it.each([0, 2])('K286 includes card fields in its limit and adds vegetables to the freshly sown card (farmyard=%i)', count => {
    const cardId = OLD_E18_BeanField.meta.id
    const tile = { row: -1, col: deriveVirtualTileCol(cardId, 0) }
    const session = setup(OLD_K286_Smallholder.meta.id, state => {
      state.roundActionOrder[0] = 'grain-utilization'
      state.players[0]!.resources.vegetable = 1
      state.players[0]!.minorPlayed = [cardId]
      state.players[0]!.fields = Array.from({ length: count }, (_, col) => ({ row: 0, col: col + 1, stacks: [] }))
    })
    let response = accept(session, session.takeAction(0, 'grain-utilization'))
    expect(response.interaction).toMatchObject({ stateId: 'wait', request: { farm: { farmType: 'sow' } } })
    response = session.commitSelectionChoice(0, { crops: [{ ...tile, crop: 'vegetable' }] })
    if (count === 0) {
      response = accept(session, response)
      expect(response.interaction).toMatchObject({ stateId: 'wait', request: { kind: 'selection' } })
      response = session.commitSelectionChoice(0, { positions: [tile] })
    }
    expect(response.ok, response.error).toBe(true)
    expect(getLogicalFields(response.state.players[0]!).find(field => field.sourceCard === cardId)!.stacks)
      .toEqual([{ kind: 'vegetable', remaining: count === 0 ? 3 : 2 }])
    expect(response.state.players[0]!.resources.vegetable).toBe(0)
    expect(response.state.log).toContainEqual(expect.objectContaining({ key: 'log.sow' }))
    expect(response.scores).toHaveLength(4)
  })
})
