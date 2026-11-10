import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { queueFutureMeeplesFlow } from '../../../actions/effects/internal/future-meeples'

const CARD_ID = 'OLD_K108_Beehive'

const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state, player) => queueFutureMeeplesFlow(state, {
      cardId: CARD_ID,
      playerId: player.id,
      entries: [2, 4, 6, 8, 10, 12, 14].filter(round => round > state.round)
        .map(round => ({
          round,
          resources: { food: 1 },
        })),
    }),
  },
} satisfies CardImpl

export const OLD_K108_Beehive = defineMinorCard({
  meta: {
    id: 'OLD_K108_Beehive',
    originalId: 'K108_Beehive',
    gameEdition: 'classic',
    name: '蜂巢',
    deck: 'K',
    number: 108,
    desc: ['打出此卡时，在之后的偶数回合行动格上各放1份食物。这些回合开始时，你获得对应的食物。'],
    cost: {},
    vp: 1,
    prerequisite: '3 Occupations+发展卡×2',
    occupationPrerequisites: {
      min: 3,
    },
    improvementPrerequisites: {
      min: 2,
    },
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K108.png',
    locales: {
      zh: {
        name: '蜂巢',
        desc: [
          '打出此卡时，在之后的偶数回合行动格上各放1份食物。这些回合开始时，你获得对应的食物。',
        ],
        prerequisite: '职业×3+发展卡×2',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_K108_Beehive_impl = OLD_K108_Beehive.impl
