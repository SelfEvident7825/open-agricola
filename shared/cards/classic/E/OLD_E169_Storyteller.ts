import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { returnToSpaceThenGainFlow } from '../../helpers/pay-gain-node'
import { isTravelingPlayersSpaceId } from '../../helpers/action-space-categories'
const CARD_ID = 'OLD_E169_Storyteller'
const cardImpl = {
  listeners: [
    {
      id: CARD_ID + '-return',
      cardIds: [CARD_ID],
      actionSpaces: 'all',
      phases: ['immediatelyAfter'],
      handler: (context) => {
        if (
          !context.space ||
          !isTravelingPlayersSpaceId(context.space.id) ||
          context.player.resources.food < 1
        )
          return
        return returnToSpaceThenGainFlow({
          cardId: CARD_ID,
          cost: { food: 1 },
          gain: { vegetable: 1 },
        })
      },
    },
  ],
} satisfies CardImpl
export const OLD_E169_Storyteller = defineOccupationCard({
  meta: {
    id: 'OLD_E169_Storyteller',
    originalId: 'E169_Storyteller',
    gameEdition: 'classic',
    name: '说书人',
    deck: 'E',
    number: 169,
    desc: ['每当你使用卖艺积累行动格时，你可以留下1份食物在卖艺积累行动格，并获得1份蔬菜。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E169.png',
  },
  impl: cardImpl,
})
export const OLD_E169_Storyteller_impl = OLD_E169_Storyteller.impl
