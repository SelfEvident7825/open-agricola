import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { sumActionSpaceMovedToTriggerPlayer } from '../../helpers/event-provenance'
import { gainLeaf } from '../../helpers/pay-gain-node'
const CARD_ID = 'OLD_I95_FishTrap'

const cardImpl = {
  listeners: [
    {
      id: CARD_ID + '-food',
      cardIds: [CARD_ID],
      actionSpaces: 'all',
      phases: ['after'],
      handler: (context) =>
        context.space.id === 'fishing' || sumActionSpaceMovedToTriggerPlayer(context, 'reed') > 0
          ? { sourceCard: CARD_ID, flow: gainLeaf(CARD_ID, { food: 1 }) }
          : undefined,
    },
  ],
} satisfies CardImpl
export const OLD_I95_FishTrap = defineMinorCard({
  meta: {
    id: 'OLD_I95_FishTrap',
    originalId: 'I95_FishTrap',
    gameEdition: 'classic',
    name: '鱼篓',
    deck: 'I',
    number: 95,
    desc: ['每当你使用钓鱼积累行动格或从行动格上获得芦苇时，额外获得1份食物。'],
    cost: {
      wood: 1,
    },
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I95.png',
    locales: {
      zh: {
        name: '鱼篓',
        desc: ['每当你使用钓鱼积累行动格或从行动格上获得芦苇时，额外获得1份食物。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_I95_FishTrap_impl = OLD_I95_FishTrap.impl
