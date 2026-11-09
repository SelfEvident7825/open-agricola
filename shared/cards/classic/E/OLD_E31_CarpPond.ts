import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import {
  queueFutureMeeples,
  futureMeeplesNode,
} from '../../../actions/effects/internal/future-meeples'
const CARD_ID = 'OLD_E31_CarpPond'
const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state, player) => {
      const entries = [1, 3, 5, 7, 9, 11, 13]
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
export const OLD_E31_CarpPond = defineMinorCard({
  meta: {
    id: 'OLD_E31_CarpPond',
    originalId: 'E31_CarpPond',
    gameEdition: 'classic',
    name: '鲤鱼池',
    deck: 'E',
    number: 31,
    desc: [
      '打出此卡时，在之后的每个奇数回合行动格上各放1份食物。这些回合开始时，你获得对应的食物。',
    ],
    cost: {},
    vp: 1,
    prerequisite: '1 Occupations+发展卡×2',
    occupationPrerequisites: {
      min: 1,
    },
    improvementPrerequisites: {
      min: 2,
    },
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E31.png',
    locales: {
      zh: {
        name: '鲤鱼池',
        desc: [
          '打出此卡时，在之后的每个奇数回合行动格上各放1份食物。这些回合开始时，你获得对应的食物。',
        ],
        prerequisite: '职业×1+发展卡×2',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E31_CarpPond_impl = OLD_E31_CarpPond.impl
