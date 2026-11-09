import { defineOccupationCard } from '../../card-source'
import {
  queueFutureMeeples,
  futureMeeplesNode,
} from '../../../actions/effects/internal/future-meeples'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E187_ClayDeliveryman'
const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state, player) => {
      // Place 1 clay on each remaining space for rounds 6 to 14
      const absoluteRounds = [6, 7, 8, 9, 10, 11, 12, 13, 14]
      const entries = absoluteRounds
        .filter((r) => r > state.round)
        .map((round) => ({
          round,
          resources: { clay: 1 },
        }))
      if (entries.length === 0) return
      queueFutureMeeples(state, {
        cardId: CARD_ID,
        playerId: player.id,
        entries,
      })
      return futureMeeplesNode()
    },
  },
  reaches: [] as readonly string[],
} satisfies CardImpl
export const OLD_E187_ClayDeliveryman = defineOccupationCard({
  meta: {
    id: 'OLD_E187_ClayDeliveryman',
    name: '运土工',
    deck: 'E',
    number: 187,
    category: 'BUILDING_RESOURCE_PROVIDER',
    desc: [
      '在第6至14回合中尚未进行的回合行动格上各放置1个砖头。这些回合开始时，你获得对应的砖头。',
    ],
    cost: {},
    players: '3+',
    originalId: 'E187_ClayDeliveryman',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E187.png',
    locales: {
      zh: {
        name: '运土工',
        desc: [
          '在第6至14回合中尚未进行的回合行动格上各放置1个砖头。这些回合开始时，你获得对应的砖头。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E187_ClayDeliveryman_impl = OLD_E187_ClayDeliveryman.impl
