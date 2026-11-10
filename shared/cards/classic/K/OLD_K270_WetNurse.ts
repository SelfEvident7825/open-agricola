import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { getRoomsBuiltThisAction } from '../../helpers/construction-events'
import { payLeaf } from '../../helpers/pay-gain-node'
import type { ActionDefinition } from '../../../contract/types'
import { familyGrowthAction } from '../../../actions/effects/family-growth'
import { registerAdHocAction } from '../../../actions/helpers/ad-hoc-action-registry'

const CARD_ID = 'OLD_K270_WetNurse'
const ACTION_ID = 'card_' + CARD_ID + '_grow'
const canGrow: NonNullable<ActionDefinition['canBeExecutedByPlayer']> = (state, player, context) =>
  player.resources.food >= 1 && Boolean(familyGrowthAction.canBeExecutedByPlayer?.(state, player, context))
registerAdHocAction({
  id: ACTION_ID,
  nameKey: 'actions.family-growth.name',
  descriptionKey: 'actions.family-growth.description',
  roundAvailable: 1,
  gainPerRound: {},
  canBeExecutedByPlayer: canGrow,
  execute: context => {
    if (!canGrow(context.state, context.player, context)) return { type: 'ok' }
    return {
      type: 'flow',
      flow: {
        type: 'seq',
        children: [
          payLeaf({ cardId: CARD_ID, cost: { food: 1 } }),
          { type: 'leaf', actionId: 'family-growth', sourceCard: CARD_ID, actionContext: context.actionContext },
        ],
      },
    }
  },
})

const cardImpl = {
  listeners: [{
    id: CARD_ID + '-new-rooms',
    cardIds: [CARD_ID],
    actions: ['construct'],
    phases: ['after'],
    handler: (context) => {
      const rooms = getRoomsBuiltThisAction(context, context.player.id)
      if (rooms <= 0) return
      return {
        sourceCard: CARD_ID,
        flow: {
          type: 'seq',
          children: Array.from({ length: rooms }, () => ({
            type: 'leaf' as const,
            actionId: ACTION_ID,
            optional: true,
            sourceCard: CARD_ID,
            actionContext: { placedWorkerId: context.actionContext?.placedWorkerId },
          })),
        },
      }
    },
  }],
} satisfies CardImpl

export const OLD_K270_WetNurse = defineOccupationCard({
  meta: {
    id: 'OLD_K270_WetNurse',
    originalId: 'K270_WetNurse',
    gameEdition: 'classic',
    name: '奶妈',
    deck: 'K',
    number: 270,
    desc: [
      '每当你扩建至少1间房间，对于每间新扩建的房间，你可以支付1份食物执行一次“生娃(需要空房间)”行动。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K270.png',
  },
  impl: cardImpl,
})
