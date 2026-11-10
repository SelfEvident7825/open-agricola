import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { gainLeaf } from '../../helpers/pay-gain-node'
import { createEventQuery } from '../../../events/query'
import { isTravelingPlayersSpaceId } from '../../helpers/action-space-categories'
const CARD_ID = 'OLD_E212_Dancer'
const cardImpl = {
  listeners: [
    {
      id: CARD_ID + '-minimum',
      cardIds: [CARD_ID],
      actionSpaces: 'all',
      phases: ['after'],
      handler: (context) => {
        if (!context.space || !isTravelingPlayersSpaceId(context.space.id)) return
        let net = 0
        for (const e of createEventQuery(context.actionEvents ?? []).filter('resource.moved')) {
          if (
            e.from.kind === 'actionSpace' &&
            e.from.spaceId === context.space.id &&
            e.to.kind === 'player' &&
            e.to.playerId === context.player.id
          )
            net += e.resources.food ?? 0
          if (
            e.to.kind === 'actionSpace' &&
            e.to.spaceId === context.space.id &&
            e.from.kind === 'player' &&
            e.from.playerId === context.player.id
          )
            net -= e.resources.food ?? 0
        }
        net -=
          context.state.actionSpaces.find((s) => s.id === context.space?.id)?.resources.food ?? 0
        if (net < 4)
          return {
            sourceCard: CARD_ID,
            flow: gainLeaf(CARD_ID, { food: 4 - Math.max(0, net) }),
          }
      },
    },
  ],
} satisfies CardImpl
export const OLD_E212_Dancer = defineOccupationCard({
  meta: {
    id: 'OLD_E212_Dancer',
    originalId: 'E212_Dancer',
    gameEdition: 'classic',
    name: '舞者',
    deck: 'E',
    number: 212,
    desc: [
      '每当你使用卖艺积累行动格时，你获得至少4份食物。如果你需要在卖艺格上留下食物，则留下食物后仍获得4份食物。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '4+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E212.png',
  },
  impl: cardImpl,
})
export const OLD_E212_Dancer_impl = OLD_E212_Dancer.impl
