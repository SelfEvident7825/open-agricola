import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { sumActionSpaceMovedToTriggerPlayer } from '../../helpers/event-provenance'
const CARD_ID = 'OLD_I80_Spinney'

const cardImpl = {
  listeners: [
    {
      id: CARD_ID + '-wood',
      cardIds: [CARD_ID],
      actionSpaces: ['forest'],
      phases: ['after'],
      scope: 'opponent',
      handler: (context) => {
        const owner = context.ownerPlayer
        if (
          !owner ||
          sumActionSpaceMovedToTriggerPlayer(context, 'wood') < 1 ||
          context.player.resources.wood < 1
        )
          return
        return {
          sourceCard: CARD_ID,
          flow: {
            type: 'leaf',
            actionId: 'gain',
            sourceCard: CARD_ID,
            params: {
              wood: 1,
              payerId: context.player.id,
              recipientPlayerId: owner.id,
            },
          },
        }
      },
    },
  ],
} satisfies CardImpl
export const OLD_I80_Spinney = defineMinorCard({
  meta: {
    id: 'OLD_I80_Spinney',
    originalId: 'I80_Spinney',
    gameEdition: 'classic',
    name: '灌木丛',
    deck: 'I',
    number: 80,
    desc: ['每当其他玩家使用森林[3木]行动格时，他必须给你1根木头。'],
    cost: {
      wood: 1,
    },
    vp: 1,
    prerequisite: '3 Occupations',
    occupationPrerequisites: {
      min: 3,
    },
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I80.png',
  },
  impl: cardImpl,
})
export const OLD_I80_Spinney_impl = OLD_I80_Spinney.impl
