import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { gainLeaf } from '../../helpers/pay-gain-node'
const CARD_ID = 'OLD_I64_Alms'

const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state) => (state.round > 1 ? gainLeaf(CARD_ID, { food: state.round - 1 }) : undefined),
  },
} satisfies CardImpl
export const OLD_I64_Alms = defineMinorCard({
  meta: {
    id: 'OLD_I64_Alms',
    originalId: 'I64_Alms',
    gameEdition: 'classic',
    name: '救济品',
    deck: 'I',
    number: 64,
    desc: ['立即获得与已过完整回合数相等的食物。使用后请将此卡交给下家，此卡将加入他的手牌。'],
    cost: {},
    vp: 0,
    prerequisite: '职业=0',
    occupationPrerequisites: {
      max: 0,
    },
    passing: true,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I64.png',
  },
  impl: cardImpl,
})
export const OLD_I64_Alms_impl = OLD_I64_Alms.impl
