import { defineMinorCard } from '../../card-source'
import { gainLeaf } from '../../helpers/pay-gain-node'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K129_CornSheaf'
const cardImpl = {
  effect: { id: CARD_ID, onBuy: () => gainLeaf(CARD_ID, { grain: 1 }) }
} satisfies CardImpl

export const OLD_K129_CornSheaf = defineMinorCard({
  meta: {
    id: 'OLD_K129_CornSheaf',
    originalId: 'K129_CornSheaf',
    gameEdition: 'classic',
    name: '一捆小麦',
    deck: 'K',
    number: 129,
    desc: ['立即获得1份小麦。使用后请将此卡交给下家，此卡将加入他的手牌。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    passing: true,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K129.png',
    locales: {
      zh: {
        name: '一捆小麦',
        desc: ['立即获得1份小麦。使用后请将此卡交给下家，此卡将加入他的手牌。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_K129_CornSheaf_impl = OLD_K129_CornSheaf.impl
