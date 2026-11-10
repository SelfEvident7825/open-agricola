import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { getCardDefinition } from '../../catalog'
import { createEventQuery } from '../../../events/query'
import { gainLeaf } from '../../helpers/pay-gain-node'

const CARD_ID = 'OLD_E19_GypsysCrock'
const cardImpl = {
  listeners: [
    {
      id: CARD_ID + '-converted-goods',
      cardIds: [CARD_ID],
      actions: ['exchange', 'bake-bread'],
      phases: ['after'],
      handler: (context) => {
        const count = createEventQuery(context.actionEvents ?? [])
          .filter(
            'resource.exchanged',
            (event) =>
              (event.gained.food ?? 0) > 0 &&
              !!getCardDefinition(event.exchangeSource ?? '')?.isCookery,
          )
          .reduce(
            (sum, event) =>
              sum + Object.values(event.paid).reduce((n, amount) => n + (amount ?? 0), 0),
            0,
          )
        const food = Math.floor(count / 2)
        if (food > 0) return { sourceCard: CARD_ID, flow: gainLeaf(CARD_ID, { food }) }
      },
    },
  ],
} satisfies CardImpl

export const OLD_E19_GypsysCrock = defineMinorCard({
  meta: {
    id: 'OLD_E19_GypsysCrock',
    name: '三足锅',
    deck: 'E',
    number: 19,
    category: 'FOOD_PROVIDER',
    desc: [
      '每当你使用A1/A2火炉、A3/A4/E128壁炉、E20简易火炉、I85烹饪角将任意物品转化成食物时，每转化2个物品你就额外获得1份食物。',
    ],
    cost: {
      clay: 2,
    },
    vp: 1,
    originalId: 'E19_GypsysCrock',
    gameEdition: 'classic',
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E19.png',
  },
  impl: cardImpl,
})
export const OLD_E19_GypsysCrock_impl = OLD_E19_GypsysCrock.impl
