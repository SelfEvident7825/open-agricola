import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_I81_WoodenHutExtension'

const cardImpl = {
  prerequisiteCheck: (player) => player.houseType === 'wood',
  effect: {
    id: CARD_ID,
    onBuy: () => ({
      type: 'leaf',
      actionId: 'construct',
      sourceCard: CARD_ID,
      actionContext: { max: 1, exactCost: { max: 1 } },
    }),
  },
} satisfies CardImpl
export const OLD_I81_WoodenHutExtension = defineMinorCard({
  meta: {
    id: 'OLD_I81_WoodenHutExtension',
    originalId: 'I81_WoodenHutExtension',
    gameEdition: 'classic',
    name: '扩建木屋',
    deck: 'I',
    number: 81,
    desc: ['立即免费扩建1间木屋。使用后请将此卡交给下家，此卡将加入他的手牌。'],
    cost: {
      wood: 1,
    },
    vp: 0,
    prerequisite: '',
    passing: true,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I81.png',
    locales: {
      zh: {
        name: '扩建木屋',
        desc: ['立即免费扩建1间木屋。使用后请将此卡交给下家，此卡将加入他的手牌。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_I81_WoodenHutExtension_impl = OLD_I81_WoodenHutExtension.impl
