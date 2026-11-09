import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { gainLeaf } from '../../helpers/pay-gain-node'
const CARD_ID = 'OLD_E41_Millstone'
const cardImpl = {
  listeners: [
    {
      id: CARD_ID + '-bake',
      cardIds: [CARD_ID],
      actions: ['bake-bread'],
      phases: ['after'],
      handler: () => ({
        sourceCard: CARD_ID,
        flow: gainLeaf(CARD_ID, { food: 2 }),
      }),
    },
  ],
} satisfies CardImpl
export const OLD_E41_Millstone = defineMinorCard({
  meta: {
    id: 'OLD_E41_Millstone',
    originalId: 'E41_Millstone',
    gameEdition: 'classic',
    name: '磨盘',
    deck: 'E',
    number: 41,
    desc: ['每次你执行“烤面包”行动时，额外获得2份食物。'],
    cost: {
      stone: 1,
    },
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E41.png',
    locales: {
      zh: {
        name: '磨盘',
        desc: ['每次你执行“烤面包”行动时，额外获得2份食物。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E41_Millstone_impl = OLD_E41_Millstone.impl
