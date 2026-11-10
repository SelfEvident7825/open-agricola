import { afterEach, describe, expect, it } from 'vitest'
import { requireActiveCardRegistry } from '../../shared/cards/active-registry'
import { createWorkSession } from './_helpers/session-fixtures'
import { GameSession } from '../game/authoritative-session'
import { rehydrateState, serializeSessionSnapshot } from '../../shared/session/serialization'
import { assertRejectedUnchanged } from './_helpers/session-assertions'

const SOURCE = 'OLD_E12_FishingRod'
const CHIEF = 'OLD_E172_Chief'
const sessions: GameSession[] = []
afterEach(() => sessions.splice(0).forEach(session => session.dispose()))

function setup(forced: boolean, reserve = 0) {
  const session = createWorkSession({
    seed: 42,
    options: { playerCount: 4, gameEdition: 'classic' },
    configure(state) {
      state.players[0]!.minorPlayed = [SOURCE]
      state.players[0]!.occupationHand = [CHIEF]
      state.players[0]!.resources.food = 0
      state.players[1]!.occupationHand = ['OLD_E176_Woodcutter']
      state.players[1]!.occupationPlayed = ['OLD_E203_Shepherd']
      state.players[1]!.resources.food = 0
    },
  })
  session.withCtx(() => requireActiveCardRegistry('forced occupation test').loadImpl(SOURCE, {
    listeners: [{
      id: `${SOURCE}-forced-test`, cardIds: [SOURCE], phases: ['after'], actions: ['gain'],
      handler: context => context.space?.id === 'day-laborer' ? ({ sourceCard: SOURCE, flow: {
        type: 'leaf', actionId: 'occupation', sourceCard: SOURCE,
        params: { allowedCards: [CHIEF], exactCost: { food: 5 }, foodShortfallToBegging: forced },
      } }) : undefined,
    }, ...(reserve ? [{
      id: `${SOURCE}-reserve-test`, cardIds: [SOURCE], phases: ['isDoable' as const], actions: ['occupation' as const],
      handler: () => ({ reserveResources: { food: reserve } }),
    }] : [])],
  }))
  sessions.push(session)
  return session
}

describe('mandatory occupation food shortfall at the Session boundary', () => {
  it('records lesson debt, then settles Chief’s separate mandatory cost after saved pending recovery', () => {
    const session = setup(true)
    const response = session.takeAction(0, 'day-laborer')
    expect(response.ok, response.error).toBe(true)
    expect(response.state.players[0]!.occupationPlayed).toContain(CHIEF)
    expect(response.state.players[0]!.resources).toMatchObject({ food: 0, begging: 3 })
    expect(response.interaction).toMatchObject({ stateId: 'wait', playerIndex: 0, request: { kind: 'choice', requiresExplicitChoice: true } })
    const saved = session.withCtx(() => serializeSessionSnapshot(session.state, session))
    const restored = new GameSession(rehydrateState(JSON.parse(JSON.stringify(saved))))
    sessions.push(restored)
    assertRejectedUnchanged(restored, () => restored.resolveChoice(0, '__skip__'))
    const settled = restored.resolveChoice(0, 'confirm')
    expect(settled.ok, settled.error).toBe(true)
    expect(settled.state.players[0]!.resources).toMatchObject({ food: 0, begging: 5 })
    expect(settled.state.players.slice(1).map(player => player.resources.begging)).toEqual([0, 0, 0])
    expect(settled.state.events.flatMap(event => event.type === 'resource.paid' && event.sourceCardId === CHIEF
      ? [event.resources] : [])).toEqual([{ food: 2 }])
    expect(settled.state.events.flatMap(event => event.type === 'resource.paid' && event.sourceCardId === CHIEF
      ? [{ for: event.paymentFor, resources: event.resources }] : []))
      .toEqual([{ for: 'occupation', resources: { food: 2 } }])
    expect(settled.state.events.flatMap(event => event.type === 'resource.moved' && event.sourceCardId === CHIEF
      ? [event.resources] : [])).toEqual([{ begging: 3 }, { begging: 2 }])
    expect(settled.state.log).toContainEqual(expect.objectContaining({
      key: 'log.playOccupation', params: expect.objectContaining({ costResources: { food: 2 } }),
    }))
    expect(settled.scores).toHaveLength(4)
    const transition = restored.getState().interaction
    expect(transition).toMatchObject({ stateId: 'wait', request: { kind: 'confirm-next-player' } })
    if (transition.stateId !== 'wait') throw new Error('Expected turn confirmation')
    expect(restored.resolveChoice(transition.playerIndex, 'confirm').ok).toBe(true)
    assertRejectedUnchanged(restored, () => restored.takeAction(1, 'lessons'))
  })

  it('leaves explicitly reserved food intact for the chosen occupation’s mandatory onBuy cost', () => {
    const session = setup(true, 2)
    const response = session.takeAction(0, 'day-laborer')
    expect(response.ok, response.error).toBe(true)
    expect(response.state.players[0]!.occupationPlayed).toContain(CHIEF)
    expect(response.state.players[0]!.resources).toMatchObject({ food: 0, begging: 5 })
    expect(response.state.events.flatMap(event => event.type === 'resource.paid' && event.sourceCardId === CHIEF
      ? [{ for: event.paymentFor, resources: event.resources }] : []))
      .toEqual([{ for: 'cardEffect', resources: { food: 2 } }])
  })

  it('does not offer the same unaffordable ordinary occupation without explicit permission', () => {
    const session = setup(false)
    const response = session.takeAction(0, 'day-laborer')
    expect(response.ok, response.error).toBe(true)
    expect(response.state.players[0]!.occupationPlayed).not.toContain(CHIEF)
    expect(response.state.players[0]!.resources).toMatchObject({ food: 2, begging: 0 })
  })
})
