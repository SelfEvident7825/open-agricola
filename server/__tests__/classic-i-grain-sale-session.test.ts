import { afterEach, describe, expect, it } from 'vitest'
import { rehydrateState, serializeSessionSnapshot } from '../../shared/session/serialization'
import { GameSession, type SessionResponse } from '../game/authoritative-session'

const CARD_ID = 'OLD_I239_CornProteer'
const SALE = 'OLD_I239-grain-sale-anytime'

const sessions: GameSession[] = []
afterEach(() => {
  for (const s of sessions.splice(0)) s.dispose()
})
const setup = () => {
  const session = new GameSession(893159, undefined, {
    playerCount: 4,
    gameEdition: 'classic',
    ordinaryCardDeckSeed: 42,
  })
  sessions.push(session)
  for (const player of session.state.players) {
    player.minorHand = ['__test_placeholder__']
    player.occupationHand = ['__test_placeholder__']
    player.resources.food = 3
  }
  session.state.players[0]!.occupationHand = [CARD_ID, '__test_placeholder__']
  session.state.players[0]!.resources.grain = 2
  session.state.roundPhase = 'work'
  session.loadState(session.state)
  let response = session.takeAction(0, 'lessons')
  if (!response.state.players[0]!.occupationPlayed.includes(CARD_ID))
    response = session.resolveChoice(0, CARD_ID)
  expect(response.ok, response.error).toBe(true)
  expect(response.state.players[0]!.occupationPlayed).toContain(CARD_ID)
  return session
}

const confirmSwitches = (session: GameSession, initial: SessionResponse): SessionResponse => {
  let response = initial
  for (
    let step = 0;
    step < 8 &&
    response.interaction.stateId === 'wait' &&
    response.interaction.request.kind === 'confirm-player-switch';
    step++
  ) {
    response = session.resolveChoice(response.interaction.request.fromPlayerIndex, 'confirm')
    expect(response.ok, response.error).toBe(true)
  }
  return response
}

const answer = (session: GameSession, initial: SessionResponse, player: number, value: string) => {
  const response = confirmSwitches(session, initial)
  expect(response.interaction.stateId).toBe('wait')
  expect(response.interaction.playerIndex).toBe(player)
  expect(response.interaction.sourceCard).toBe(CARD_ID)
  const answered = session.resolveChoice(player, value)
  expect(answered.ok, answered.error).toBe(true)
  return answered
}

describe('classic I239 — four-player negotiated grain sales', () => {
  it.each([false, true])(
    'transfers only the chosen buyer payment when several players are willing: %s',
    (multiple) => {
      const session = setup()
      let response = session.takeAnytimeAction(0, SALE)
      expect(response.ok, response.error).toBe(true)
      response = answer(session, response, 1, 'buy')
      expect(response.state.players[1]!.resources.food).toBe(3)
      response = answer(session, response, 2, multiple ? 'buy' : 'decline')
      response = answer(session, response, 3, 'decline')
      response = confirmSwitches(session, response)
      if (multiple) {
        expect(response.interaction.playerIndex).toBe(0)
        const before = structuredClone(response.state.players)
        const rejected = session.resolveChoice(0, response.state.players[3]!.id)
        expect(rejected.ok).toBe(false)
        expect(rejected.state.players).toEqual(before)
        response = session.resolveChoice(0, response.state.players[2]!.id)
      }
      expect(response.ok, response.error).toBe(true)
      expect(response.state.players[0]!.resources).toMatchObject({
        grain: 1,
        food: 5,
      })
      expect(response.state.players[multiple ? 2 : 1]!.resources).toMatchObject({
        grain: 1,
        food: 1,
      })
      expect(response.state.players[multiple ? 1 : 2]!.resources.food).toBe(3)
    },
  )

  it('lets an initially unaffordable buyer cook before accepting and rejects premature acceptance', () => {
    const session = setup()
    const buyer = session.state.players[1]!
    buyer.resources.food = 1
    buyer.resources.sheep = 1
    buyer.houseAnimals = Object.fromEntries(
      buyer.roomTiles.slice(0, 1).map((tile) => [`${tile.row}-${tile.col}`, 'sheep']),
    )
    buyer.improvements = ['Major_Fireplace1']
    let response = confirmSwitches(session, session.takeAnytimeAction(0, SALE))
    expect(response.interaction.playerIndex).toBe(1)
    const rejected = session.resolveChoice(1, 'buy')
    expect(rejected.ok).toBe(false)
    expect(rejected.interaction.playerIndex).toBe(1)
    expect(rejected.state.players[1]!.resources.food).toBe(1)
    response = session.takeAnytimeAction(1, 'exchange')
    expect(response.ok, response.error).toBe(true)
    const cooking = response.interaction.request.options.find(
      (option) =>
        option.effectPreview?.kind === 'resourceExchange' &&
        option.effectPreview.resourcesPaid?.sheep === 1,
    )!
    response = session.resolveChoice(1, cooking.value)
    expect(response.ok, response.error).toBe(true)
    response = answer(session, response, 1, 'buy')
    response = answer(session, response, 2, 'decline')
    response = answer(session, response, 3, 'decline')
    response = confirmSwitches(session, response)
    expect(response.state.players[1]!.resources).toMatchObject({
      food: 1,
      grain: 1,
      sheep: 0,
    })
    expect(response.state.players[0]!.resources).toMatchObject({
      food: 5,
      grain: 1,
    })
  })

  it('restores public responses and completes the same sale after serialization', () => {
    const session = setup()
    const response = answer(session, session.takeAnytimeAction(0, SALE), 1, 'buy')
    const snapshot = serializeSessionSnapshot(session.state, session)
    const restored = new GameSession(rehydrateState(JSON.parse(JSON.stringify(snapshot))))
    sessions.push(restored)
    let next = restored.getState()
    expect(next.state.players[0]!.cardStates[CARD_ID]?.extraData?.sale).toEqual(
      response.state.players[0]!.cardStates[CARD_ID]?.extraData?.sale,
    )
    next = answer(restored, next, 2, 'decline')
    next = answer(restored, next, 3, 'decline')
    next = confirmSwitches(restored, next)
    expect(next.state.players[0]!.resources).toMatchObject({
      grain: 1,
      food: 5,
    })
    expect(next.state.players[1]!.resources).toMatchObject({
      grain: 1,
      food: 1,
    })
  })

  it('sells one grain for three food when every other player declines', () => {
    const session = setup()
    let response = session.takeAnytimeAction(0, SALE)
    expect(response.ok, response.error).toBe(true)
    expect(response.state.players[0]!.resources).toMatchObject({
      grain: 2,
      food: 3,
    })
    for (const index of [1, 2, 3]) response = answer(session, response, index, 'decline')
    response = confirmSwitches(session, response)
    expect(response.state.players[0]!.resources).toMatchObject({
      grain: 1,
      food: 6,
    })
    expect(response.state.players.slice(1).map((player) => player.resources.food)).toEqual([
      3, 3, 3,
    ])
    expect(response.state.players[0]!.cardStates[CARD_ID]?.extraData?.sale).toBeUndefined()
    expect(response.state.log.some((entry) => JSON.stringify(entry.params).includes(CARD_ID))).toBe(
      true,
    )
    expect(session.takeAnytimeAction(0, SALE).ok).toBe(true)
  })
})
