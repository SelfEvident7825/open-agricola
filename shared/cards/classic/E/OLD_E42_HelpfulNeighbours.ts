import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { gainLeaf } from '../../helpers/pay-gain-node'
const CARD_ID = 'OLD_E42_HelpfulNeighbours'
const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: () => ({
      type: 'xor',
      children: [{ reed: 1 }, { stone: 1 }].map((resources) => gainLeaf(CARD_ID, resources)),
    }),
  },
} satisfies CardImpl
export const OLD_E42_HelpfulNeighbours = defineMinorCard({
  meta: {
    id: 'OLD_E42_HelpfulNeighbours',
    originalId: 'E42_HelpfulNeighbours',
    gameEdition: 'classic',
    name: '邻里互助',
    deck: 'E',
    number: 42,
    desc: ['立即获得1芦苇/1石头。使用后请将此卡交给下家，此卡将加入他的手牌。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    passing: true,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E42.png',
    locales: {
      zh: {
        name: '邻里互助',
        desc: ['立即获得1芦苇/1石头。使用后请将此卡交给下家，此卡将加入他的手牌。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E42_HelpfulNeighbours_impl = OLD_E42_HelpfulNeighbours.impl
