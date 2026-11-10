import { describe, expect, it } from 'vitest'
import type { ActionExecutionContext, ProtectedObservation } from '../../../contract/types'
import type { PrivateHandChangedEvent } from '../../../contract/private-events'
import { drawOrdinaryCardsAction } from '../internal/draw-ordinary-cards'

describe('draw-ordinary-cards protected observation', () => {
  it.each([{ deck: ['new-a', 'new-b'] }, { deck: [] }])('replaces only the requested hand with the remaining draw supply: $deck', ({ deck }) => {
    const observations: ProtectedObservation[] = []
    const privateEvents: PrivateHandChangedEvent[] = []
    const context = {
      state: { ordinaryCardDecks: { occupation: ['unrelated'], minor: [...deck] } },
      player: { id: 'p1', occupationHand: ['occupation'], minorHand: ['old-a', 'old-b'] },
      space: { id: 'test' }, sourceCard: 'test-hand-replacement',
      params: { cardType: 'minor', count: 7, replaceHand: true },
      emitPrivateEvent: (event: PrivateHandChangedEvent) => privateEvents.push(event),
      reportProtectedObservation: (observation: ProtectedObservation) => observations.push(observation),
    } as unknown as ActionExecutionContext
    expect(drawOrdinaryCardsAction.canBeExecutedByPlayer!(context.state, context.player, context)).toBe(true)
    const result = drawOrdinaryCardsAction.execute!(context)
    expect(result).toMatchObject({ type: 'ok', extraData: { drawnCards: deck, discardedCards: ['old-a', 'old-b'] } })
    expect(context.player.minorHand).toEqual(deck)
    expect(context.player.occupationHand).toEqual(['occupation'])
    expect(context.state.ordinaryCardDecks).toEqual({ occupation: ['unrelated'], minor: [] })
    expect(privateEvents).toEqual([expect.objectContaining({ recipientPlayerId: 'p1', cardType: 'minor', cardIds: deck })])
    expect(context.state.pendingUndoBoundary).toBe(deck.length ? true : undefined)
    expect(observations).toEqual(deck.length ? [{ kind: 'hidden-information', recipientPlayerIds: ['p1'] }] : [])
  })

  it('reports the recipient when hidden cards are drawn', () => {
    const observations: ProtectedObservation[] = []
    const context = {
      state: { ordinaryCardDecks: { occupation: ['A', 'B'], minor: [] } },
      player: { id: 'p1', occupationHand: [], minorHand: [] },
      space: { id: 'test' },
      actionContext: { cardType: 'occupation', count: 1 },
      reportProtectedObservation: (observation: ProtectedObservation) => observations.push(observation),
    } as unknown as ActionExecutionContext

    drawOrdinaryCardsAction.execute!(context)

    expect(context.state.pendingUndoBoundary).toBe(true)
    expect(observations).toEqual([{
      kind: 'hidden-information',
      recipientPlayerIds: ['p1'],
    }])
  })
})
