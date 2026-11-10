import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { gainLeaf } from '../../helpers/pay-gain-node'
const CARD_ID = 'OLD_I104_WeeklyMarket'

const cardImpl = {
  effect: { id: CARD_ID, onBuy: () => gainLeaf(CARD_ID, { vegetable: 2 }) },
} satisfies CardImpl
export const OLD_I104_WeeklyMarket = defineMinorCard({
  meta: {
    id: 'OLD_I104_WeeklyMarket',
    originalId: 'I104_WeeklyMarket',
    gameEdition: 'classic',
    name: '周末市场',
    deck: 'I',
    number: 104,
    desc: ['立即获得2份蔬菜。使用后请将此卡交给下家，此卡将加入他的手牌。'],
    cost: {
      grain: 3,
    },
    vp: 0,
    prerequisite: '',
    passing: true,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I104.png',
  },
  impl: cardImpl,
})
export const OLD_I104_WeeklyMarket_impl = OLD_I104_WeeklyMarket.impl
