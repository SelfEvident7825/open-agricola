import { afterEach, describe, expect, it } from 'vitest'
import { computeHarvestFeedingRequirement } from '../../shared/actions/helpers/harvest-feeding-requirement'
import { requireActiveCardRegistry } from '../../shared/cards/active-registry'
import { ensureCardModifiers } from '../../shared/cards/card-modifiers'
import { deriveVirtualTileCol } from '../../shared/cards/helpers/card-field'
import { availableWorkers, familySize, markAllWorkersUsed } from '../../shared/domain/player'
import type { GameState, PlayerState, Resource } from '../../shared/contract/types'
import { rehydrateState, serializeSessionSnapshot } from '../../shared/session/serialization'
import { GameSession, type SessionResponse } from '../game/authoritative-session'
import { createWorkSession } from './_helpers/session-fixtures'
import { playMinor, sessionOptions } from './_helpers/card-regression-session'
import { build } from './_helpers/audit/ae-negative-28-construct'
import { confirmNext } from './_helpers/session-assertions'
import { completePlowUse } from './_helpers/plow-use'
import { OLD_K127_Clapper } from '../../shared/cards/classic/K/OLD_K127_Clapper'
import { OLD_K128_CookingHearth } from '../../shared/cards/classic/K/OLD_K128_CookingHearth'
import { OLD_K129_CornSheaf } from '../../shared/cards/classic/K/OLD_K129_CornSheaf'
import { OLD_K130_HerbGarden } from '../../shared/cards/classic/K/OLD_K130_HerbGarden'
import { OLD_K131_ClayPit } from '../../shared/cards/classic/K/OLD_K131_ClayPit'
import { OLD_K132_ClayHutExtension } from '../../shared/cards/classic/K/OLD_K132_ClayHutExtension'
import { OLD_K133_MilkingStool } from '../../shared/cards/classic/K/OLD_K133_MilkingStool'
import { OLD_K134_OxTeam } from '../../shared/cards/classic/K/OLD_K134_OxTeam'
import { OLD_K135_Horse } from '../../shared/cards/classic/K/OLD_K135_Horse'
import { OLD_K136_BrushwoodRoof } from '../../shared/cards/classic/K/OLD_K136_BrushwoodRoof'
import { OLD_K137_TurnipField } from '../../shared/cards/classic/K/OLD_K137_TurnipField'
import { OLD_K138_ReedHut } from '../../shared/cards/classic/K/OLD_K138_ReedHut'
import { OLD_K139_SleepingCorner } from '../../shared/cards/classic/K/OLD_K139_SleepingCorner'
import { OLD_K140_SwanLake } from '../../shared/cards/classic/K/OLD_K140_SwanLake'
import { OLD_K141_BoarBreeding } from '../../shared/cards/classic/K/OLD_K141_BoarBreeding'
import { OLD_K142_StoneCart } from '../../shared/cards/classic/K/OLD_K142_StoneCart'
import { OLD_K143_StoneExchange } from '../../shared/cards/classic/K/OLD_K143_StoneExchange'
import { OLD_K144_Mansion } from '../../shared/cards/classic/K/OLD_K144_Mansion'
import { OLD_K145_ForestPasture } from '../../shared/cards/classic/K/OLD_K145_ForestPasture'
import { OLD_K146_Loom } from '../../shared/cards/classic/K/OLD_K146_Loom'
import { OLD_K339_Pelts } from '../../shared/cards/classic/K/OLD_K339_Pelts'

/* Each case starts a fresh four-player classic work session with fixed hands.
 * Public commands cover card payment/passing, farm selections, harvest and future
 * queues, cooking, occupied growth spaces and temporary-worker promotion.
 * Cases check resources, pending requests, public events, scores and rejection;
 * Pelts and Reed Hut additionally restore a serialized pending interaction. */
const sources = [
  OLD_K127_Clapper,
  OLD_K128_CookingHearth,
  OLD_K129_CornSheaf,
  OLD_K130_HerbGarden,
  OLD_K131_ClayPit,
  OLD_K132_ClayHutExtension,
  OLD_K133_MilkingStool,
  OLD_K134_OxTeam,
  OLD_K135_Horse,
  OLD_K136_BrushwoodRoof,
  OLD_K137_TurnipField,
  OLD_K138_ReedHut,
  OLD_K139_SleepingCorner,
  OLD_K140_SwanLake,
  OLD_K141_BoarBreeding,
  OLD_K142_StoneCart,
  OLD_K143_StoneExchange,
  OLD_K144_Mansion,
  OLD_K145_ForestPasture,
  OLD_K146_Loom,
  OLD_K339_Pelts,
]

const sessions: GameSession[] = []
afterEach(() => sessions.splice(0).forEach(session => session.dispose()))
const card = (n: number) => sources.find(source => source.number === n)!
const id = (n: number) => card(n).id
function setup(numbers: number[], configure?: (state: GameState) => void, played = false) {
  const session = createWorkSession({
    seed: 127,
    options: { playerCount: 4, gameEdition: 'classic', ordinaryCardDeckSeed: 42 },
    customCards: sources.map(source => ({ cardType: 'minor', cardJson: source.meta })),
    configure(state) {
      for (const player of state.players) {
        player.minorHand = ['__test_placeholder__']
        player.occupationHand = ['__test_placeholder__']
        player.minorPlayed = []
        player.occupationPlayed = []
        player.improvements = []
        for (const resource of Object.keys(player.resources)) player.resources[resource as keyof Resource] = 0
      }
      const p = state.players[0]!
      p.minorHand = played ? ['__test_placeholder__'] : numbers.map(id)
      p.minorPlayed = played ? numbers.map(id) : []
      p.occupationPlayed = ['__occupation1__', '__occupation2__', '__occupation3__', '__occupation4__']
      configure?.(state)
    },
  })
  sessions.push(session)
  session.withCtx(() => {
    const registry = requireActiveCardRegistry('classic K late-minor test')
    for (const source of sources) registry.loadImpl(source.id, source.impl)
    for (const p of session.state.players) for (const cardId of p.minorPlayed) ensureCardModifiers(p, cardId)
  })
  return session
}
const ok = (response: SessionResponse) => {
  expect(response.ok, response.error).toBe(true)
  return response
}
function settle(session: GameSession, response: SessionResponse, accept = true): SessionResponse {
  for (let step = 0; step < 30 && response.interaction.stateId === 'wait'; step++) {
    ok(response)
    const i = response.interaction
    if (i.request.kind === 'confirm-next-player' || i.request.kind === 'farm-select' || i.request.kind === 'selection') break
    if (i.request.kind === 'animal-reorg') response = session.resolveChoice(i.playerIndex, 'confirm', { zones: i.request.zones })
    else if (i.request.kind === 'feed') response = session.resolveChoice(i.playerIndex, 'confirm', { selections: [] })
    else if (i.request.kind === 'confirm-player-switch') response = session.resolveChoice(i.request.fromPlayerIndex, 'confirm')
    else {
      const opts = sessionOptions(response).filter(option => !option.disabled)
      const option = (accept ? opts.find(option => !['__skip__', '__done__', '__pass__', 'cancel'].includes(option.value)) : undefined)
        ?? opts.find(option => ['__skip__', '__done__', '__pass__', 'cancel'].includes(option.value))
      if (!option) break
      response = session.resolveChoice(i.playerIndex, option.value)
    }
  }
  return ok(response)
}
function assertPlayed(response: SessionResponse, n: number) {
  expect(response.state.log).toContainEqual(expect.objectContaining({ playerId: response.state.players[0]!.id }))
  expect(response.scores).toHaveLength(4)
  expect(response.state.events.some(event => event.sourceCardId === id(n) || ('cardId' in event && event.cardId === id(n)))).toBe(true)
}
function pasture(player: PlayerState, animal: 'sheep' | 'boar' | 'cattle', count: number) {
  player.resources[animal] = count
  player.pastures = [
    {
      id: 'animals',
      animalType: animal,
      animalCount: count,
      tiles: [{ row: 1, col: 1 }, { row: 1, col: 2 }]
    }
  ]
}

describe('classic K late minors — four-player authoritative flows', () => {
  it.each([
    { n: 129, resource: 'grain', amount: 1 },
    { n: 141, resource: 'boar', amount: 1 },
    { n: 143, resource: 'stone', amount: 2 }
  ] as const)('K$n pays, grants resources and passes to the next seat', ({ n, resource, amount }) => {
    const session = setup([n], state => Object.assign(state.players[0]!.resources, { food: n === 141 ? 1 : 0, wood: n === 143 ? 2 : 0 }))
    const response = settle(session, playMinor(session, id(n)))
    expect(response.state.players[0]!.resources[resource]).toBe(amount)
    expect(response.state.players[0]!.resources.food).toBe(0)
    expect(response.state.players[0]!.resources.wood).toBe(0)
    expect(response.state.players[1]!.minorHand).toContain(id(n))
    expect(response.state.players[0]!.minorPlayed).not.toContain(id(n))
    expect(response.interaction).toMatchObject({ stateId: 'wait', request: { kind: 'confirm-next-player' } })
    assertPlayed(response, n)
  })
  it('Stone Exchange accepts two clay, and rejects a mixed or absent payment', () => {
    const paid = setup([143], state => {
      state.players[0]!.resources.clay = 2
    })
    expect(settle(paid, playMinor(paid, id(143))).state.players[0]!.resources).toMatchObject({ clay: 0, stone: 2 })
    for (const resources of [{ wood: 1, clay: 1 }, { wood: 0, clay: 0 }]) {
      const session = setup([143], state => Object.assign(state.players[0]!.resources, resources))
      const response = playMinor(session, id(143))
      expect(response.state.players[0]!.minorHand).toContain(id(143))
      expect(response.state.players[0]!.resources.stone).toBe(0)
    }
  })
  it.each(['Major_Fireplace1', 'Major_Fireplace2', 'OLD_E20_SimpleFireplace'])('Cooking Hearth returns %s and enables its cooking recipe', returned => {
    const session = setup([128], state => {
      const player = state.players[0]!
      if (returned.startsWith('Major')) player.improvements = [returned]
      else player.minorPlayed = [returned]
      player.resources.vegetable = 1
    })
    let response = settle(session, playMinor(session, id(128)))
    expect(response.state.players[0]!.improvements).not.toContain(returned)
    expect(response.state.players[0]!.minorPlayed).not.toContain(returned)
    expect(response.state.players[0]!.minorPlayed).toContain(id(128))
    assertPlayed(response, 128)
    confirmNext(session, response)
    for (let actor = 1; actor < 4; actor++) {
      const available = session.getActionAvailability(actor)
      const space = ['day-laborer', 'grain-seeds', 'forest', 'reed-bank', 'fishing'].find(space => available[space])!
      confirmNext(session, settle(session, session.takeAction(actor, space), false))
    }
    ok(session.takeAction(0, 'farmland'))
    response = ok(session.takeAnytimeAction(0, 'exchange'))
    const cook = sessionOptions(response).find(option => option.sourceCard === id(128) && option.effectPreview?.kind === 'resourceExchange' && option.effectPreview.resourcesPaid?.vegetable === 1)!
    expect(cook).toBeDefined()
    response = ok(session.resolveChoice(0, cook.value))
    expect(response.state.players[0]!.resources).toMatchObject({ vegetable: 0, food: 3 })
  })
  it('Cooking Hearth cannot be bought without a returnable fireplace', () => {
    const session = setup([128])
    expect(playMinor(session, id(128)).state.players[0]!.minorHand).toContain(id(128))
  })
  it.each([130, 140])('K%i schedules only the next five available rounds', n => {
    const session = setup([n], state => {
      state.round = 11
      state.players[0]!.fields = [{ row: 0, col: 1, stacks: [{ kind: 'vegetable', remaining: 2 }] }]
    })
    const response = settle(session, playMinor(session, id(n)))
    expect(response.state.futureMeeples.filter(entry => entry.cardId === id(n)).map(entry => ({ round: entry.round, resources: entry.resources })))
      .toEqual([12, 13, 14].map(round => ({ round, resources: { food: 1 } })))
    expect(response.state.players[0]!.resources.food).toBe(0)
    assertPlayed(response, n)
  })
  it('Herb Garden counts a vegetable card field, and rejects a grain field', () => {
    const session = setup([130], state => {
      state.players[0]!.minorPlayed = [id(137)]
      state.players[0]!.cardStates[id(137)] = { extraData: { cardFieldStacks: [{ crop: 'vegetable', remaining: 2 }] } }
    })
    expect(settle(session, playMinor(session, id(130))).state.futureMeeples.filter(entry => entry.cardId === id(130))).toHaveLength(5)
    const invalid = setup([130], state => {
      state.players[0]!.fields = [{ row: 0, col: 1, stacks: [{ kind: 'grain', remaining: 3 }] }]
    })
    expect(playMinor(invalid, id(130)).state.players[0]!.minorHand).toContain(id(130))
  })
  it('Stone Cart queues future even rounds, excluding the current round', () => {
    const session = setup([142], state => {
      state.round = 10
      state.players[0]!.resources.wood = 2
    })
    const response = settle(session, playMinor(session, id(142)))
    expect(response.state.futureMeeples.filter(entry => entry.cardId === id(142)).map(entry => entry.round)).toEqual([12, 14])
    assertPlayed(response, 142)
  })
  it('Clay Hut Extension pays once, builds one clay room for free, and passes', () => {
    const session = setup([132], state => {
      const player = state.players[0]!
      player.houseType = 'clay'
      Object.assign(player.resources, { clay: 4, reed: 1 })
    })
    let response = settle(session, playMinor(session, id(132)))
    expect(response.interaction).toMatchObject({ stateId: 'wait', request: { farm: { farmType: 'room' } } })
    response = settle(session, session.commitSelectionChoice(0, { rooms: [{ row: 0, col: 0 }] }))
    expect(response.state.players[0]!.resources).toMatchObject({ clay: 0, reed: 0 })
    expect(response.state.players[0]!.rooms).toBe(3)
    expect(response.state.players[1]!.minorHand).toContain(id(132))
    assertPlayed(response, 132)
  })
  it.each([false, true])('Clay Hut Extension can pass without building, including when the farm is full (%s)', full => {
    const session = setup([132], state => {
      const player = state.players[0]!
      player.houseType = 'clay'
      Object.assign(player.resources, { clay: 4, reed: 1 })
      if (full) {
        player.fields = Array.from({ length: 15 }, (_, index) => ({
          row: Math.floor(index / 5), col: index % 5, stacks: [],
        })).filter(tile => !player.roomTiles.some(room => room.row === tile.row && room.col === tile.col))
      }
    })
    const response = settle(session, playMinor(session, id(132)), false)
    expect(response.state.players[0]!.rooms).toBe(2)
    expect(response.state.players[0]!.resources).toMatchObject({ clay: 0, reed: 0 })
    expect(response.state.players[1]!.minorHand).toContain(id(132))
    expect(response.interaction).toMatchObject({ stateId: 'wait', request: { kind: 'confirm-next-player' } })
    assertPlayed(response, 132)
  })
  it.each(['wood', 'stone'] as const)('Clay Hut Extension rejects a %s house', houseType => {
    const session = setup([132], state => {
      const p = state.players[0]!
      p.houseType = houseType
      Object.assign(p.resources, { clay: 4, reed: 1 })
    })
    expect(playMinor(session, id(132)).state.players[0]!.minorHand).toContain(id(132))
  })
  it.each([{ round: 1, fields: 3 }, { round: 12, fields: 2 }, { round: 14, fields: 0 }])('Ox Team plows $fields fields when played in round $round', ({ round, fields }) => {
    const session = setup([134], state => {
      state.round = round
      const p = state.players[0]!
      p.resources.wood = 3
      pasture(p, 'cattle', 2)
    })
    const response = completePlowUse(session, playMinor(session, id(134)), id(134), fields)
    expect(response.state.players[0]!.fields).toHaveLength(fields)
    expect(response.state.players[0]!.resources.wood).toBe(0)
    assertPlayed(response, 134)
  })
  it('Brushwood Roof substitutes both reed independently for each of two rooms', () => {
    const session = setup([136], state => {
      state.players[0]!.resources.wood = 14
    }, true)
    const { r } = build(session, 2, { wood: 14 })
    expect(r.state.players[0]!.rooms).toBe(4)
    expect(r.state.players[0]!.resources).toMatchObject({ wood: 0, reed: 0 })
    expect(r.scores).toHaveLength(4)
  })
  it('Brushwood Roof pays one wood instead of the renovation reed and still requires every clay', () => {
    for (const clay of [1, 2]) {
      const session = setup([136], state => {
        state.round = 14
        Object.assign(state.players[0]!.resources, { clay, wood: 1 })
      }, true)
      const response = session.takeAction(0, 'house-redevelopment')
      if (clay === 1) {
        expect(response.ok).toBe(false)
        expect(response.state.players[0]!.houseType).toBe('wood')
        expect(response.state.players[0]!.resources).toMatchObject({ clay: 1, wood: 1 })
      } else {
        const completed = settle(session, response, false)
        expect(completed.state.players[0]!.houseType).toBe('clay')
        expect(completed.state.players[0]!.resources).toMatchObject({ clay: 0, wood: 0, reed: 0 })
        expect(completed.scores).toHaveLength(4)
        expect(completed.state.events).toContainEqual(expect.objectContaining({ type: 'resource.paid' }))
      }
    }
  })
  it('Turnip Field grants immediate sowing including its vegetable-only card field', () => {
    const session = setup([137], state => {
      state.players[0]!.resources.vegetable = 1
    })
    let response = settle(session, playMinor(session, id(137)))
    expect(response.interaction).toMatchObject({ stateId: 'wait', request: { farm: { farmType: 'sow' } } })
    response = ok(session.commitSelectionChoice(0, { crops: [{ row: -1, col: deriveVirtualTileCol(id(137), 0), crop: 'vegetable' }] }))
    expect(response.state.players[0]!.cardStates[id(137)]?.extraData?.cardFieldStacks).toEqual([{ crop: 'vegetable', remaining: 2 }])
    expect(response.state.players[0]!.resources.vegetable).toBe(0)
    assertPlayed(response, 137)
  })
  it('Clay Pit gives three clay only on Day Laborer', () => {
    const session = setup([131], undefined, true)
    const response = settle(session, session.takeAction(0, 'day-laborer'))
    expect(response.state.players[0]!.resources).toMatchObject({ clay: 3, food: 2 })
    assertPlayed(response, 131)
    const other = setup([131], undefined, true)
    expect(settle(other, other.takeAction(0, 'grain-seeds')).state.players[0]!.resources.clay).toBe(0)
  })
  it('Pelts pays and marks distinct rooms after bulk cooking', () => {
    const session = setup([339], state => {
      state.players[0]!.improvements = ['Major_Fireplace1']
      pasture(state.players[0]!, 'sheep', 2)
    }, true)
    let response = ok(session.takeAnytimeAction(0, 'exchange'))
    const cook = sessionOptions(response).find(option => option.sourceCard === 'Major_Fireplace1' && option.effectPreview?.kind === 'resourceExchange' && option.effectPreview.resourcesPaid?.sheep)!
    response = settle(session, session.resolveChoice(0, `bulk:${cook.value.split(':')[1]}=2`))
    expect(response.interaction).toMatchObject({ stateId: 'wait', request: { kind: 'selection', selection: { maxSelections: 2 } } })
    response = ok(session.commitSelectionChoice(0, { positions: ['1-0', '2-0'] }))
    expect(response.state.players[0]!.resources).toMatchObject({ sheep: 0, food: 2 })
    expect(response.state.players[0]!.cardStates[id(339)]?.extraData?.peltRooms).toEqual(['1-0', '2-0'])
    expect(response.scores[0]!.categories.find(category => category.key === 'cardBonusVp')?.total).toBe(2)
    expect(response.state.events).toContainEqual(expect.objectContaining({ type: 'resource.paid', resources: { food: 2 }, sourceCardId: id(339) }))
  })
  it('Pelts restores its pending selection, rejects duplicate or already marked rooms, and can be skipped', () => {
    let session = setup([339], state => {
      const player = state.players[0]!
      player.improvements = ['Major_Fireplace1']
      player.cardStates[id(339)] = { extraData: { peltRooms: ['1-0'] } }
      pasture(player, 'sheep', 2)
    }, true)
    let response = ok(session.takeAnytimeAction(0, 'exchange'))
    const cook = sessionOptions(response).find(option => option.effectPreview?.kind === 'resourceExchange' && option.effectPreview.resourcesPaid?.sheep)!
    response = settle(session, session.resolveChoice(0, `bulk:${cook.value.split(':')[1]}=2`))
    expect(response.interaction).toMatchObject({ stateId: 'wait', request: { kind: 'selection', selection: { maxSelections: 1 } } })
    const recovered = new GameSession(rehydrateState(JSON.parse(JSON.stringify(serializeSessionSnapshot(session.state, session)))), sources.map(source => ({ cardType: 'minor', cardJson: source.meta })))
    sessions.push(recovered)
    session = recovered
    const before = structuredClone(session.state.players[0]!)
    for (const positions of [['1-0'], ['2-0', '2-0'], ['0-4']]) {
      const rejected = session.commitSelectionChoice(0, { positions })
      expect(rejected.ok).toBe(false)
      expect(rejected.state.players[0]).toEqual(before)
    }
    response = ok(session.commitSelectionChoice(0, { positions: [] }))
    expect(response.state.players[0]!.resources.food).toBe(4)
    expect(response.state.players[0]!.cardStates[id(339)]?.extraData?.peltRooms).toEqual(['1-0'])
    expect(response.scores[0]!.categories.find(category => category.key === 'cardBonusVp')?.total).toBe(1)
    expect(response.state.events.some(event => event.type === 'resource.paid' && event.sourceCardId === id(339))).toBe(false)
  })
  it.each(['vegetable-food', 'sheep-stone'] as const)('Pelts does not trigger for %s exchanges', recipe => {
    const session = setup([339], state => {
      const player = state.players[0]!
      player.improvements = ['Major_Fireplace1']
      player.occupationPlayed.push('B104_SheepWalker')
      player.resources.vegetable = 1
      pasture(player, 'sheep', 1)
    }, true)
    let response = ok(session.takeAnytimeAction(0, 'exchange'))
    const exchange = sessionOptions(response).find(option => {
      const preview = option.effectPreview
      return preview?.kind === 'resourceExchange' && (recipe === 'vegetable-food'
        ? preview.resourcesPaid?.vegetable === 1 && preview.resourcesGained?.food === 2
        : preview.resourcesPaid?.sheep === 1 && preview.resourcesGained?.stone === 1)
    })!
    expect(exchange).toBeDefined()
    response = settle(session, session.resolveChoice(0, exchange.value), false)
    expect(response.state.players[0]!.cardStates[id(339)]?.extraData?.peltRooms).toBeUndefined()
    expect(response.state.players[0]!.resources).toMatchObject(recipe === 'vegetable-food' ? { vegetable: 0, food: 2 } : { sheep: 0, stone: 1 })
    expect(response.scores[0]!.categories.find(category => category.key === 'cardBonusVp')?.total ?? 0).toBe(0)
  })
  it('Clapper grows grain and card-resource fields after using a family growth space, excluding vegetables', () => {
    const session = setup([127], state => {
      state.round = 5
      state.roundActionOrder[0] = 'wish-children'
      const p = state.players[0]!
      p.rooms = 3
      p.roomTiles.push({ row: 0, col: 0 })
      p.fields = [
        { row: 0, col: 1, stacks: [{ kind: 'grain', remaining: 2 }] },
        { row: 0, col: 2, stacks: [{ kind: 'vegetable', remaining: 2 }] }
      ]
      p.minorPlayed.push('OLD_I78_Copse')
      p.cardStates.OLD_I78_Copse = { extraData: { cardFieldStacks: [{ crop: 'wood', remaining: 2 }, { crop: 'wood', remaining: 1 }] } }
    }, true)
    const response = settle(session, session.takeAction(0, 'wish-children'), false)
    expect(response.state.players[0]!.fields.map(field => field.stacks[0]?.remaining)).toEqual([3, 2])
    expect(response.state.players[0]!.cardStates.OLD_I78_Copse?.extraData?.cardFieldStacks).toEqual([{ crop: 'wood', remaining: 3 }, { crop: 'wood', remaining: 2 }])
    assertPlayed(response, 127)
  })
  it('Clapper purchased during family growth adds one crop, without duplicating its immediate purchase effect', () => {
    const session = setup([127], state => {
      state.round = 5
      state.roundActionOrder[0] = 'wish-children'
      const player = state.players[0]!
      player.rooms = 3
      player.roomTiles.push({ row: 0, col: 0 })
      player.resources.wood = 1
      player.fields = [{ row: 0, col: 1, stacks: [{ kind: 'grain', remaining: 2 }] }]
    })
    const response = settle(session, session.takeAction(0, 'wish-children'))
    expect(response.state.players[0]!.minorPlayed).toContain(id(127))
    expect(response.state.players[0]!.resources.wood).toBe(0)
    expect(response.state.players[0]!.fields[0]!.stacks[0]!.remaining).toBe(3)
    expect(response.interaction).toMatchObject({ stateId: 'wait', request: { kind: 'confirm-next-player' } })
    assertPlayed(response, 127)
  })
  it('Clapper also grows fields when bought while the owner occupies family growth, but not otherwise', () => {
    for (const occupied of [true, false]) {
      const session = setup([127], state => {
        const p = state.players[0]!
        p.resources.wood = 1
        p.fields = [{ row: 0, col: 1, stacks: [{ kind: 'grain', remaining: 2 }] }]
        if (occupied) state.actionSpaces.find(space => space.id === 'wish-children')!.takenBy.push({ playerId: p.id, workerId: p.workers[1]!.id })
      })
      const response = settle(session, playMinor(session, id(127)))
      expect(response.state.players[0]!.fields[0]!.stacks[0]!.remaining).toBe(occupied ? 3 : 2)
    }
  })
  it.each([
    { occupants: [1], allowed: true },
    { occupants: [1, 2], allowed: false },
    { occupants: [0], allowed: false }
  ])('Sleeping Corner occupied-space rule: $occupants -> $allowed', ({ occupants, allowed }) => {
    const session = setup([139], state => {
      state.round = 5
      state.roundActionOrder[0] = 'wish-children'
      const p = state.players[0]!
      p.rooms = 3
      p.roomTiles.push({ row: 0, col: 0 })
      const space = state.actionSpaces.find(space => space.id === 'wish-children')!
      for (const index of occupants) space.takenBy.push({ playerId: state.players[index]!.id, workerId: state.players[index]!.workers[0]!.id })
    }, true)
    expect(session.getActionAvailability(0)['wish-children']).toBe(allowed)
    const response = session.takeAction(0, 'wish-children')
    expect(response.ok).toBe(allowed)
    expect(response.state.players[0]!.workers.filter(worker => worker.isActive)).toHaveLength(allowed ? 3 : 2)
    expect(response.scores).toHaveLength(4)
    if (allowed) expect(response.state.events.some(event => event.type === 'worker.placed' && event.sourceActionId === 'family-growth')).toBe(true)
  })
  it('Sleeping Corner counts card grain fields in its prerequisite and rejects only one field', () => {
    for (const count of [1, 2]) {
      const session = setup([139], state => {
        const p = state.players[0]!
        p.resources.wood = 1
        p.fields = [{ row: 0, col: 1, stacks: [{ kind: 'grain', remaining: 2 }] }]
        if (count === 2) {
          p.minorPlayed = ['B113_PatchCaregiver']
          p.cardStates.B113_PatchCaregiver = { extraData: { cardFieldStacks: [{ crop: 'grain', remaining: 2 }] } }
        }
      })
      const response = settle(session, playMinor(session, id(139)))
      expect(response.state.players[0]!.minorPlayed.includes(id(139))).toBe(count === 2)
    }
  })
  it.each([
    { n: 133, animal: 'cattle', count: 5, bonus: 2, food: 3 },
    { n: 146, animal: 'sheep', count: 7, bonus: 2, food: 3 }
  ] as const)('K$n uses field-phase animals for food and final scoring', ({ n, animal, count, bonus, food }) => {
    const session = setup([n], state => {
      state.round = 4
      for (const p of state.players) {
        p.resources.food = 20
        markAllWorkersUsed(state, p)
      }
      pasture(state.players[0]!, animal, count)
      state.players[0]!.stableTiles = [{ row: 1, col: 1 }]
    }, true)
    expect(session.getState().scores[0]!.categories.find(category => category.key === 'cardBonusVp')?.total).toBe(bonus)
    const response = ok(session.performRoundEnd())
    expect(response.state.players[0]!.resources.food).toBe(20 + food - 4)
    expect(response.state.events).toContainEqual(expect.objectContaining({ sourceCardId: id(n), type: 'resource.moved', resources: { food } }))
    expect(response.interaction.stateId).toBe('wait')
  })
  it('Horse awards two points once for any missing basic animal, and none with all three', () => {
    const session = setup([135], undefined, true)
    expect(session.getState().scores[0]!.categories.find(category => category.key === 'cardBonusVp')?.total).toBe(2)
    const all = setup([135], state => {
      const p = state.players[0]!
      Object.assign(p.resources, { sheep: 1, boar: 1, cattle: 1 })
      p.pastures = ['sheep', 'boar', 'cattle'].map((animal, i) => ({
        id: animal,
        animalType: animal as 'sheep' | 'boar' | 'cattle',
        animalCount: 1,
        tiles: [{ row: i, col: 1 }]
      }))
    }, true)
    expect(all.getState().scores[0]!.categories.find(category => category.key === 'cardBonusVp')?.total ?? 0).toBe(0)
  })
  it.each(['wood', 'clay', 'stone'] as const)('Mansion scores only stone rooms and supersedes Half-timbered House: %s', houseType => {
    const session = setup([144], state => {
      state.players[0]!.houseType = houseType
      state.players[0]!.minorPlayed.push('OLD_E21_HalftimberedHouse')
    }, true)
    expect(session.getState().scores[0]!.categories.find(category => category.key === 'cardBonusVp')?.total ?? 0).toBe(houseType === 'stone' ? 4 : 0)
  })
  it('Forest Pasture houses a large boar herd and rejects sheep', () => {
    const session = setup([145], state => {
      state.round = 14
      state.players[0]!.resources.sheep = 1
      state.actionSpaces.find(space => space.id === 'pig-market')!.resources.boar = 100
    }, true)
    let response = ok(session.takeAction(0, 'pig-market'))
    expect(response.interaction).toMatchObject({ stateId: 'wait', request: { kind: 'animal-reorg' } })
    const invalid = session.resolveChoice(0, 'confirm', {
      zones: [{ id: `card:${id(145)}`, zoneType: 'card', cardId: id(145), animalType: 'sheep', animalCount: 1 }]
    })
    expect(invalid.ok).toBe(false)
    response = ok(session.resolveChoice(0, 'confirm', {
      zones: [{ id: `card:${id(145)}`, zoneType: 'card', cardId: id(145), animalType: 'boar', animalCount: 100 }]
    }))
    expect(response.state.players[0]!.resources.boar).toBe(100)
    expect(response.state.players[0]!.resources.sheep).toBe(0)
    expect(response.scores).toHaveLength(4)
  })

  it('Reed Hut grants a persistent worker from supply without family points, usable this round and fed separately', () => {
    const session = setup([138], state => Object.assign(state.players[0]!.resources, { reed: 4, wood: 1 }))
    const beforeFamilyScore = session.getState().scores[0]!.categories.find(category => category.key === 'farmers')?.total
    expect(beforeFamilyScore).toBe(6)
    const response = settle(session, playMinor(session, id(138)))
    const p = response.state.players[0]!
    expect(p.resources).toMatchObject({ reed: 0, wood: 0 })
    expect(familySize(p)).toBe(2)
    expect(p.workers).toHaveLength(5)
    const worker = p.workers.find(candidate => candidate.supplyUse?.sourceCard === id(138))!
    expect(worker).toMatchObject({
      isActive: false,
      isNewborn: false,
      supplyUse: { status: 'temporary', familyGrowthEligible: true, availableFromRound: 1 }
    })
    expect(worker.supplyUse?.returnRound).toBeUndefined()
    expect(session.withCtx(() => availableWorkers(session.state, session.state.players[0]!)).map(candidate => candidate.id)).toContain(worker.id)
    expect(session.withCtx(() => computeHarvestFeedingRequirement(session.state, session.state.players[0]!))).toBe(6)
    expect(response.scores[0]!.categories.find(category => category.key === 'farmers')?.total).toBe(beforeFamilyScore)
    assertPlayed(response, 138)
  })
  it('Reed Hut feeds its temporary worker at harvest and returns it for the next round without family points', () => {
    const session = setup([138], state => {
      state.round = 4
      const player = state.players[0]!
      player.workers[2]!.supplyUse = {
        sourceCard: id(138), disposition: 'return-to-supply',
        status: 'temporary', familyGrowthEligible: true,
      }
      for (const owner of state.players) {
        owner.resources.food = 20
        markAllWorkersUsed(state, owner)
      }
      state.actionSpaces.find(space => space.id === 'forest')!.takenBy.push({
        playerId: player.id, workerId: player.workers[2]!.id,
      })
    }, true)
    const response = ok(session.performRoundEnd())
    const player = response.state.players[0]!
    expect(response.state.round).toBe(5)
    expect(player.resources.food).toBe(14)
    expect(familySize(player)).toBe(2)
    expect(player.workers[2]!.supplyUse?.sourceCard).toBe(id(138))
    expect(session.withCtx(() => availableWorkers(session.state, session.state.players[0]!)).map(worker => worker.id)).toContain(player.workers[2]!.id)
    expect(response.scores[0]!.categories.find(category => category.key === 'farmers')?.total).toBe(6)
  })
  it('Reed Hut does not create a sixth worker when the personal supply is empty', () => {
    const session = setup([138], state => {
      const p = state.players[0]!
      p.workers.forEach(worker => {
        worker.isActive = true
      })
      Object.assign(p.resources, { reed: 4, wood: 1 })
    })
    const response = settle(session, playMinor(session, id(138)))
    expect(response.state.players[0]!.workers).toHaveLength(5)
    expect(response.state.players[0]!.workers.some(worker => worker.supplyUse?.sourceCard === id(138))).toBe(false)
    expect(familySize(response.state.players[0]!)).toBe(5)
  })

  it.each([
    { used: false, fullSupply: false, recover: false },
    { used: true, fullSupply: false, recover: true },
    { used: false, fullSupply: true, recover: true }
  ])('Reed Hut joins the family without recalling its placement: %j', ({ used, fullSupply, recover }) => {
    let session = setup([138], state => {
      state.round = 5
      state.roundActionOrder[0] = 'wish-children'
      const p = state.players[0]!
      p.rooms = 5
      p.roomTiles = [{ row: 1, col: 0 }, { row: 2, col: 0 }, { row: 0, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 1 }]
      if (fullSupply) p.workers.slice(0, 4).forEach(worker => {
        worker.isActive = true
      })
      const guest = p.workers[fullSupply ? 4 : 2]!
      guest.supplyUse = {
        sourceCard: id(138),
        disposition: 'return-to-supply',
        status: 'temporary',
        familyGrowthEligible: true
      }
      if (used) state.actionSpaces.find(space => space.id === 'forest')!.takenBy.push({ playerId: p.id, workerId: guest.id })
    }, true)
    const before = structuredClone(session.state.players[0]!)
    const guestId = before.workers.find(worker => worker.supplyUse?.sourceCard === id(138))!.id
    let response = ok(session.takeAction(0, 'wish-children'))
    if (!fullSupply) {
      expect(sessionOptions(response).map(option => option.value)).toContain(`join-family:${guestId}`)
      expect(sessionOptions(response).some(option => option.value === 'newborn')).toBe(true)
    }
    if (recover) {
      const recovered = new GameSession(rehydrateState(JSON.parse(JSON.stringify(serializeSessionSnapshot(session.state, session)))), sources.map(source => ({ cardType: 'minor', cardJson: source.meta })))
      sessions.push(recovered)
      session = recovered
      session.withCtx(() => {
        for (const source of sources) requireActiveCardRegistry('restored classic K').loadImpl(source.id, source.impl)
      })
    }
    response = settle(session, fullSupply ? session.getState() : session.resolveChoice(0, `join-family:${guestId}`), false)
    const p = response.state.players[0]!
    expect(familySize(p)).toBe(familySize(before) + 1)
    expect(p.workers.find(worker => worker.id === guestId)).toMatchObject({ isActive: true, isNewborn: false })
    expect(p.workers.find(worker => worker.id === guestId)?.supplyUse).toBeUndefined()
    expect(response.state.actionSpaces.find(space => space.id === 'forest')!.takenBy.some(ref => ref.playerId === p.id && ref.workerId === guestId)).toBe(used)
    expect(response.state.actionSpaces.find(space => space.id === 'wish-children')!.takenBy.some(ref => ref.playerId === p.id && ref.workerId === guestId)).toBe(false)
    expect(session.withCtx(() => availableWorkers(session.state, session.state.players[0]!)).some(worker => worker.id === guestId)).toBe(!used)
    expect(session.withCtx(() => computeHarvestFeedingRequirement(session.state, session.state.players[0]!))).toBe(familySize(p) * 2)
    expect(response.scores[0]!.categories.find(category => category.key === 'farmers')?.total).toBe(familySize(p) * 3)
    expect(response.state.events).toContainEqual(expect.objectContaining({ type: 'worker.placed', workerId: guestId, sourceActionId: 'family-growth' }))
  })
  it('Reed Hut cannot promote itself when it is the only available person and supply is empty', () => {
    const session = setup([138], state => {
      state.round = 5
      state.roundActionOrder[0] = 'wish-children'
      const p = state.players[0]!
      p.rooms = 5
      p.workers.slice(0, 4).forEach(worker => {
        worker.isActive = true
        state.actionSpaces.find(space => space.id === 'forest')!.takenBy.push({ playerId: p.id, workerId: worker.id })
      })
      p.workers[4]!.supplyUse = {
        sourceCard: id(138),
        disposition: 'return-to-supply',
        status: 'temporary',
        familyGrowthEligible: true
      }
    }, true)
    const before = structuredClone(session.state.players[0]!)
    const response = session.takeAction(0, 'wish-children')
    expect(response.ok).toBe(false)
    expect(response.state.players[0]).toEqual(before)
  })
})
