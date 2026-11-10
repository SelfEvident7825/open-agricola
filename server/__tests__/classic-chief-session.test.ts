import { afterEach, describe, expect, it } from 'vitest'
import type { GameSession } from '../game/authoritative-session'
import { createWorkSession } from './_helpers/session-fixtures'
import { assertRejectedUnchanged } from './_helpers/session-assertions'

const CHIEF = 'OLD_E172_Chief'
const sessions: GameSession[] = []
afterEach(() => sessions.splice(0).forEach((session) => session.dispose()))

function setup(food: number, priorOccupation = false) {
  const session = createWorkSession({
    seed: 42,
    options: { playerCount: 4, gameEdition: 'classic' },
    configure(state) {
      const player = state.players[0]!
      player.occupationHand = [CHIEF, 'OLD_E176_Woodcutter']
      player.occupationPlayed = priorOccupation ? ['OLD_E203_Shepherd'] : []
      player.resources.food = food
    },
  })
  sessions.push(session)
  return session
}

describe('classic Chief individual food cost', () => {
  it.each([0, 1, 2])('pays its additional cost after a free first lesson with %i food', (food) => {
    const session = setup(food)
    let response = session.takeAction(0, 'lessons')
    expect(response.ok, response.error).toBe(true)
    expect(response.interaction).toMatchObject({ stateId: 'wait', request: { kind: 'choice' } })
    response = session.resolveChoice(0, CHIEF)
    expect(response.ok, response.error).toBe(true)
    if (food < 2) {
      expect(response.interaction).toMatchObject({
        stateId: 'wait', playerIndex: 0,
        request: { kind: 'choice', requiresExplicitChoice: true },
      })
      expect(response.state.players[0]!.resources).toMatchObject({ food, begging: 0 })
      assertRejectedUnchanged(session, () => session.resolveChoice(0, '__skip__'))
      response = session.resolveChoice(0, 'confirm')
    }
    expect(response.ok, response.error).toBe(true)
    expect(response.state.players[0]!.occupationPlayed).toContain(CHIEF)
    expect(response.state.players[0]!.resources).toMatchObject({ food: 0, begging: 2 - food })
    expect(response.state.events.flatMap((event) =>
      event.type === 'resource.paid' && event.sourceCardId === CHIEF && event.paymentFor === 'cardEffect'
        ? [event.resources] : [],
    )).toEqual(food ? [{ food }] : [])
    expect(response.state.events.flatMap((event) =>
      event.type === 'resource.moved' && event.sourceCardId === CHIEF && event.resources.begging
        ? [event.resources] : [],
    )).toEqual(food < 2 ? [{ begging: 2 - food }] : [])
    expect(response.scores).toHaveLength(4)
  })

  it('keeps the normal occupation fee separate from the mandatory two food', () => {
    const session = setup(3, true)
    expect(session.takeAction(0, 'lessons').ok).toBe(true)
    const response = session.resolveChoice(0, CHIEF)
    expect(response.ok, response.error).toBe(true)
    expect(response.state.players[0]!.resources).toMatchObject({ food: 0, begging: 0 })
    expect(response.state.events.flatMap((event) =>
      event.type === 'resource.paid' && event.sourceCardId === CHIEF
        ? [{ for: event.paymentFor, resources: event.resources }] : [],
    )).toEqual([
      { for: 'occupation', resources: { food: 1 } },
      { for: 'cardEffect', resources: { food: 2 } },
    ])
  })

  it('does not waive an unaffordable normal lesson fee', () => {
    const session = setup(0, true)
    assertRejectedUnchanged(session, () => session.takeAction(0, 'lessons'))
    expect(session.state.players[0]!.occupationHand).toEqual([CHIEF, 'OLD_E176_Woodcutter'])
    expect(session.state.players[0]!.resources.begging).toBe(0)
  })
})
