import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { gainLeaf } from '../../helpers/pay-gain-node'

const CARD_ID = 'OLD_K107_Lumber'

const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: () => gainLeaf(CARD_ID, { wood: 3 }),
  },
} satisfies CardImpl

export const OLD_K107_Lumber = defineMinorCard({
  meta: {
    id: 'OLD_K107_Lumber',
    originalId: 'K107_Lumber',
    gameEdition: 'classic',
    name: '木料',
    deck: 'K',
    number: 107,
    desc: ['立即获得3根木头。使用后请将此卡交给下家，此卡将加入他的手牌。'],
    cost: {
      stone: 1,
    },
    vp: 0,
    prerequisite: '1 Occupations',
    occupationPrerequisites: {
      min: 1,
    },
    passing: true,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K107.png',
    locales: {
      zh: {
        name: '木料',
        desc: ['立即获得3根木头。使用后请将此卡交给下家，此卡将加入他的手牌。'],
        prerequisite: '职业×1',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_K107_Lumber_impl = OLD_K107_Lumber.impl
