import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { gainLeaf } from '../../helpers/pay-gain-node'
import { sumActionSpaceMovedToTriggerPlayer } from '../../helpers/event-provenance'

const CARD_ID = 'OLD_K290_ClayWorker'
const cardImpl = {
  listeners: [{
    id: CARD_ID + '-resources',
    cardIds: [CARD_ID],
    actions: ['collect', 'gain'],
    phases: ['after'],
    handler: context =>
      sumActionSpaceMovedToTriggerPlayer(context, 'wood') > 0 ||
      sumActionSpaceMovedToTriggerPlayer(context, 'clay') > 0
        ? { sourceCard: CARD_ID, flow: gainLeaf(CARD_ID, { clay: 1 }) }
        : undefined,
  }],
} satisfies CardImpl

export const OLD_K290_ClayWorker = defineOccupationCard({
  meta: {
    id: 'OLD_K290_ClayWorker',
    originalId: 'K290_ClayWorker',
    gameEdition: 'classic',
    name: '黏土工',
    deck: 'K',
    number: 290,
    desc: ['当你在行动格上获得木头或砖头时，你额外获得1块砖头。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K290.png',
  },
  impl: cardImpl,
})

export const OLD_K290_ClayWorker_impl = OLD_K290_ClayWorker.impl
