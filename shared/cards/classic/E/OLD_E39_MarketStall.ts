import { defineMinorCard } from '../../card-source'
import { gainLeaf } from '../../helpers/pay-gain-node'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E39_MarketStall'
const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (_state, _player) => gainLeaf(CARD_ID, { vegetable: 1 }),
  },
  reaches: [] as readonly string[],
} satisfies CardImpl
export const OLD_E39_MarketStall = defineMinorCard({
  meta: {
    id: 'OLD_E39_MarketStall',
    name: '货摊',
    deck: 'E',
    number: 39,
    category: 'CROP_PROVIDER',
    desc: ['立即获得1份蔬菜。使用后请将此卡交给下家，此卡将加入他的手牌。'],
    cost: {
      grain: 1,
    },
    passing: true,
    originalId: 'E39_MarketStall',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E39.png',
  },
  impl: cardImpl,
})
export const OLD_E39_MarketStall_impl = OLD_E39_MarketStall.impl
