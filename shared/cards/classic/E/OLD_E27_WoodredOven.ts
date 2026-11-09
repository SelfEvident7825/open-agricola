import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E27_WoodredOven'
const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: () => ({
      type: 'leaf',
      actionId: 'bake-bread',
      sourceCard: CARD_ID,
      optional: true,
    }),
  },
} satisfies CardImpl
export const OLD_E27_WoodredOven = defineMinorCard({
  meta: {
    id: 'OLD_E27_WoodredOven',
    originalId: 'E27_WoodredOven',
    gameEdition: 'classic',
    name: '木造烤炉',
    deck: 'E',
    number: 27,
    desc: [
      '打出此卡时，你获得1次“烤面包”行动。每次你执行“烤面包”行动时，你可以将任意数量的小麦各转换成3份食物。',
    ],
    cost: {
      wood: 3,
      stone: 1,
    },
    vp: 2,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E27.png',
    locales: {
      zh: {
        name: '木造烤炉',
        desc: [
          '打出此卡时，你获得1次“烤面包”行动。每次你执行“烤面包”行动时，你可以将任意数量的小麦各转换成3份食物。',
        ],
        prerequisite: '',
      },
    },
    isBaking: true,
    ovenIdentity: true,
    exchanges: [
      {
        from: {
          grain: 1,
        },
        to: {
          food: 3,
        },
        triggers: ['bake-bread'],
      },
    ],
  },
  impl: cardImpl,
})
export const OLD_E27_WoodredOven_impl = OLD_E27_WoodredOven.impl
