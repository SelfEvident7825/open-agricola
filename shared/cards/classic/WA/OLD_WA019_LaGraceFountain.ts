// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
import {
  queueFutureMeeples,
  futureMeeplesNode,
} from '../../../actions/effects/internal/future-meeples'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_WA019_LaGraceFountain'

const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state, player) => {
      // Place 1 food on each of the next round spaces, up to the number of sheep you have
      const n = player.resources.sheep ?? 0
      if (n === 0) return
      const entries = Array.from({ length: n }, (_, i) => ({
        round: state.round + 1 + i,
        resources: { food: 1 },
      })).filter((e) => e.round <= 14)

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

export const OLD_WA019_LaGraceFountain = defineMinorCard({
  meta: {
    id: 'OLD_WA019_LaGraceFountain',
    name: '绵羊井',
    deck: 'WA',
    number: 19,
    category: 'FOOD_PROVIDER',
    desc: [
      '在之后的n个回合行动格上各放置1份食物，n=你的羊的数量。这些回合开始时，你获得对应的食物。',
    ],
    cost: {
      stone: 2,
    },
    vp: 2,
    originalId: 'WA019_LaGraceFountain',
    gameEdition: 'classic',
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/WA/WA019.png',
  },
  impl: cardImpl,
})

export const OLD_WA019_LaGraceFountain_impl = OLD_WA019_LaGraceFountain.impl
