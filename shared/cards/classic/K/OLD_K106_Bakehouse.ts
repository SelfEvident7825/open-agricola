import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K106_Bakehouse'

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

export const OLD_K106_Bakehouse = defineMinorCard({
  meta: {
    id: 'OLD_K106_Bakehouse',
    originalId: 'K106_Bakehouse',
    gameEdition: 'classic',
    name: '烘焙坊',
    deck: 'K',
    number: 106,
    desc: [
      '打出此卡时，你获得1次“烤面包”行动。每次你执行“烤面包”行动时，你可以将至多2份小麦各转换成5份食物。',
    ],
    cost: {
      stone: 3,
    },
    vp: 5,
    prerequisite: '退还1个烤炉',
    passing: false,
    extraVp: false,
    implemented: true,
    returnCards: ['Major_ClayOven', 'Major_StoneOven', 'OLD_E27_WoodredOven', 'OLD_WA012_CastironOven', 'OLD_G065_BeehiveOven', 'OLD_G073_ErrantOven'],
    isBaking: true,
    ovenIdentity: true,
    exchanges: [{ from: { grain: 1 }, to: { food: 5 }, triggers: ['bake-bread'], max: 2 }],
    artUrl: '/assets/classic/K/K106.png',
  },
  impl: cardImpl,
})

export const OLD_K106_Bakehouse_impl = OLD_K106_Bakehouse.impl
