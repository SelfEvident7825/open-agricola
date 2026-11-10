import { defineMinorCard } from '../../card-source'
import { queueFutureMeeplesFlow } from '../../../actions/effects/internal/future-meeples'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K114_DuckPond'

const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state, player) =>
      queueFutureMeeplesFlow(state, {
        cardId: CARD_ID,
        playerId: player.id,
        startRound: state.round + 1,
        count: 3,
        resources: { food: 1 },
      }),
  },
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_K114_DuckPond = defineMinorCard({
  meta: {
    id: 'OLD_K114_DuckPond',
    name: '鸭塘',
    deck: 'K',
    number: 114,
    category: 'FOOD_PROVIDER',
    desc: ['打出此卡时，在之后的3个回合行动格上各放1份食物。这些回合开始时，你获得对应的食物。'],
    cost: {},
    vp: 1,
    prerequisite: '2 Occupations',
    occupationPrerequisites: {
      min: 2,
    },
    originalId: 'K114_DuckPond',
    gameEdition: 'classic',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K114.png',
    locales: {
      zh: {
        name: '鸭塘',
        desc: [
          '打出此卡时，在之后的3个回合行动格上各放1份食物。这些回合开始时，你获得对应的食物。',
        ],
        prerequisite: '职业×2',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_K114_DuckPond_impl = OLD_K114_DuckPond.impl
