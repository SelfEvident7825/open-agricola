import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_I65_BakersKitchen'

const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: () => ({
      type: 'leaf',
      actionId: 'bake-bread',
      optional: true,
      sourceCard: CARD_ID,
    }),
  },
} satisfies CardImpl
export const OLD_I65_BakersKitchen = defineMinorCard({
  meta: {
    id: 'OLD_I65_BakersKitchen',
    originalId: 'I65_BakersKitchen',
    gameEdition: 'classic',
    name: '烘焙厨房',
    deck: 'I',
    number: 65,
    desc: [
      '打出此卡时，你获得1次“烤面包”行动。每次你执行“烤面包”行动时，你可以将至多2份小麦各转换成5份食物。',
    ],
    cost: {
      stone: 1,
    },
    vp: 4,
    prerequisite: '退还1个烤炉',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I65.png',
    locales: {
      zh: {
        name: '烘焙厨房',
        desc: [
          '打出此卡时，你获得1次“烤面包”行动。每次你执行“烤面包”行动时，你可以将至多2份小麦各转换成5份食物。',
        ],
        prerequisite: '退还1个烤炉',
      },
    },
    returnCards: [
      'Major_ClayOven',
      'Major_StoneOven',
      'OLD_E27_WoodredOven',
      'OLD_WA012_CastironOven',
      'OLD_G065_BeehiveOven',
      'OLD_G073_ErrantOven',
    ],
    isBaking: true,
    ovenIdentity: true,
    exchanges: [
      {
        from: {
          grain: 1,
        },
        to: {
          food: 5,
        },
        triggers: ['bake-bread'],
        max: 2,
      },
    ],
  },
  impl: cardImpl,
})
export const OLD_I65_BakersKitchen_impl = OLD_I65_BakersKitchen.impl
