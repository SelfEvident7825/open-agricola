import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E36_ClayRoof'
const cardImpl = {
  modifiers: [
    {
      type: 'trade',
      cardId: CARD_ID,
      appliesTo: ['construct'],
      scope: 'unit',
      from: { clay: 1 },
      to: { reed: 1 },
      max: 2,
    },
    {
      type: 'trade',
      cardId: CARD_ID,
      appliesTo: ['renovation'],
      from: { clay: 1 },
      to: { reed: 1 },
      max: 2,
    },
  ],
} satisfies CardImpl
export const OLD_E36_ClayRoof = defineMinorCard({
  meta: {
    id: 'OLD_E36_ClayRoof',
    originalId: 'E36_ClayRoof',
    gameEdition: 'classic',
    name: '砖造屋顶',
    deck: 'E',
    number: 36,
    desc: ['每当你扩建/翻修时，对于每间房屋和每次翻修，你可以用至多2砖代替等量的芦苇。'],
    cost: {},
    vp: 1,
    prerequisite: '1 Occupations',
    occupationPrerequisites: {
      min: 1,
    },
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E36.png',
    locales: {
      zh: {
        name: '砖造屋顶',
        desc: ['每当你扩建/翻修时，对于每间房屋和每次翻修，你可以用至多2砖代替等量的芦苇。'],
        prerequisite: '职业×1',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E36_ClayRoof_impl = OLD_E36_ClayRoof.impl
