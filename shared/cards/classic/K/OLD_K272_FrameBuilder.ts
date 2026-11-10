import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K272_FrameBuilder'
const cardImpl: CardImpl = {
  modifiers: [
    {
      type: 'trade',
      cardId: CARD_ID,
      appliesTo: ['construct'],
      scope: 'unit',
      from: { wood: 1 },
      to: { clay: 2 },
      conditions: { roomMaterialClay: 1 },
    },
    {
      type: 'trade',
      cardId: CARD_ID,
      appliesTo: ['construct'],
      scope: 'unit',
      from: { wood: 1 },
      to: { stone: 2 },
      conditions: { roomMaterialStone: 1 },
    },
    {
      type: 'bonus',
      cardId: CARD_ID,
      appliesTo: ['renovation'],
      optional: true,
      choices: [
        { discount: { wood: -1, clay: 1 }, minCost: { clay: 1 }, sources: [CARD_ID] },
        { discount: { wood: -1, stone: 1 }, minCost: { stone: 1 }, sources: [CARD_ID] },
      ],
    },
  ],
}

export const OLD_K272_FrameBuilder = defineOccupationCard({
  meta: {
    id: 'OLD_K272_FrameBuilder',
    originalId: 'K272_FrameBuilder',
    gameEdition: 'classic',
    name: '架梁工',
    deck: 'K',
    number: 272,
    desc: [
      '每当你翻修房屋时，你可以用1根木头来代替恰好1块砖头或1块石头。每当你扩建房屋时，对于每间房屋，你可以用1根木头来代替恰好2块砖头或2块石头。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K272.png',
    locales: {
      zh: {
        name: '架梁工',
        desc: [
          '每当你翻修房屋时，你可以用1根木头来代替恰好1块砖头或1块石头。每当你扩建房屋时，对于每间房屋，你可以用1根木头来代替恰好2块砖头或2块石头。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
