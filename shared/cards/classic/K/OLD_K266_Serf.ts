import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { gainLeaf, payGainActionFlow } from '../../helpers/pay-gain-node'

const CARD_ID = 'OLD_K266_Serf'
const cardImpl = {
  listeners: [{
    id: CARD_ID + '-before-sow-bake',
    cardIds: [CARD_ID],
    actionSpaces: ['grain-utilization'],
    phases: ['before'],
    handler: () => ({
      sourceCard: CARD_ID,
      flow: {
        type: 'xor',
        optional: true,
        children: [
          gainLeaf(CARD_ID, { grain: 1 }),
          payGainActionFlow({ cardId: CARD_ID, cost: { grain: 1 }, gain: { vegetable: 1 } }),
        ],
      },
    }),
  }],
} satisfies CardImpl

export const OLD_K266_Serf = defineOccupationCard({
  meta: {
    id: 'OLD_K266_Serf',
    originalId: 'K266_Serf',
    gameEdition: 'classic',
    name: '农奴',
    deck: 'K',
    number: 266,
    desc: ['每当你使用粮食耕种[播烤]行动格前，你可以获得1份小麦，或者把1份小麦换成1份蔬菜。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K266.png',
    locales: {
      zh: {
        name: '农奴',
        desc: ['每当你使用粮食耕种[播烤]行动格前，你可以获得1份小麦，或者把1份小麦换成1份蔬菜。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
