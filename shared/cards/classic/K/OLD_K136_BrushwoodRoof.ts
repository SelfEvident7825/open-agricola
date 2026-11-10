import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K136_BrushwoodRoof'
const cardImpl = {
  modifiers: [
    {
      type: 'trade',
      cardId: CARD_ID,
      appliesTo: ['construct'],
      scope: 'unit',
      from: { wood: 1 },
      to: { reed: 1 },
      max: 2,
    },
    {
      type: 'trade',
      cardId: CARD_ID,
      appliesTo: ['renovation'],
      from: { wood: 1 },
      to: { reed: 1 },
      max: 2,
    },
  ],
} satisfies CardImpl

export const OLD_K136_BrushwoodRoof = defineMinorCard({
  meta: {
    id: 'OLD_K136_BrushwoodRoof',
    originalId: 'K136_BrushwoodRoof',
    gameEdition: 'classic',
    name: '木造屋顶',
    deck: 'K',
    number: 136,
    desc: ['每当你扩建/翻修时，对于每间房屋和每次翻修，你可以用至多2木代替等量的芦苇。'],
    cost: {},
    vp: 0,
    prerequisite: '2 Occupations',
    occupationPrerequisites: {
      min: 2,
    },
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K136.png',
    locales: {
      zh: {
        name: '木造屋顶',
        desc: ['每当你扩建/翻修时，对于每间房屋和每次翻修，你可以用至多2木代替等量的芦苇。'],
        prerequisite: '职业×2',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_K136_BrushwoodRoof_impl = OLD_K136_BrushwoodRoof.impl
