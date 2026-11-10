import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { gainLeaf } from '../../helpers/pay-gain-node'
const CARD_ID = 'OLD_I96_ReedExchange'

const cardImpl = {
  effect: { id: CARD_ID, onBuy: () => gainLeaf(CARD_ID, { reed: 2 }) },
} satisfies CardImpl
export const OLD_I96_ReedExchange = defineMinorCard({
  meta: {
    id: 'OLD_I96_ReedExchange',
    originalId: 'I96_ReedExchange',
    gameEdition: 'classic',
    name: '芦苇交易',
    deck: 'I',
    number: 96,
    desc: ['立即获得2捆芦苇。使用后请将此卡交给下家，此卡将加入他的手牌。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    passing: true,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I96.png',
    altCosts: [
      {
        wood: 2,
      },
      {
        clay: 2,
      },
    ],
  },
  impl: cardImpl,
})
export const OLD_I96_ReedExchange_impl = OLD_I96_ReedExchange.impl
