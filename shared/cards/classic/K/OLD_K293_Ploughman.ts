import { defineOccupationCard } from '../../card-source'
import { queueFutureMeeplesFlow } from '../../../actions/effects/internal/future-meeples'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K293_Ploughman'

const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state, player) => {
      const offsets = [4, 7, 10]
      const targetRounds = offsets.map((offset) => state.round + offset).filter((r) => r <= 14)
      if (targetRounds.length === 0) return
      const entries = targetRounds.map((round) => ({
        round,
        resources: { field: 1 },
        actionContext: { exactCost: { food: 1 } },
      }))
      return queueFutureMeeplesFlow(state, {
        cardId: CARD_ID,
        playerId: player.id,
        entries,
      })
    },
  },
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_K293_Ploughman = defineOccupationCard({
  meta: {
    id: 'OLD_K293_Ploughman',
    name: '犁田工',
    deck: 'K',
    number: 293,
    category: 'FARM_PLANNER',
    desc: [
      '将当前回合数加4,7和10，在这些回合的行动格上各放置1块田地板块。在这些回合开始时，你可以支付1份食物来犁对应的田田地板块。',
    ],
    cost: {},
    players: '3+',
    originalId: 'K293_Ploughman',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K293.png',
    locales: {
      zh: {
        name: '犁田工',
        desc: [
          '将当前回合数加4,7和10，在这些回合的行动格上各放置1块田地板块。在这些回合开始时，你可以支付1份食物来犁对应的田田地板块。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_K293_Ploughman_impl = OLD_K293_Ploughman.impl
