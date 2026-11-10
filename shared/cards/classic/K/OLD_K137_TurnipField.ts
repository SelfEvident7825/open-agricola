import { defineMinorCard } from '../../card-source'
import { makeCardFieldImpl } from '../../helpers/card-field'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K137_TurnipField'
const fieldImpl = makeCardFieldImpl(CARD_ID, { allowedCrops: ['vegetable'], capacity: 1 })
const cardImpl = {
  ...fieldImpl,
  effect: {
    ...fieldImpl.effect,
    id: CARD_ID,
    onBuy: () => ({ type: 'leaf', actionId: 'sow', optional: true, sourceCard: CARD_ID }),
  },
} satisfies CardImpl

export const OLD_K137_TurnipField = defineMinorCard({
  meta: {
    isField: true,
    cardField: { allowedCrops: ['vegetable'], capacity: 1 },

    id: 'OLD_K137_TurnipField',
    originalId: 'K137_TurnipField',
    gameEdition: 'classic',
    name: '萝卜地',
    deck: 'K',
    number: 137,
    desc: ['打出此卡时，你获得1次“播种”行动。此卡视为1块田地，但此卡只能种植蔬菜。'],
    cost: {},
    vp: 1,
    prerequisite: '3 Occupations',
    occupationPrerequisites: {
      min: 3,
    },
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K137.png',
  },
  presentation: { cardFields: true },
  impl: cardImpl,
})
export const OLD_K137_TurnipField_impl = OLD_K137_TurnipField.impl
