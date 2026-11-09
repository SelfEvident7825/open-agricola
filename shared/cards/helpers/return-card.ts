/**
 * Card retire / return-to-board helper.
 *
 * Removes a card from a player's `improvements` (Major) or `minorPlayed`
 * (Minor) and optionally returns it to the global available-major pool.
 * Pure mutation; no payment / cost concept.
 *
 * Moved out of payment execution internals (S3 Task 8 A3 decision) because it
 * belongs to the cards / retire domain rather than the payment domain.
 */

import type { GameState, PlayerState } from '../../contract/types'
import { returnMajorImprovementToSupply } from '../major/supply'

export const returnCardToBoard = (
  player: PlayerState,
  cardId: string,
  state?: Pick<GameState, 'availableMajorImprovements' | 'majorImprovementSupply'> & Partial<Pick<GameState, 'futureMeeples' | 'pendingFutureMeeples'>>,
): void => {
  if (state?.futureMeeples) state.futureMeeples = state.futureMeeples.filter(entry => entry.playerId !== player.id || entry.cardId !== cardId)
  if (state?.pendingFutureMeeples) state.pendingFutureMeeples = state.pendingFutureMeeples.filter(entry => entry.playerId !== player.id || entry.cardId !== cardId)
  const improvementIndex = player.improvements.indexOf(cardId)
  if (improvementIndex > -1) {
    player.improvements.splice(improvementIndex, 1)
    if (state) returnMajorImprovementToSupply(state, cardId)
  }
  const minorPlayedIndex = player.minorPlayed.indexOf(cardId)
  if (minorPlayedIndex > -1) {
    player.minorPlayed.splice(minorPlayedIndex, 1)
    if (player.extraOccupationsFromCards) {
      player.extraOccupationsFromCards = player.extraOccupationsFromCards.filter(
        (id) => id !== cardId,
      )
    }
    if (player.cardStates) {
      delete player.cardStates[cardId]
    }
  }
}
