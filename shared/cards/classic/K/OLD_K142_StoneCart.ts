// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
import {
  queueFutureMeeples,
  futureMeeplesNode,
} from '../../../actions/effects/internal/future-meeples'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K142_StoneCart'

const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state, player) => {
      const evenRounds = [2, 4, 6, 8, 10, 12, 14].filter((r) => r > state.round)
      if (evenRounds.length === 0) return
      queueFutureMeeples(state, {
        cardId: CARD_ID,
        playerId: player.id,
        entries: evenRounds.map((round) => ({ round, resources: { stone: 1 } })),
      })
      return futureMeeplesNode()
    },
  },
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_K142_StoneCart = defineMinorCard({
  meta: {
    id: 'OLD_K142_StoneCart',
    name: '石头推车',
    deck: 'K',
    number: 142,
    category: 'BUILDING_RESOURCE_PROVIDER',
    desc: ['打出此卡时，在之后的偶数回合行动格上各放1个石头。这些回合开始时，你获得对应的石头。'],
    cost: {
      wood: 2,
    },
    prerequisite: '2 Occupations',
    occupationPrerequisites: {
      min: 2,
    },
    originalId: 'K142_StoneCart',
    gameEdition: 'classic',
    vp: 0,
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K142.png',
    locales: {
      zh: {
        name: '石头推车',
        desc: [
          '打出此卡时，在之后的偶数回合行动格上各放1个石头。这些回合开始时，你获得对应的石头。',
        ],
        prerequisite: '职业×2',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_K142_StoneCart_impl = OLD_K142_StoneCart.impl
