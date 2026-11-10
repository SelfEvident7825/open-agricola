import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import type { BonusModifier, TradeModifier } from '../../../contract/types'

const CARD_ID = 'OLD_K294_BrushwoodCollector'
const cardImpl = {
  modifiers: [
    {
      type: 'trade',
      cardId: CARD_ID,
      appliesTo: ['construct'],
      // Apply the replacement separately to each room's reed cost.
      scope: 'unit',
      replaceUpTo: true,
      from: { wood: 1 },
      to: { reed: 2 },
    },
    {
      type: 'bonus',
      cardId: CARD_ID,
      appliesTo: ['renovation'],
      optional: true,
      choices: [
        { discount: { reed: 1, wood: -1 }, sources: [CARD_ID], minCost: { reed: 1 }, maxCost: { reed: 1 } },
        { discount: { reed: 2, wood: -1 }, sources: [CARD_ID], minCost: { reed: 2 }, maxCost: { reed: 2 } },
      ],
    },
  ] as (TradeModifier | BonusModifier)[],
} satisfies CardImpl

export const OLD_K294_BrushwoodCollector = defineOccupationCard({
  meta: {
    id: 'OLD_K294_BrushwoodCollector',
    name: '拾柴者',
    deck: 'K',
    number: 294,
    category: 'BUILDING_RESOURCE_PROVIDER',
    desc: ['在每次翻修/扩建每间房屋时，你可以用1根木头来代替所需的1捆/2捆芦苇。'],
    cost: {},
    players: '3+',
    originalId: 'K294_BrushwoodCollector',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K294.png',
  },
  impl: cardImpl,
})

export const OLD_K294_BrushwoodCollector_impl = OLD_K294_BrushwoodCollector.impl
