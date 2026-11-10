import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { sumActionSpaceMovedToTriggerPlayer } from '../../helpers/event-provenance'
import { payGainActionFlow } from '../../helpers/pay-gain-node'

const CARD_ID = 'OLD_K268_Pieceworker'
const cardImpl = {
  listeners: [{
    id: CARD_ID + '-piecework',
    cardIds: [CARD_ID],
    actionSpaces: 'all',
    phases: ['after'],
    handler: (context) => {
      const resources = (['wood', 'clay', 'reed', 'stone', 'grain', 'vegetable'] as const)
        .filter(resource => sumActionSpaceMovedToTriggerPlayer(context, resource) > 0)
      if (resources.length === 0) return
      return {
        sourceCard: CARD_ID,
        flow: {
          type: 'seq',
          children: resources.map(resource => ({
            ...payGainActionFlow({
              cardId: CARD_ID,
              cost: { food: resource === 'vegetable' ? 2 : 1 },
              gain: { [resource]: 1 },
            }),
            optional: true,
          })),
        },
      }
    },
  }],
} satisfies CardImpl

export const OLD_K268_Pieceworker = defineOccupationCard({
  meta: {
    id: 'OLD_K268_Pieceworker',
    originalId: 'K268_Pieceworker',
    gameEdition: 'classic',
    name: '计件工',
    deck: 'K',
    number: 268,
    desc: [
      '每当你从行动格上获得木/砖/芦苇/石头/小麦时，对于每种资源，你可以支付1份食物来额外获得1个对应资源。当你从行动格上获得蔬菜时，可以支付2份食物来额外获得1份蔬菜。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K268.png',
  },
  impl: cardImpl,
})
