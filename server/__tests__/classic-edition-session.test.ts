import { snapshotToRoom, toRoomMeta } from '../game/room'
import { afterEach, describe, expect, it } from 'vitest'
import { createInitialState, normalizeState } from '../../shared/session/state-bootstrap'
import { getCardDefinition, classicMinors, classicOccupations } from '../../shared/cards/catalog'
import { createWorkSession } from './_helpers/session-fixtures'
import { GameSession } from '../game/authoritative-session'
import { parseGameSetupRequest, buildInitialStateOptions } from '../game/game-setup-options'
import { deriveVirtualTileCol } from '../../shared/cards/helpers/card-field'
import { draftSeatProgress } from '../../shared/projections/draft-progress'

const CARD = 'OLD_E30_Canoe'
const options = { playerCount: 4, gameEdition: 'classic' as const, ordinaryCardDeckSeed: 42 }
const sessions: GameSession[] = []
afterEach(() => { for (const s of sessions.splice(0)) s.dispose() })
const canoe = (played = true) => {
  const s = createWorkSession({ options, configure: state => {
    state.players[0]!.resources.food = 0
    state.players[0]!.resources.reed = 0
    state.players[0]!.minorHand = [CARD]
    state.players[0]!.minorPlayed = played ? [CARD] : []
    state.actionSpaces.find(s => s.id === 'fishing')!.resources.food = 2
  } })
  sessions.push(s); return s
}

describe('classic edition recovery', () => {
  it('deals unique implemented classic hands to four players and isolates the remaining supply', () => {
    const state = createInitialState(42, options)
    const ids = state.players.flatMap(p => [...p.minorHand, ...p.occupationHand])
    expect(ids).toHaveLength(56)
    expect(new Set(ids).size).toBe(56)
    for (const id of [...ids, ...state.ordinaryCardDecks!.minor, ...state.ordinaryCardDecks!.occupation]) {
      expect(getCardDefinition(id)?.gameEdition).toBe('classic')
      expect(getCardDefinition(id)?.implemented).toBe(true)
    }
    expect(state.gameEdition).toBe('classic')
  })
  it('keeps the revised default card pool separate', () => {
    const state = createInitialState(42, { playerCount: 4 })
    expect(state.gameEdition).toBeUndefined()
    expect(state.players.flatMap(p => [...p.minorHand, ...p.occupationHand]).some(id => id.startsWith('OLD_'))).toBe(false)
  })
  it('deals 10-card draft pools with no reference-only or revised cards', () => {
    const state = createInitialState(42, {...options, draftMode: 'simultaneous', draftPoolSize: 10})
    expect(state.phase).toBe('draft')
    const pools = state.players.map(player => {
      const progress = draftSeatProgress(state.draft!, player.id)
      if (progress.kind !== 'selecting') throw new Error('Expected a draft choice')
      return progress.pool
    })
    expect(pools).toHaveLength(4)
    for (const p of pools) { expect(p.occ).toHaveLength(10); expect(p.minor).toHaveLength(10) }
    expect(new Set(pools.flatMap(p => [...p.occ,...p.minor])).size).toBe(80)
  })
  it('preserves classic edition and the exact hand on state recovery', () => {
    const state = createInitialState(82, options)
    const recovered = normalizeState(JSON.parse(JSON.stringify(state)))
    expect(recovered.gameEdition).toBe('classic')
    expect(recovered.players.map(p => p.minorHand)).toEqual(state.players.map(p => p.minorHand))
    expect(recovered.ordinaryCardDecks).toEqual(state.ordinaryCardDecks)
  })
  it.each([2,3,5,6])('rejects unsupported player count %i', playerCount => {
    expect(() => createInitialState(1, {...options, playerCount})).toThrow(/four players/)
  })
  it.each(['enableCommunityDeck','enableParentCards','enableThroughTheSeasons','enableFarmersOfTheMoor'])('rejects incompatible %s', flag => {
    expect(() => createInitialState(1, {...options, [flag]:true})).toThrow(/cannot be combined/)
  })
  it('maps both creation paths to the same classic options and rejects unknown editions', () => {
    expect(buildInitialStateOptions(parseGameSetupRequest({maxPlayers:4,gameEdition:'classic'},null)).gameEdition).toBe('classic')
    expect(() => parseGameSetupRequest({maxPlayers:4,gameEdition:'invalid'},null)).toThrow(/Unknown/)
  })
  it('rejects classic team games without changing the revised team setup', () => {
    const teamConfig = { mode: 'team', seatsPerTeam: 2, seating: 'separated', scoring: 'sum', teammateVisibility: 'shared' }
    expect(() => parseGameSetupRequest({ maxPlayers: 4, gameEdition: 'classic', teamConfig }, null)).toThrow(/team or multihand/)
    expect(parseGameSetupRequest({ maxPlayers: 4, teamConfig }, null).teamConfig).toEqual(teamConfig)
  })
  it('imports every hand card with truthful playability and original metadata', () => {
    expect(classicMinors.length+classicOccupations.length).toBe(1024)
    expect(getCardDefinition(CARD)?.occupationPrerequisites).toEqual({min:2})
    expect(getCardDefinition(CARD)?.cost).toEqual({wood:2})
    expect(getCardDefinition(CARD)?.vp).toBe(1)
    expect(getCardDefinition('OLD_NL057_JoyHouse')?.implemented).not.toBe(true)
  })
  it('reserves nonoverlapping virtual coordinates for old field cards', () => {
    expect(deriveVirtualTileCol('OLD_E18_BeanField',0)).not.toBe(deriveVirtualTileCol('B068_Beanfield',0))
    expect(deriveVirtualTileCol('OLD_E18_BeanField',5)).not.toBe(deriveVirtualTileCol('OLD_E19_Test',0))
  })
  it('Canoe adds exactly one reed and one food to Fishing and is undoable', () => {
    const s = canoe()
    const r = s.takeAction(0,'fishing')
    expect(r.ok, r.error).toBe(true)
    expect(r.state.players[0]!.resources.food).toBe(3)
    expect(r.state.players[0]!.resources.reed).toBe(1)
    expect(JSON.stringify(r.state.log)).toContain(CARD)
    const undo = s.undoAction()
    expect(undo.ok,undo.error).toBe(true)
    expect(undo.state.players[0]!.resources.food).toBe(0)
    expect(undo.state.players[0]!.resources.reed).toBe(0)
    expect(s.takeAction(0,'fishing').state.players[0]!.resources.reed).toBe(1)
  })
  it('Canoe in hand gives no bonus', () => {
    const r = canoe(false).takeAction(0,'fishing')
    expect(r.ok,r.error).toBe(true)
    expect(r.state.players[0]!.resources.food).toBe(2)
    expect(r.state.players[0]!.resources.reed).toBe(0)
  })
  it('Canoe does not trigger on an unrelated action', () => {
    const r = canoe().takeAction(0,'forest')
    expect(r.ok,r.error).toBe(true)
    expect(r.state.players[0]!.resources.food).toBe(0)
    expect(r.state.players[0]!.resources.reed).toBe(0)
  })
  it('recovers a waiting room without a session snapshot as classic', () => {
    const room = snapshotToRoom({ id: 'classic-waiting', serialized: null, updatedAt: Date.now(), meta: {
      createdBy: null, maxPlayers: 4, customCardDbIds: [], status: 'waiting', players: [], gameEdition: 'classic',
    } })
    sessions.push(room.session)
    expect(room.session.state.gameEdition).toBe('classic')
    expect(toRoomMeta(room).gameEdition).toBe('classic')
    expect(room.session.state.players.flatMap(p => p.minorHand).every(id => id.startsWith('OLD_'))).toBe(true)
  })

  it.each([{wood: 2, occupations: 2, allowed: true}, {wood: 1, occupations: 2, allowed: false}, {wood: 2, occupations: 1, allowed: false}])('pays the old Canoe cost and requires two occupations: %j', setup => {
    const s = createWorkSession({ options, configure: state => {
      state.players[0]!.resources.wood = setup.wood
      state.players[0]!.resources.food = 10
      // Keep multiple legal choices: a lone option can be auto-resolved by the engine.
      state.players[0]!.minorHand = [CARD, 'OLD_E11_Field', 'OLD_E52_Stable']
      state.players[0]!.occupationPlayed = ['OLD_E150_Baker', 'OLD_E168_Greengrocer'].slice(0, setup.occupations)
    } }); sessions.push(s)
    let r = s.takeAction(0, 'meeting-place')
    expect(r.ok,r.error).toBe(true)
    if (r.interaction.stateId === 'wait' && r.interaction.request.kind === 'choice') {
      const choice = r.interaction.request.options.find(o => o.value.startsWith('action-improvement-'))
      if (choice) r = s.resolveChoice(0, choice.value)
    }
    expect(r.interaction.stateId).toBe('wait')
    if (r.interaction.stateId !== 'wait' || r.interaction.request.kind !== 'choice') throw new Error('Expected improvement choice: ' + JSON.stringify(r.interaction))
    expect(r.interaction.request.options.some(o => o.value === CARD && !o.disabled)).toBe(setup.allowed)
    const result = s.resolveChoice(0, CARD)
    expect(result.ok).toBe(setup.allowed)
    expect(result.state.players[0]!.resources.wood).toBe(setup.allowed ? 0 : setup.wood)
    expect(result.state.players[0]!.minorPlayed.includes(CARD)).toBe(setup.allowed)
  })

})
