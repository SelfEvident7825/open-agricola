import { defineOccupationCard } from '../../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../../card-listeners'
import type { ActionHookPhase, ActionHookResult } from '../../../actions/hooks'
import type { GameState, PlayerState } from '../../../contract/types'
import { futureMeeplesNode } from '../../../actions/effects/internal/future-meeples'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_I231_Manservant'
/**
 * B107 Manservant
 * Once you live in a stone house, place 3 food on each remaining round space.
 * At the start of these rounds, you get the food.
 *
 * Rule: onBuy returns the same flow as the after-renovation listener; both
 * trigger only in a stone house.
 * Uses futureMeeplesNode with count = 14 (all remaining rounds).
 */

const placeFood = (state: GameState, player: PlayerState) => {
  if (player.houseType !== 'stone') return

  return futureMeeplesNode({
    cardId: CARD_ID,
    playerId: player.id,
    startRound: state.round + 1,
    count: 14,
    resources: { food: 3 },
  })
}

const listener: CardListenerRegistration = {
  id: 'OLD_I231_Manservant-manservant-after-renovation',
  cardIds: [CARD_ID],
  actions: ['renovate-house'],
  phases: ['after' as ActionHookPhase],
  handler: (context: CardListenerContext): ActionHookResult | void => {
    const flow = placeFood(context.state, context.player)
    if (!flow) return
    return { flow, sourceCard: CARD_ID }
  },
}

const cardImpl = {
  listeners: [listener],
  effect: {
    id: CARD_ID,
    onBuy: (state, player) => placeFood(state, player),
  },
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_I231_Manservant = defineOccupationCard({
  meta: {
    id: 'OLD_I231_Manservant',
    name: '男仆',
    deck: 'I',
    number: 231,
    category: 'FOOD_PROVIDER',
    desc: [
      '一旦你的房屋等级是石屋，在之后每回合的行动格上各放3份食物。这些回合开始时，你获得对应的食物。',
    ],
    cost: {},
    players: '1+',
    originalId: 'I231_Manservant',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I231.png',
    locales: {
      zh: {
        name: '男仆',
        desc: [
          '一旦你的房屋等级是石屋，在之后每回合的行动格上各放3份食物。这些回合开始时，你获得对应的食物。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_I231_Manservant_impl = OLD_I231_Manservant.impl
