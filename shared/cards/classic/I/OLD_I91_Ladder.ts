import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { PaymentSolver } from '../../../actions/payment'
const CARD_ID = 'OLD_I91_Ladder'
const cardImpl = {
  reaches: [
    'OLD_E21_HalftimberedHouse',
    'OLD_I71_HolidayHouse',
    'OLD_I84_ChickenCoop',
    'OLD_I86_CornStorehouse',
    'OLD_I103_WaterMill',
    'OLD_K144_Mansion',
  ] as readonly string[],
  modifiers: [
    {
      type: 'trade',
      cardId: CARD_ID,
      appliesTo: ['construct'],
      scope: 'unit',
      from: {},
      to: { reed: 1 },
    },
    {
      type: 'bonus',
      cardId: CARD_ID,
      appliesTo: ['renovation'],
      discount: { reed: 1 },
      optional: false,
    },
  ],
  listeners: [
    {
      id: CARD_ID + '-cost',
      cardIds: [CARD_ID],
      actions: ['improvement'],
      phases: ['computeCosts'],
      deriveCardCostCandidate: (context, candidate) =>
        [
          'OLD_E21_HalftimberedHouse',
          'OLD_I71_HolidayHouse',
          'OLD_I84_ChickenCoop',
          'OLD_I86_CornStorehouse',
          'OLD_I103_WaterMill',
          'OLD_K144_Mansion',
        ].includes(context.cardId ?? '')
          ? PaymentSolver.discountCardCostCandidate(candidate, CARD_ID, {
              reed: 1,
            })
          : null,
    },
  ],
} satisfies CardImpl
export const OLD_I91_Ladder = defineMinorCard({
  meta: {
    id: 'OLD_I91_Ladder',
    originalId: 'I91_Ladder',
    gameEdition: 'classic',
    name: '梯子',
    deck: 'I',
    number: 91,
    desc: [
      '扩建每间房屋、翻修房屋和打出以下发展卡所需费用都减少1捆芦苇。E21半木梁房、I71度假屋、I84鸡舍、I86谷仓、I103水磨坊、K144豪宅。',
    ],
    cost: {
      wood: 2,
    },
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I91.png',
  },
  impl: cardImpl,
})
export const OLD_I91_Ladder_impl = OLD_I91_Ladder.impl
