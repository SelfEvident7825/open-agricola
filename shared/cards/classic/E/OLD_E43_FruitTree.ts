import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import {
  queueFutureMeeples,
  futureMeeplesNode,
} from '../../../actions/effects/internal/future-meeples'
const CARD_ID = 'OLD_E43_FruitTree'
const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state, player) => {
      const entries = [8, 9, 10, 11, 12, 13, 14]
        .filter((round) => round > state.round && round <= 14)
        .map((round) => ({
          round,
          resources: { food: 1 },
        }))
      if (!entries.length) return
      queueFutureMeeples(state, {
        cardId: CARD_ID,
        playerId: player.id,
        entries,
      })
      return futureMeeplesNode()
    },
  },
} satisfies CardImpl
export const OLD_E43_FruitTree = defineMinorCard({
  meta: {
    id: 'OLD_E43_FruitTree',
    originalId: 'E43_FruitTree',
    gameEdition: 'classic',
    name: '果树',
    deck: 'E',
    number: 43,
    desc: [
      '打出此卡时，在之后的第8到第14回合行动格上各放1份食物。这些回合开始时，你获得对应的食物。',
    ],
    cost: {},
    vp: 1,
    prerequisite: '3 Occupations',
    occupationPrerequisites: {
      min: 3,
    },
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E43.png',
  },
  impl: cardImpl,
})
export const OLD_E43_FruitTree_impl = OLD_E43_FruitTree.impl
