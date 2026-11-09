import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { gainLeaf } from '../../helpers/pay-gain-node'
const CARD_ID = 'OLD_E54_Quarry'
const cardImpl = {
  listeners: [
    {
      id: CARD_ID + '-space',
      cardIds: [CARD_ID],
      actionSpaces: 'all',
      phases: ['before'],
      handler: (context) => {
        if (!(context.space?.id === 'day-laborer')) return
        return {
          flow: gainLeaf(CARD_ID, { stone: 3 }),
          sourceCard: CARD_ID,
        }
      },
    },
  ],
} satisfies CardImpl
export const OLD_E54_Quarry = defineMinorCard({
  meta: {
    id: 'OLD_E54_Quarry',
    originalId: 'E54_Quarry',
    gameEdition: 'classic',
    name: '采石场',
    deck: 'E',
    number: 54,
    desc: ['每当你使用临时工行动格时，额外获得3个石头。'],
    cost: {},
    vp: 2,
    prerequisite: '4 Occupations',
    occupationPrerequisites: {
      min: 4,
    },
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E54.png',
    locales: {
      zh: {
        name: '采石场',
        desc: ['每当你使用临时工行动格时，额外获得3个石头。'],
        prerequisite: '职业×4',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E54_Quarry_impl = OLD_E54_Quarry.impl
