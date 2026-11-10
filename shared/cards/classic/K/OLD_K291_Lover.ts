import { hasFamilyGrowthCandidate } from '../../../domain/player'
import { readActionSnapshotExtraData } from '../../helpers/action-snapshot'
import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { individualFoodCostRequest } from '../../../actions/helpers/individual-food-cost'

const CARD_ID = 'OLD_K291_Lover'
const cardImpl = {
  listeners: [{
    id: CARD_ID + '-growth-admission',
    cardIds: [CARD_ID],
    zones: ['hand'],
    actions: ['occupation'],
    phases: ['isDoable'],
    handler: context => {
      if (context.choice !== CARD_ID) return
      const actionContext = context.actionContext
      const actor = actionContext?.viaCardJump === true ? actionContext.workerId : actionContext?.placedWorkerId
      const workerId = typeof actor === 'string' ? actor
        : readActionSnapshotExtraData<string>(context.player, 'placedWorkerId')
      return { doable: hasFamilyGrowthCandidate(context.player, workerId) }
    },
  }],
  effect: {
    id: CARD_ID,
    onBuy: () => ({
      type: 'seq',
      children: [
        { type: 'leaf', actionId: 'individual-food-cost', sourceCard: CARD_ID, params: { food: 4 } },
        { type: 'leaf', actionId: 'family-growth', sourceCard: CARD_ID, actionContext: { skipRoomCheck: true } },
      ],
    }),
    projectInteractionRequest: (_state, player, request, actionId) =>
      actionId === 'individual-food-cost' && request.kind === 'choice'
        ? individualFoodCostRequest(player, 4)
        : request,
  },
} satisfies CardImpl

export const OLD_K291_Lover = defineOccupationCard({
  meta: {
    id: 'OLD_K291_Lover',
    originalId: 'K291_Lover',
    gameEdition: 'classic',
    name: '情圣',
    deck: 'K',
    number: 291,
    desc: ['打出此卡时，必须立即支付4份食物来执行一次“生娃（无需空房间）”行动。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K291.png',
  },
  impl: cardImpl,
})

export const OLD_K291_Lover_impl = OLD_K291_Lover.impl
