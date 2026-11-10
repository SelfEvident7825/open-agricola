import { defineMinorCard } from '../../card-source'

import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K128_CookingHearth'
const cardImpl = {} satisfies CardImpl
export const OLD_K128_CookingHearth = defineMinorCard({
  meta: {
    returnCards: ['Major_Fireplace1', 'Major_Fireplace2', 'OLD_E20_SimpleFireplace'],
    isCookery: true,
    isBaking: true,
    cookingHearthIdentity: true,
    exchanges: [
      { from: { vegetable: 1 }, to: { food: 3 }, triggers: ['anytime'] },
      { from: { sheep: 1 }, to: { food: 2 }, triggers: ['anytime'] },
      { from: { boar: 1 }, to: { food: 3 }, triggers: ['anytime'] },
      { from: { cattle: 1 }, to: { food: 4 }, triggers: ['anytime'] },
      { from: { grain: 1 }, to: { food: 3 }, triggers: ['bake-bread'] },
    ],

    id: CARD_ID,
    originalId: 'K128_CookingHearth',
    gameEdition: 'classic',
    name: '壁炉',
    deck: 'K',
    number: 128,
    desc: ['任意时刻：“烤面包”行动：火炉：A1/A2火炉、E20简易火炉'],
    cost: {},
    vp: 1,
    prerequisite: '退还火炉',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K128.png',
  },
  impl: cardImpl,
})
export const OLD_K128_CookingHearth_impl = OLD_K128_CookingHearth.impl
