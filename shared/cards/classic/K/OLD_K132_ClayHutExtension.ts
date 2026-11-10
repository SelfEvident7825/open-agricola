import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K132_ClayHutExtension'
const cardImpl = {
  prerequisiteCheck: player => player.houseType === 'clay',
  effect: {
    id: CARD_ID,
    onBuy: () => ({
      type: 'leaf',
      actionId: 'construct',
      optional: true,
      sourceCard: CARD_ID,
      actionContext: { max: 1, exactCost: { max: 1 }, targetFarmPolicy: 'own' },
    }),
  },
} satisfies CardImpl

export const OLD_K132_ClayHutExtension = defineMinorCard({
  meta: {
    id: 'OLD_K132_ClayHutExtension',
    originalId: 'K132_ClayHutExtension',
    gameEdition: 'classic',
    name: '扩建砖屋',
    deck: 'K',
    number: 132,
    desc: ['立即免费扩建1间砖屋。使用后请将此卡交给下家，此卡将加入他的手牌。'],
    cost: {
      reed: 1,
      clay: 4,
    },
    vp: 0,
    prerequisite: '',
    passing: true,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K132.png',
  },
  impl: cardImpl,
})
export const OLD_K132_ClayHutExtension_impl = OLD_K132_ClayHutExtension.impl
