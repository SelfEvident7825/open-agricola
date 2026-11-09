import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { gainLeaf } from '../../helpers/pay-gain-node'
const CARD_ID = 'OLD_I74_GrainCart'

const cardImpl = {
  listeners: [
    {
      id: CARD_ID + '-grain',
      cardIds: [CARD_ID],
      actionSpaces: ['grain-seeds'],
      phases: ['after'],
      handler: () => ({
        sourceCard: CARD_ID,
        flow: gainLeaf(CARD_ID, { grain: 2 }),
      }),
    },
  ],
} satisfies CardImpl
export const OLD_I74_GrainCart = defineMinorCard({
  meta: {
    id: 'OLD_I74_GrainCart',
    originalId: 'I74_GrainCart',
    gameEdition: 'classic',
    name: '小麦推车',
    deck: 'I',
    number: 74,
    desc: ['每当你使用小麦种子行动格时，额外获得2份小麦。'],
    cost: {
      wood: 2,
    },
    vp: 0,
    prerequisite: '2 Occupations',
    occupationPrerequisites: {
      min: 2,
    },
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I74.png',
    locales: {
      zh: {
        name: '小麦推车',
        desc: ['每当你使用小麦种子行动格时，额外获得2份小麦。'],
        prerequisite: '职业×2',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_I74_GrainCart_impl = OLD_I74_GrainCart.impl
