import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { sumActionSpaceMovedToTriggerPlayer } from '../../helpers/event-provenance'
import { gainLeaf } from '../../helpers/pay-gain-node'

const CARD_ID = 'OLD_K126_LandingNet'

const cardImpl = {
  listeners: [
    {
      id: CARD_ID + '-reed-food',
      cardIds: [CARD_ID],
      actionSpaces: 'all',
      phases: ['after'],
      handler: context => {
        if (sumActionSpaceMovedToTriggerPlayer(context, 'reed') <= 0) return
        const mixed = (['wood', 'clay', 'stone'] as const).some(resource => sumActionSpaceMovedToTriggerPlayer(context, resource) > 0)
        return { sourceCard: CARD_ID, flow: gainLeaf(CARD_ID, { food: mixed ? 1 : 2 }) }
      },
    },
  ],
} satisfies CardImpl

export const OLD_K126_LandingNet = defineMinorCard({
  meta: {
    id: 'OLD_K126_LandingNet',
    originalId: 'K126_LandingNet',
    gameEdition: 'classic',
    name: '手网',
    deck: 'K',
    number: 126,
    desc: [
      '每当你从行动格上获得芦苇时，额外获得2份食物。如果你从行动格上同时获得了其他建筑资源，则改为获得1份食物。',
    ],
    cost: {
      reed: 1,
    },
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K126.png',
  },
  impl: cardImpl,
})

export const OLD_K126_LandingNet_impl = OLD_K126_LandingNet.impl
