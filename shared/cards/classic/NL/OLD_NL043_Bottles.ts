// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
import { familySize } from '../../../domain/player'
import type { CardImpl } from '../../registry'

/**
 * B36 Bottles (Minor Improvement):
 * Worth 4 VP. Dynamic cost: for each person you have, pay 1 clay + 1 food.
 *
 * - getBaseCosts: clay = farmers, food = farmers
 * - vp: 4
 */

const cardImpl = {
  getBaseCosts: ({ player }) => {
    const farmers = familySize(player)
    return [{ clay: farmers, food: farmers }]
  },
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_NL043_Bottles = defineMinorCard({
  meta: {
    id: 'OLD_NL043_Bottles',
    name: '玻璃瓶',
    deck: 'NL',
    number: 43,
    category: 'POINTS_PROVIDER',
    desc: ['在打出此卡时，你每拥有1名家庭成员就需要支付1块砖头和1份食物'],
    cost: {},
    vp: 4,
    originalId: 'NL043_Bottles',
    gameEdition: 'classic',
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/NL/NL043.png',
    locales: {
      zh: {
        name: '玻璃瓶',
        desc: ['在打出此卡时，你每拥有1名家庭成员就需要支付1块砖头和1份食物'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_NL043_Bottles_impl = OLD_NL043_Bottles.impl
