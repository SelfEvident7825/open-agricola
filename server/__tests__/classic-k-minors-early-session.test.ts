import { afterEach, describe, expect, it } from 'vitest'
import { getActiveCardRegistry } from '../../shared/cards/active-registry'
import { deriveVirtualTileCol, getLogicalFields } from '../../shared/cards/helpers/card-field'
import { getCardStack, readCardResourceStats } from '../../shared/cards/helpers/card-state'
import { markAllWorkersUsed } from '../../shared/domain/player'
import type { GameState, Resource } from '../../shared/contract/types'
import { GameSession, type SessionResponse } from '../game/authoritative-session'
import { rehydrateState, serializeSessionSnapshot } from '../../shared/session/serialization'
import { createWorkSession } from './_helpers/session-fixtures'
import { playMinor, playOccupation, sessionOptions } from './_helpers/card-regression-session'
import { completePlowUse } from './_helpers/plow-use'
import { OLD_K105_Acreage } from '../../shared/cards/classic/K/OLD_K105_Acreage'
import { OLD_K106_Bakehouse } from '../../shared/cards/classic/K/OLD_K106_Bakehouse'
import { OLD_K107_Lumber } from '../../shared/cards/classic/K/OLD_K107_Lumber'
import { OLD_K108_Beehive } from '../../shared/cards/classic/K/OLD_K108_Beehive'
import { OLD_K109_SpitRoast } from '../../shared/cards/classic/K/OLD_K109_SpitRoast'
import { OLD_K110_Brewery } from '../../shared/cards/classic/K/OLD_K110_Brewery'
import { OLD_K111_BreadPaddle } from '../../shared/cards/classic/K/OLD_K111_BreadPaddle'
import { OLD_K112_Bookshelf } from '../../shared/cards/classic/K/OLD_K112_Bookshelf'
import { OLD_K113_Flail } from '../../shared/cards/classic/K/OLD_K113_Flail'
import { OLD_K114_DuckPond } from '../../shared/cards/classic/K/OLD_K114_DuckPond'
import { OLD_K115_SwingPlough } from '../../shared/cards/classic/K/OLD_K115_SwingPlough'
import { OLD_K116_Granary } from '../../shared/cards/classic/K/OLD_K116_Granary'
import { OLD_K117_Greenhouse } from '../../shared/cards/classic/K/OLD_K117_Greenhouse'
import { OLD_K118_LiquidManure } from '../../shared/cards/classic/K/OLD_K118_LiquidManure'
import { OLD_K119_CrookedPlough } from '../../shared/cards/classic/K/OLD_K119_CrookedPlough'
import { OLD_K120_HouseGoat } from '../../shared/cards/classic/K/OLD_K120_HouseGoat'
import { OLD_K121_Sawhorse } from '../../shared/cards/classic/K/OLD_K121_Sawhorse'
import { OLD_K122_Sawmill } from '../../shared/cards/classic/K/OLD_K122_Sawmill'
import { OLD_K123_WoodenStrongbox } from '../../shared/cards/classic/K/OLD_K123_WoodenStrongbox'
import { OLD_K124_Yoke } from '../../shared/cards/classic/K/OLD_K124_Yoke'
import { OLD_K125_Broom } from '../../shared/cards/classic/K/OLD_K125_Broom'
import { OLD_K126_LandingNet } from '../../shared/cards/classic/K/OLD_K126_LandingNet'

const cards = [OLD_K105_Acreage, OLD_K106_Bakehouse, OLD_K107_Lumber, OLD_K108_Beehive, OLD_K109_SpitRoast, OLD_K110_Brewery, OLD_K111_BreadPaddle, OLD_K112_Bookshelf, OLD_K113_Flail, OLD_K114_DuckPond, OLD_K115_SwingPlough, OLD_K116_Granary, OLD_K117_Greenhouse, OLD_K118_LiquidManure, OLD_K119_CrookedPlough, OLD_K120_HouseGoat, OLD_K121_Sawhorse, OLD_K122_Sawmill, OLD_K123_WoodenStrongbox, OLD_K124_Yoke, OLD_K125_Broom, OLD_K126_LandingNet]
const card = (n: number) => cards.find(card => card.number === n)!
const id = (n: number) => card(n).id
const sessions: GameSession[] = []
afterEach(() => sessions.splice(0).forEach(session => session.dispose()))
function bind(session: GameSession) {
  session.withCtx(() => cards.forEach(card => getActiveCardRegistry()!.loadImpl(card.id, card.impl!)))
  return session
}
function setup(numbers: number[], configure?: (state: GameState) => void, played = false) {
  const session = createWorkSession({
    seed: 42,
    options: { playerCount: 4, gameEdition: 'classic', ordinaryCardDeckSeed: 42 },
    customCards: cards.map(card => ({ cardType: 'minor', cardJson: card.meta })),
    configure(state) {
      for (const player of state.players) {
        player.minorHand = ['__test_placeholder__']; player.occupationHand = ['__test_placeholder__']
        player.minorPlayed = []; player.occupationPlayed = []; player.improvements = []; player.cardStates = {}
        for (const resource of Object.keys(player.resources)) player.resources[resource as keyof Resource] = 0
      }
      const owner = state.players[0]!
      owner.minorHand = played ? ['__test_placeholder__'] : numbers.map(id)
      owner.minorPlayed = played ? numbers.map(id) : []
      owner.occupationPlayed = ['__occupation1__', '__occupation2__', '__occupation3__']
      configure?.(state)
    },
  })
  sessions.push(session)
  return bind(session)
}
function ok(response: SessionResponse) {
  expect(response.ok, response.error).toBe(true)
  return response
}
function choose(session: GameSession, response: SessionResponse, value: string) {
  expect(sessionOptions(response).filter(option => !option.disabled).map(option => option.value)).toContain(value)
  if (response.interaction.stateId !== 'wait') throw new Error('Expected a pending choice')
  return ok(session.resolveChoice(response.interaction.playerIndex, value))
}
function finishPurchase(session: GameSession, response: SessionResponse) {
  for (let step = 0; step < 5 && response.interaction.stateId === 'wait'; step++) {
    const options = sessionOptions(response)
    if (options.length !== 1 || options[0]!.labelKey !== 'actions.pay.name') break
    response = choose(session, response, options[0]!.value)
  }
  return ok(response)
}
function assertCardEvent(response: SessionResponse, n: number) {
  expect(response.state.events.some(event => event.sourceCardId === id(n) || ('cardId' in event && event.cardId === id(n)))).toBe(true)
  expect(response.state.log.length).toBeGreaterThan(0)
  expect(response.scores).toHaveLength(4)
}
function nextRound(session: GameSession) {
  session.state.players.forEach(player => { player.resources.food = 40; markAllWorkersUsed(session.state, player) })
  session.loadState(session.state)
  bind(session)
  return ok(session.performRoundEnd())
}
function bonus(response: SessionResponse, n: number) {
  return response.scores![0]!.categories.flatMap(category => category.entries)
    .filter(entry => entry.type === 'bonus' && entry.cardId === id(n)).reduce((sum, entry) => sum + entry.score, 0)
}

describe('classic K105–K126 four-player card actions', () => {
  it('K107 Lumber pays stone, grants three wood and passes to the next seat; undo restores payment and hands', () => {
    const session = setup([107], state => { state.players[0]!.resources.stone = 1 })
    const response = finishPurchase(session, playMinor(session, id(107)))
    expect(response.state.players[0]!.resources).toMatchObject({ stone: 0, wood: 3 })
    expect(response.state.players[1]!.minorHand).toContain(id(107))
    expect(response.state.players[0]!.minorPlayed).not.toContain(id(107))
    expect(response.interaction).toMatchObject({ stateId: 'wait', request: { kind: 'confirm-next-player' } })
    assertCardEvent(response, 107)
    const undone = ok(session.undoAction())
    expect(undone.state.players[0]!.resources).toMatchObject({ stone: 1, wood: 0 })
    expect(undone.state.players[0]!.minorHand).toContain(id(107))
    expect(undone.state.players[1]!.minorHand).not.toContain(id(107))
  })
  it('K107 cannot be played without its stone or occupation', () => {
    for (const lacks of ['stone', 'occupation']) {
      const session = setup([107], state => {
        state.players[0]!.resources.stone = lacks === 'stone' ? 0 : 1
        if (lacks === 'occupation') state.players[0]!.occupationPlayed = []
      })
      const response = playMinor(session, id(107))
      expect(response.state.players[0]!.minorHand).toContain(id(107))
      expect(response.state.players[0]!.resources.wood).toBe(0)
    }
  })
  it.each([{ n: 108, round: 5, rounds: [6, 8, 10, 12, 14] }, { n: 114, round: 11, rounds: [12, 13, 14] },
  { n: 116, round: 8, rounds: [10, 12] }])('K$n queues precisely the remaining reward rounds', ({ n, round, rounds }) => {
    const session = setup([n], state => {
      state.round = round
      const p = state.players[0]!
      p.resources.wood = 3
      if (n === 108) p.improvements = ['Major_Fireplace1', 'Major_Well']
    })
    let response = playMinor(session, id(n))
    const payment = sessionOptions(response).find(option => !option.disabled && option.value.startsWith('pay-'))
    if (payment) response = choose(session, response, payment.value)
    response = finishPurchase(session, response)
    expect(response.state.players[0]!.minorPlayed).toContain(id(n))
    expect(response.state.futureMeeples.filter(entry => entry.cardId === id(n)).map(entry => entry.round)).toEqual(rounds)
    expect(response.state.futureMeeples.filter(entry => entry.cardId === id(n)).map(entry => entry.resources)).toEqual(rounds.map(() => n === 116 ? { grain: 1 } : { food: 1 }))
    assertCardEvent(response, n)
  })
  it('K108 collects one food at the next even round after save and restore', () => {
    let session = setup([108], state => {
      state.round = 5
      state.players[0]!.improvements = ['Major_Fireplace1', 'Major_Well']
    })
    expect(playMinor(session, id(108)).state.players[0]!.minorPlayed).toContain(id(108))
    session = bind(new GameSession(rehydrateState(JSON.parse(JSON.stringify(serializeSessionSnapshot(session.state, session))))))
    sessions.push(session)
    const response = nextRound(session)
    expect(response.state.round).toBe(6)
    expect(response.state.players[0]!.resources.food).toBe(41)
    expect(response.state.futureMeeples.filter(entry => entry.cardId === id(108)).map(entry => entry.round)).toEqual([8, 10, 12, 14])
  })
  it('K116 rejects mixing two wood and one clay for its alternative full prices', () => {
    const session = setup([116], state => Object.assign(state.players[0]!.resources, { wood: 2, clay: 1 }))
    const response = playMinor(session, id(116))
    expect(response.state.players[0]!.minorHand).toContain(id(116))
    expect(response.state.futureMeeples).toHaveLength(0)
  })
  it.each([115, 119])('K%i spends one entire plow use even when declining the second extra field', n => {
    const session = setup([n], state => { state.players[0]!.resources.wood = 3 })
    expect(playMinor(session, id(n)).state.players[0]!.minorPlayed).toContain(id(n))
    const before = getCardStack(session.state.players[0]!, id(n)).length
    session.state.activePlayerIndex = 0
    session.loadState(session.state); bind(session)
    const response = completePlowUse(session, session.takeAction(0, 'farmland'), id(n), 1)
    expect(response.state.players[0]!.fields).toHaveLength(2)
    expect(getCardStack(response.state.players[0]!, id(n))).toHaveLength(before - 2)
    assertCardEvent(response, n)
    expect(getCardStack(ok(session.undoAction()).state.players[0]!, id(n))).toHaveLength(before)
  })
  it.each([115, 119])('K%i does not boost Cultivation', n => {
    const session = setup([n], state => {
      state.round = 14; state.roundActionOrder[0] = 'cultivation'
      state.players[0]!.cardStates[id(n)] = { counters: {}, stack: ['field', 'field'] }
    }, true)
    const response = completePlowUse(session, session.takeAction(0, 'cultivation'), id(n), 0)
    expect(response.state.players[0]!.fields).toHaveLength(1)
    expect(getCardStack(response.state.players[0]!, id(n))).toHaveLength(2)
  })
  it.each([{ space: 'reed-bank', food: 2 }, { space: 'resource-market-4', food: 2 }])('K126 adds only the printed food on $space', ({ space, food }) => {
    const session = setup([126], state => {
      const target = state.actionSpaces.find(action => action.id === space)!
      if (space === 'reed-bank') target.resources.reed = 2
    }, true)
    const response = ok(session.takeAction(0, space))
    expect(response.state.players[0]!.resources.food).toBe(food)
    expect(response.state.players[0]!.resources.reed).toBeGreaterThan(0)
    assertCardEvent(response, 126)
    expect(ok(session.undoAction()).state.players[0]!.resources.food).toBe(0)
  })
  it('K126 grants no food from wood or while still in hand', () => {
    const played = setup([126], undefined, true)
    expect(ok(played.takeAction(0, 'forest')).state.players[0]!.resources.food).toBe(0)
    const unplayed = setup([126])
    expect(ok(unplayed.takeAction(0, 'reed-bank')).state.players[0]!.resources.food).toBe(0)
  })
  it.each([{ rooms: 4, score: 0 }, { rooms: 5, score: 2 }, { rooms: 6, score: 4 }, { rooms: 7, score: 4 }])('K123 awards $score for $rooms rooms', ({ rooms, score }) => {
    const session = setup([123], state => {
      const p = state.players[0]!
      p.roomTiles = Array.from({ length: rooms }, (_, i) => ({ row: Math.floor(i / 5), col: i % 5 }))
      p.rooms = rooms
    }, true)
    expect(bonus(session.getState(), 123)).toBe(score)
    expect(session.getState().scores).toHaveLength(4)
  })
})

function chooseAction(session: GameSession, initial: SessionResponse, labelKey: string) {
  let response = ok(initial)
  for (let step = 0; step < 4 && response.interaction.stateId === 'wait'; step++) {
    const option = sessionOptions(response).find(option => option.labelKey === labelKey && !option.disabled)
    if (!option) break
    response = choose(session, response, option.value)
  }
  return response
}
function advanceToFeed(session: GameSession, initial: SessionResponse) {
  let response = ok(initial)
  for (let step = 0; step < 24 && response.interaction.stateId === 'wait'; step++) {
    const i = response.interaction
    if (i.request.kind === 'feed') return response
    if (i.request.kind === 'confirm-next-player') response = ok(session.resolveChoice(i.playerIndex, 'confirm'))
    else if (i.request.kind === 'confirm-player-switch') response = ok(session.resolveChoice(i.request.fromPlayerIndex, 'confirm'))
    else if (session.peekEnginePendingEnvelope()?.syntheticKind === 'post-reap-anytime') response = choose(session, response, '__skip__')
    else return response
  }
  return response
}

describe('classic K105–K126 choices, fields and feeding', () => {
  it('K105 sows two separate grain fields and rejects vegetables', () => {
    const session = setup([105], state => {
      state.roundActionOrder[0] = 'grain-utilization'
      Object.assign(state.players[0]!.resources, { grain: 2, vegetable: 1 })
    }, true)
    const response = chooseAction(session, session.takeAction(0, 'grain-utilization'), 'actions.sow.name')
    expect(response.interaction).toMatchObject({ stateId: 'wait', request: { kind: 'farm-select', farm: { farmType: 'sow' } } })
    const tiles = [0, 1].map(slot => ({ row: -1, col: deriveVirtualTileCol(id(105), slot) }))
    expect(session.commitSelectionChoice(0, { crops: [{ ...tiles[0], crop: 'vegetable' }] }).ok).toBe(false)
    const sown = ok(session.commitSelectionChoice(0, { crops: tiles.map(tile => ({ ...tile, crop: 'grain' })) }))
    expect(getLogicalFields(sown.state.players[0]!).map(field => field.stacks)).toEqual([
      [{ kind: 'grain', remaining: 3 }], [{ kind: 'grain', remaining: 3 }],
    ])
    expect(sown.state.players[0]!.resources).toMatchObject({ grain: 0, vegetable: 1 })
    expect(sown.state.events.some(event => event.type === 'farm.sown')).toBe(true)
    expect(sown.scores).toHaveLength(4)
  })
  it('K118 adds exactly one good to each newly sown card-field column and can decline', () => {
    const session = setup([105, 118], state => {
      state.roundActionOrder[0] = 'grain-utilization'; state.players[0]!.resources.grain = 2
    }, true)
    chooseAction(session, session.takeAction(0, 'grain-utilization'), 'actions.sow.name')
    const tiles = [0, 1].map(slot => ({ row: -1, col: deriveVirtualTileCol(id(105), slot) }))
    let response = ok(session.commitSelectionChoice(0, { crops: tiles.map(tile => ({ ...tile, crop: 'grain' })) }))
    response = chooseAction(session, response, 'actions.selection.name')
    expect(response.interaction).toMatchObject({ stateId: 'wait', request: { kind: 'selection' } })
    response = ok(session.commitSelectionChoice(0, { positions: tiles.map(tile => `${tile.row}-${tile.col}`) }))
    expect(getLogicalFields(response.state.players[0]!).flatMap(field => field.stacks.map(stack => stack.remaining))).toEqual([4, 4])
    expect(response.state.players[0]!.resources.grain).toBe(0)
    assertCardEvent(response, 118)
  })
  it('K118 prerequisite excludes animals on cards and unassigned reserves', () => {
    const session = setup([118], state => {
      state.players[0]!.resources.sheep = 4
      state.players[0]!.cardStates['animal-card'] = { extraData: { animalCounts: { sheep: 4 } } }
    })
    expect(playMinor(session, id(118)).state.players[0]!.minorHand).toContain(id(118))
  })
  it('K112 Bookshelf finances the lesson before charging, but cannot create an empty lesson', () => {
    const session = setup([112], state => { state.players[0]!.occupationHand = ['OLD_E147_LandAgent'] }, true)
    const response = ok(playOccupation(session, 'OLD_E147_LandAgent'))
    expect(response.state.players[0]!.occupationPlayed).toContain('OLD_E147_LandAgent')
    expect(response.state.players[0]!.resources.food).toBe(2)
    expect(response.state.log).toContainEqual(expect.objectContaining({ key: 'log.playOccupation' }))
    expect(ok(session.undoAction()).state.players[0]!.resources.food).toBe(0)
    const empty = setup([112], undefined, true)
    expect(empty.takeAction(0, 'lessons').ok).toBe(false)
    expect(empty.state.players[0]!.resources.food).toBe(0)
  })
  it.each([111, 113])('K%i offers actual baking after a lesson or on Farmland', n => {
    const session = setup([n], state => {
      const p = state.players[0]!
      p.occupationHand = ['OLD_E147_LandAgent']; p.improvements = ['Major_ClayOven']
      Object.assign(p.resources, { food: 1, grain: 1 })
    }, true)
    let response = n === 111 ? playOccupation(session, 'OLD_E147_LandAgent') : session.takeAction(0, 'farmland')
    response = chooseAction(session, response, 'actions.bake-bread.name')
    if (sessionOptions(response).some(option => option.value === 'Major_ClayOven')) response = choose(session, response, 'Major_ClayOven')
    expect(response.state.players[0]!.resources).toMatchObject({ grain: 0, food: n === 111 ? 5 : 6 })
    if (n === 113) {
      expect(response.interaction, JSON.stringify({ interaction: response.interaction, fields: response.state.players[0]!.fields })).toMatchObject({ stateId: 'wait', request: { kind: 'farm-select', farm: { farmType: 'plow' } } })
      response = ok(session.commitSelectionChoice(0, { tile: { row: 0, col: 1 } }))
      expect(response.state.players[0]!.fields).toHaveLength(1)
    }
    expect(response.scores).toHaveLength(4)
  })
  it('K106 returns an oven, costs three stone, and bakes at most two grain for ten food', () => {
    const session = setup([106], state => {
      state.players[0]!.improvements = ['Major_ClayOven']
      Object.assign(state.players[0]!.resources, { stone: 3, grain: 3 })
    })
    let response = playMinor(session, id(106))
    const pay = sessionOptions(response).find(option => !option.disabled && option.value.startsWith('pay-'))
    if (pay) response = choose(session, response, pay.value)
    response = chooseAction(session, response, 'actions.bake-bread.name')
    expect(response.state.players[0]!.minorPlayed).toContain(id(106))
    expect(response.state.players[0]!.improvements).not.toContain('Major_ClayOven')
    expect(response.state.players[0]!.resources.stone).toBe(0)
    expect(session.resolveChoice(0, `bulk:${id(106)}=3`).ok).toBe(false)
    response = ok(session.resolveChoice(0, `bulk:${id(106)}=2`))
    expect(response.state.players[0]!.resources).toMatchObject({ grain: 1, food: 10 })
    assertCardEvent(response, 106)
  })
  it('K106 cannot be bought without a returnable oven', () => {
    const session = setup([106], state => { state.players[0]!.resources.stone = 3 })
    expect(playMinor(session, id(106)).state.players[0]!.minorHand).toContain(id(106))
  })
  it('K109 adds one food for two animals cooked in feeding, never for cooking in work', () => {
    const session = setup([109], state => {
      state.round = 4
      state.players.forEach(player => { player.resources.food = 40; markAllWorkersUsed(state, player) })
      const p = state.players[0]!
      Object.assign(p.resources, { food: 0, sheep: 2 })
      p.improvements = ['Major_Fireplace1']
      p.pastures = [{ id: 'sheep', tiles: [{ row: 0, col: 1 }], animalType: 'sheep', animalCount: 2 }]
    }, true)
    const offered = advanceToFeed(session, session.performRoundEnd())
    expect(offered.interaction).toMatchObject({ stateId: 'wait', playerIndex: 0, request: { kind: 'feed' } })
    if (offered.interaction.stateId !== 'wait' || offered.interaction.request.kind !== 'feed') throw new Error('Expected feeding')
    const recipe = offered.interaction.request.exchangeCatalog!.find(entry => entry.from.sheep === 1)!
    const response = ok(session.resolveChoice(0, 'confirm', { selections: [{ sourceId: recipe.sourceId, exchangeIndex: recipe.exchangeIndex, count: 2 }] }))
    expect(response.state.players[0]!.resources).toMatchObject({ sheep: 0, food: 1, begging: 0 })
    expect(response.state.players[0]!.cardStates[id(109)]?.extraData?.feedingPhase).toBe(0)
    assertCardEvent(response, 109)
  })
  it('K110 includes sown grain in its bonus and limits its harvest conversion to one use', () => {
    const session = setup([110], state => {
      state.round = 4
      state.players.forEach(player => { player.resources.food = 40; markAllWorkersUsed(state, player) })
      Object.assign(state.players[0]!.resources, { food: 1, grain: 6 })
      state.players[0]!.fields = [{ row: 0, col: 1, stacks: [{ kind: 'grain', remaining: 3 }] }]
    }, true)
    expect(bonus(session.getState(), 110)).toBe(1)
    let response = advanceToFeed(session, session.performRoundEnd())
    response = chooseAction(session, response, 'actions.exchange.name')
    response = advanceToFeed(session, response)
    expect(response.state.round).toBe(5)
    expect(response.state.players[0]!.resources).toMatchObject({ food: 0, grain: 6, begging: 0 })
    expect(bonus(response, 110)).toBe(0)
    assertCardEvent(response, 110)
  })
  it('K120 feeds once and prevents house animal zones even with Animal Tamer', () => {
    const session = setup([120], state => {
      state.round = 4
      state.players.forEach(player => { player.resources.food = 40; markAllWorkersUsed(state, player) })
      state.players[0]!.resources.food = 3
    }, true)
    const response = advanceToFeed(session, session.performRoundEnd())
    expect(response.state.round).toBe(5)
    expect(response.state.players[0]!.resources).toMatchObject({ food: 0, begging: 0 })
    const animals = setup([120], state => { state.roundActionOrder[0] = 'sheep-market'; state.players[0]!.occupationPlayed = ['OLD_K306_AnimalTamer'] }, true)
    const herd = ok(animals.takeAction(0, 'sheep-market'))
    expect(herd.interaction).toMatchObject({ stateId: 'wait', request: { kind: 'animal-reorg' } })
    if (herd.interaction.stateId !== 'wait' || herd.interaction.request.kind !== 'animal-reorg') throw new Error('Expected animals')
    expect(herd.interaction.request.zones.some(zone => zone.zoneType === 'house')).toBe(false)
    const refused = animals.resolveChoice(0, 'confirm', { zones: [{ id: 'house', zoneType: 'house', animalType: 'sheep', animalCount: 1 }] })
    expect(refused.ok).toBe(false)
  })
  it('K122 returns Joinery and scores remaining wood without double counting a rebuilt Joinery', () => {
    const session = setup([122], state => {
      state.players[0]!.improvements = ['Major_Joinery']; state.players[0]!.resources.wood = 5
    })
    const response = finishPurchase(session, playMinor(session, id(122)))
    expect(response.state.players[0]!.minorPlayed).toContain(id(122))
    expect(response.state.players[0]!.improvements).not.toContain('Major_Joinery')
    expect(bonus(response, 122)).toBe(3)
    session.state.players[0]!.improvements.push('Major_Joinery')
    session.loadState(session.state); bind(session)
    const scores = session.getState().scores![0]!.categories.flatMap(category => category.entries)
    expect(scores.filter(entry => entry.type === 'bonus' && [id(122), 'Major_Joinery'].includes(entry.cardId ?? '')).reduce((sum, entry) => sum + entry.score, 0)).toBe(3)
    assertCardEvent(response, 122)
  })
  it('K124 counts plows and Harrow belonging to all players, and requires a housed cattle', () => {
    const session = setup([124], state => {
      const p = state.players[0]!
      p.resources.wood = 1; p.resources.cattle = 1
      p.houseAnimals = { '1-0': 'cattle' }
      state.players[1]!.minorPlayed = [id(115)]
      state.players[2]!.minorPlayed = ['OLD_I68_Harrow']
      state.players[3]!.minorPlayed = ['OLD_I70_Punner']
    })
    const response = completePlowUse(session, playMinor(session, id(124)), id(124), 2)
    expect(response.state.players[0]!.fields).toHaveLength(2)
    expect(response.state.players[0]!.resources.wood).toBe(0)
    assertCardEvent(response, 124)
    const unassigned = setup([124], state => Object.assign(state.players[0]!.resources, { wood: 1, cattle: 1 }))
    expect(playMinor(unassigned, id(124)).state.players[0]!.minorHand).toContain(id(124))
  })
  it('K125 replaces the old hand with seven deck cards, offers a paid minor, and blocks undo after seeing new cards', () => {
    const drawn = [id(123), id(107), id(114), id(110), id(117), id(118), id(119)]
    const session = setup([125, 106], state => {
      state.players[0]!.resources.wood = 2
      state.ordinaryCardDecks.minor = [...drawn, id(124)]
    })
    let response = playMinor(session, id(125))
    response = chooseAction(session, response, 'actions.improvement.name')
    expect(response.state.players[0]!.minorHand).toEqual(drawn)
    expect(response.state.ordinaryCardDecks.minor).toEqual([id(124)])
    expect(sessionOptions(response).map(option => option.value)).toContain(id(123))
    expect(sessionOptions(response).filter(option => !option.disabled).map(option => option.value)).not.toContain(id(107))
    response = choose(session, response, id(123))
    expect(response.state.players[0]!.minorPlayed).toEqual([id(125), id(123)])
    expect(response.state.players[0]!.resources.wood).toBe(0)
    expect(response.state.players[0]!.minorHand).toEqual(drawn.slice(1))
    let undone = session.undoAction()
    for (let step = 0; step < 5 && undone.ok; step++) {
      expect(undone.state.players[0]!.minorPlayed).toContain(id(125))
      expect(undone.state.players[0]!.minorHand).not.toContain(id(106))
      expect(undone.state.ordinaryCardDecks.minor).toEqual([id(124)])
      undone = session.undoAction()
    }
    expect(undone.ok).toBe(false)
    assertCardEvent(response, 125)
  })
  it('K125 with an empty deck discards the old hand and allows undo because nothing hidden was drawn', () => {
    const session = setup([125, 106], state => { state.players[0]!.resources.wood = 1; state.ordinaryCardDecks.minor = [] })
    const response = playMinor(session, id(125))
    expect(response.state.players[0]!.minorHand).toEqual([])
    expect(ok(session.undoAction()).state.players[0]!.minorHand).toEqual([id(125), id(106)])
  })
})

describe('classic K117 and K121 delayed and exact payment', () => {
  it('K117 schedules paid vegetables four and seven rounds later, with a real choice and payment', () => {
    const session = setup([117], state => { state.players[0]!.resources.wood = 2 })
    const bought = playMinor(session, id(117))
    expect(bought.state.players[0]!.resources.wood).toBe(0)
    expect(bought.state.players[0]!.cardStates[id(117)]?.extraData?.scheduledOffers).toMatchObject([
      { dueRound: 5, resources: { vegetable: 1 }, cost: { food: 1 } },
      { dueRound: 8, resources: { vegetable: 1 }, cost: { food: 1 } },
    ])
    session.state.round = 7
    let response = advanceToFeed(session, nextRound(session))
    response = chooseAction(session, response, 'actions.activate-card-effect.name')
    const purchase = sessionOptions(response).find(option => option.value.startsWith('purchase:'))
    expect(purchase, JSON.stringify(response.interaction)).toBeDefined()
    response = choose(session, response, purchase!.value)
    expect(response.state.players[0]!.resources).toMatchObject({ vegetable: 1, food: 35 })
    expect(response.state.players[0]!.cardStates[id(117)]?.extraData?.scheduledOffers).toMatchObject([
      { dueRound: 5, consumed: false }, { dueRound: 8, consumed: true },
    ])
    assertCardEvent(response, 117)
  })
  it('K117 allows declining its due vegetable without spending food', () => {
    const session = setup([117], state => {
      state.round = 2
      state.players[0]!.cardStates[id(117)] = { extraData: { scheduledOffers: [{ id: 'offer', kind: 'resource-purchase', dueRound: 3, resources: { vegetable: 1 }, cost: { food: 1 }, consumed: false }] } }
    }, true)
    const response = choose(session, nextRound(session), '__skip__')
    expect(response.state.players[0]!.resources).toMatchObject({ vegetable: 0, food: 40 })
    expect(response.state.round).toBe(3)
  })
  it('K121 builds its next stable free and pays the second stable normally; undo restores its privilege', () => {
    const session = setup([121], state => { state.players[0]!.resources.wood = 2 }, true)
    const offered = chooseAction(session, session.takeAction(0, 'farm-expansion'), 'actions.stables.name')
    expect(offered.interaction).toMatchObject({ stateId: 'wait', request: { kind: 'farm-select', farm: { farmType: 'stable' } } })
    const response = ok(session.commitSelectionChoice(0, { stables: [{ row: 0, col: 1 }, { row: 0, col: 2 }] }))
    expect(response.state.players[0]!.resources.wood).toBe(0)
    expect(response.state.players[0]!.stableTiles).toHaveLength(2)
    expect(response.state.players[0]!.cardStates[id(121)]?.extraData?.stableBuilt).toBe(true)
    expect(readCardResourceStats(response.state.players[0]!, id(121))?.saved).toEqual({ wood: 2 })
    assertCardEvent(response, 121)
    const undone = ok(session.undoAction())
    expect(undone.state.players[0]!.resources.wood).toBe(2)
    expect(undone.state.players[0]!.cardStates[id(121)]?.extraData?.stableBuilt).toBeUndefined()
    expect(readCardResourceStats(undone.state.players[0]!, id(121))?.saved.wood ?? 0).toBe(0)
  })
  it('K121 can build the free stable penniless and does not consume it for an invalid placement', () => {
    const session = setup([121], undefined, true)
    const offered = chooseAction(session, session.takeAction(0, 'farm-expansion'), 'actions.stables.name')
    expect(offered.interaction).toMatchObject({ stateId: 'wait', request: { kind: 'farm-select' } })
    expect(session.commitSelectionChoice(0, { stables: [{ row: 1, col: 0 }] }).ok).toBe(false)
    expect(session.state.players[0]!.cardStates[id(121)]?.extraData?.stableBuilt).toBeUndefined()
    const response = ok(session.commitSelectionChoice(0, { stables: [{ row: 0, col: 1 }] }))
    expect(response.state.players[0]!.resources.wood).toBe(0)
    expect(response.state.players[0]!.stableTiles).toHaveLength(1)
    expect(response.state.players[0]!.cardStates[id(121)]?.extraData?.stableBuilt).toBe(true)
  })
  it('K121 discounts the third and sixth fences once when enclosing two squares, but never earlier fences', () => {
    const session = setup([121], state => {
      state.roundActionOrder[0] = 'fencing'; state.players[0]!.resources.wood = 4
    }, true)
    const offered = ok(session.takeAction(0, 'fencing'))
    expect(offered.interaction).toMatchObject({ stateId: 'wait', request: { kind: 'farm-select', farm: { farmType: 'fence' } } })
    const response = ok(session.commitSelectionChoice(0, { edges: ['H-0-1', 'H-0-2', 'H-1-1', 'H-1-2', 'V-0-1', 'V-0-3'] }))
    expect(response.state.players[0]!.resources.wood).toBe(0)
    expect(response.state.players[0]!.fenceSegments).toHaveLength(6)
    expect(response.state.players[0]!.pastures).toHaveLength(1)
    expect(readCardResourceStats(response.state.players[0]!, id(121))?.saved).toEqual({ wood: 2 })
    expect(response.state.events.some(event => event.type === 'farm.fenceBuilt')).toBe(true)
    expect(response.state.log.length).toBeGreaterThan(0)
    expect(response.scores).toHaveLength(4)
    const undone = ok(session.undoAction())
    expect(undone.state.players[0]!.resources.wood).toBe(4)
    expect(readCardResourceStats(undone.state.players[0]!, id(121))?.saved.wood ?? 0).toBe(0)
  })
})

describe('classic K early minors boundary interactions', () => {
  it('K118 fertilizes Copse wood and farm vegetables without growing an older grain stack', () => {
    const copse = 'OLD_I78_Copse'
    const session = setup([118], state => {
      const p = state.players[0]!
      p.minorPlayed.push(copse)
      p.fields = [{ row: 0, col: 1, stacks: [{ kind: 'grain', remaining: 2 }] }, { row: 0, col: 2, stacks: [] }]
      Object.assign(p.resources, { wood: 1, vegetable: 1 })
      state.roundActionOrder[0] = 'grain-utilization'
    }, true)
    chooseAction(session, session.takeAction(0, 'grain-utilization'), 'actions.sow.name')
    const woodTile = { row: -1, col: deriveVirtualTileCol(copse, 0) }
    let response = ok(session.commitSelectionChoice(0, { crops: [{ ...woodTile, crop: 'wood' }, { row: 0, col: 2, crop: 'vegetable' }] }))
    response = chooseAction(session, response, 'actions.selection.name')
    expect(response.interaction).toMatchObject({ stateId: 'wait', sourceCard: id(118), request: { kind: 'selection' } })
    expect(session.commitSelectionChoice(0, { positions: ['0-1'] }).ok).toBe(false)
    response = ok(session.commitSelectionChoice(0, { positions: [`${woodTile.row}-${woodTile.col}`, '0-2'] }))
    expect(response.state.players[0]!.fields.map(field => field.stacks)).toEqual([[{ kind: 'grain', remaining: 2 }], [{ kind: 'vegetable', remaining: 3 }]])
    expect(getLogicalFields(response.state.players[0]!).filter(field => field.sourceCard === copse).flatMap(field => field.stacks)).toEqual([{ kind: 'wood', remaining: 4 }])
  })
  it('K118 can decline extra crops without paying or changing the normal sow', () => {
    const session = setup([118], state => {
      state.roundActionOrder[0] = 'grain-utilization'
      state.players[0]!.resources.grain = 1
      state.players[0]!.fields = [{ row: 0, col: 1, stacks: [] }]
    }, true)
    chooseAction(session, session.takeAction(0, 'grain-utilization'), 'actions.sow.name')
    const sown = ok(session.commitSelectionChoice(0, { crops: [{ row: 0, col: 1, crop: 'grain' }] }))
    const response = choose(session, sown, '__skip__')
    expect(response.state.players[0]!.fields[0]!.stacks).toEqual([{ kind: 'grain', remaining: 3 }])
    expect(response.state.players[0]!.resources.grain).toBe(0)
  })
  it('K121 cannot reuse the stable privilege after it was consumed', () => {
    const session = setup([121], state => { state.players[0]!.cardStates[id(121)] = { extraData: { stableBuilt: true } } }, true)
    expect(session.takeAction(0, 'farm-expansion').ok).toBe(false)
  })
  it('K121 never discounts a seventh fence for thresholds already crossed', () => {
    const session = setup([121], state => {
      state.roundActionOrder[0] = 'fencing'
      const p = state.players[0]!
      p.resources.wood = 1
      p.fenceSegments = ['H-0-1', 'H-0-2', 'H-1-1', 'H-1-2', 'V-0-1', 'V-0-3'].map(edge => ({ edge, type: 'fence' }))
      p.pastures = [{ id: 'wide', tiles: [{ row: 0, col: 1 }, { row: 0, col: 2 }], animalType: null, animalCount: 0 }]
    }, true)
    ok(session.takeAction(0, 'fencing'))
    const response = ok(session.commitSelectionChoice(0, { edges: ['V-0-2'] }))
    expect(response.state.players[0]!.fenceSegments).toHaveLength(7)
    expect(response.state.players[0]!.resources.wood).toBe(0)
  })
  it('K109 does not award feeding food for an animal cooked during work', () => {
    const session = setup([109], state => {
      state.players[0]!.improvements = ['Major_Fireplace1']
      state.players[0]!.resources.sheep = 1
      state.players[0]!.houseAnimals = { '1-0': 'sheep' }
    }, true)
    const entry = session.getState().interaction.anytimeActions.find(action => action.actionId === 'exchange')!
    let response = ok(session.takeAnytimeAction(0, entry.id))
    const recipe = sessionOptions(response).find(option => !option.disabled && option.effectPreview?.kind === 'resourceExchange' && option.effectPreview.resourcesPaid?.sheep === 1)
    expect(recipe, JSON.stringify(response.interaction)).toBeDefined()
    response = choose(session, response, recipe!.value)
    expect(response.state.players[0]!.resources).toMatchObject({ food: 2, sheep: 0 })
    expect(response.state.players[0]!.cardStates[id(109)]?.extraData?.feedingPhase).toBeUndefined()
  })
})

it('K120 immediately removes the house pet when bought', () => {
  const session = setup([120], state => {
    state.players[0]!.resources.sheep = 1
    state.players[0]!.houseAnimals = { '1-0': 'sheep' }
  })
  const response = ok(playMinor(session, id(120)))
  expect(response.state.players[0]!.minorPlayed).toContain(id(120))
  expect(response.interaction).toMatchObject({ stateId: 'wait', request: { kind: 'animal-reorg' } })
  if (response.interaction.stateId !== 'wait' || response.interaction.request.kind !== 'animal-reorg') throw new Error('Expected displaced pet')
  expect(response.interaction.request.zones.some(zone => zone.zoneType === 'house')).toBe(false)
  const housed = ok(session.resolveChoice(0, 'confirm', { zones: response.interaction.request.zones }))
  expect(housed.state.players[0]!.resources.sheep).toBe(0)
  expect(Object.values(housed.state.players[0]!.houseAnimals ?? {})).toHaveLength(0)
})

it('K115 and I68 cannot combine on one Farmland visit', () => {
  const harrow = 'OLD_I68_Harrow'
  const session = setup([115], state => {
    state.players[0]!.minorPlayed.push(harrow)
    state.players[0]!.cardStates[id(115)] = { stack: ['field', 'field', 'field', 'field'] }
  }, true)
  let response = ok(session.takeAction(0, 'farmland'))
  const trigger = sessionOptions(response).find(option => option.sourceCard === id(115) && !option.disabled)
  expect(trigger, JSON.stringify(response.interaction)).toBeDefined()
  response = choose(session, response, trigger!.value)
  response = completePlowUse(session, response, id(115), 2)
  expect(response.state.players[0]!.fields).toHaveLength(3)
  expect(getCardStack(response.state.players[0]!, id(115))).toHaveLength(2)
  expect(response.state.players[0]!.cardStates[harrow]?.extraData?.users).toBeUndefined()
})

it('K122 trades only one wood for three food in a harvest', () => {
  const session = setup([122], state => {
    state.round = 4
    state.players.forEach(player => { player.resources.food = 40; markAllWorkersUsed(state, player) })
    Object.assign(state.players[0]!.resources, { food: 1, wood: 2 })
  }, true)
  let response = ok(session.performRoundEnd())
  response = chooseAction(session, response, 'actions.activate-card-effect.name')
  response = chooseAction(session, response, 'actions.exchange.name')
  response = advanceToFeed(session, response)
  expect(response.state.round).toBe(5)
  expect(response.state.players[0]!.resources).toMatchObject({ food: 0, wood: 1, begging: 0 })
  assertCardEvent(response, 122)
})

it('K117 cannot buy its due vegetable without the food', () => {
  const session = setup([117], state => {
    state.round = 2
    state.players.forEach(player => markAllWorkersUsed(state, player))
    state.players[0]!.cardStates[id(117)] = { extraData: { scheduledOffers: [{ id: 'offer', kind: 'resource-purchase', dueRound: 3, resources: { vegetable: 1 }, cost: { food: 1 }, consumed: false }] } }
  }, true)
  const response = ok(session.performRoundEnd())
  expect(response.state.round).toBe(3)
  expect(response.state.players[0]!.resources).toMatchObject({ food: 0, vegetable: 0 })
  expect(response.interaction.stateId).toBe('idle')
})

it('K125 respects hand-discard protection while drawing only the remaining deck', () => {
  const session = setup([125,106], state => {
    state.players[0]!.resources.wood = 1
    state.players[0]!.minorPlayed = ['OLD_FL019_LanternWonder']
    state.ordinaryCardDecks.minor = [id(110),id(119)]
  })
  const response = ok(playMinor(session, id(125)))
  expect(response.state.players[0]!.minorHand).toEqual([id(106),id(110),id(119)])
  expect(response.state.ordinaryCardDecks.minor).toHaveLength(0)
  expect(response.state.players[0]!.minorPlayed).toEqual(['OLD_FL019_LanternWonder',id(125)])
  expect(session.undoAction().ok).toBe(false)
})

it.each([0, 2])('K112 respects an explicit five-food lesson with %i food before its bonus', food => {
  const source = 'TEST_K112_ExplicitLesson'
  const occupation = 'OLD_E147_LandAgent'
  const session = createWorkSession({ seed: 42,
    options: { playerCount: 4, gameEdition: 'classic', ordinaryCardDeckSeed: 42 },
    customCards: [
      { cardType: 'minor', cardJson: card(112).meta },
      { cardType: 'minor', cardJson: { id: source, name: 'Explicit lesson fixture', deck: 'K', number: 0, cost: {}, desc: [], implemented: true } },
    ],
    configure(state) {
      for (const player of state.players) {
        player.minorHand = ['__test_placeholder__']
        player.occupationHand = ['__test_placeholder__']
        player.minorPlayed = []; player.occupationPlayed = []
      }
      const p = state.players[0]!
      p.minorHand = [source]; p.minorPlayed = [id(112)]
      p.occupationHand = [occupation]; p.resources.food = food
    },
  })
  sessions.push(session); bind(session)
  session.withCtx(() => getActiveCardRegistry()!.loadImpl(source, {
    effect: { id: source, onBuy: () => ({ type: 'leaf', actionId: 'occupation', optional: true, sourceCard: source,
      params: { exactCost: { food: 5 } }, actionContext: { checkedReplaceAction: true },
    }) },
  }))
  let response = ok(playMinor(session, source))
  if (food === 0) {
    expect(response.state.players[0]!.occupationHand).toContain(occupation)
    expect(response.state.players[0]!.resources.food).toBe(0)
    const offered = sessionOptions(response).find(option => option.labelKey === 'actions.lessons.name')
    if (offered) response = session.resolveChoice(0, offered.value)
    expect(response.state.players[0]!.occupationPlayed).not.toContain(occupation)
    expect(response.state.players[0]!.resources.food).toBe(0)
    expect(response.interaction, JSON.stringify(response.interaction)).toMatchObject({ stateId: 'wait', request: { kind: 'confirm-next-player' } })
  } else {
    response = chooseAction(session, response, 'actions.lessons.name')
    if (sessionOptions(response).some(option => option.value === occupation)) response = choose(session, response, occupation)
    expect(response.state.players[0]!.occupationPlayed).toContain(occupation)
    expect(response.state.players[0]!.resources.food).toBe(0)
    expect(response.state.log).toContainEqual(expect.objectContaining({ key: 'log.playOccupation' }))
  }
})
