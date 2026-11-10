import { defineMinorCard } from '../../card-source'
import { gainLeaf } from '../../helpers/pay-gain-node'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K141_BoarBreeding'
const cardImpl = {
  effect: { id: CARD_ID, onBuy: () => gainLeaf(CARD_ID, { boar: 1 }) }
} satisfies CardImpl

export const OLD_K141_BoarBreeding = defineMinorCard({
  meta: {
    id: 'OLD_K141_BoarBreeding',
    originalId: 'K141_BoarBreeding',
    gameEdition: 'classic',
    name: '野猪',
    deck: 'K',
    number: 141,
    desc: ['立即获得1头猪。使用后请将此卡交给下家，此卡将加入他的手牌。'],
    cost: {
      food: 1,
    },
    vp: 0,
    prerequisite: '',
    passing: true,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K141.png',
  },
  impl: cardImpl,
})
export const OLD_K141_BoarBreeding_impl = OLD_K141_BoarBreeding.impl
