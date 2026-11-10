import { defineMinorCard } from '../../card-source'
import { gainLeaf } from '../../helpers/pay-gain-node'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K143_StoneExchange'
const cardImpl = {
  effect: { id: CARD_ID, onBuy: () => gainLeaf(CARD_ID, { stone: 2 }) }
} satisfies CardImpl

export const OLD_K143_StoneExchange = defineMinorCard({
  meta: {
    altCosts: [{ wood: 2 }, { clay: 2 }],

    id: 'OLD_K143_StoneExchange',
    originalId: 'K143_StoneExchange',
    gameEdition: 'classic',
    name: '石头交易',
    deck: 'K',
    number: 143,
    desc: ['立即获得2个石头。使用后请将此卡交给下家，此卡将加入他的手牌。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    passing: true,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K143.png',
  },
  impl: cardImpl,
})
export const OLD_K143_StoneExchange_impl = OLD_K143_StoneExchange.impl
