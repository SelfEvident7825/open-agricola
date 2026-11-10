import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { gainLeaf } from '../../helpers/pay-gain-node'
const CARD_ID = 'OLD_E12_FishingRod'
const cardImpl = {
  listeners: [
    {
      id: CARD_ID + '-space',
      cardIds: [CARD_ID],
      actionSpaces: 'all',
      phases: ['before'],
      handler: (context) => {
        if (!(context.space?.id === 'fishing')) return
        return {
          flow: gainLeaf(CARD_ID, { food: context.state.round >= 8 ? 2 : 1 }),
          sourceCard: CARD_ID,
        }
      },
    },
  ],
} satisfies CardImpl
export const OLD_E12_FishingRod = defineMinorCard({
  meta: {
    id: 'OLD_E12_FishingRod',
    originalId: 'E12_FishingRod',
    gameEdition: 'classic',
    name: '鱼竿',
    deck: 'E',
    number: 12,
    desc: ['每当你使用钓鱼积累行动格时，额外获得1份食物。从第8回合起，改为额外获得2份食物。'],
    cost: {
      wood: 1,
    },
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E12.png',
  },
  impl: cardImpl,
})
export const OLD_E12_FishingRod_impl = OLD_E12_FishingRod.impl
