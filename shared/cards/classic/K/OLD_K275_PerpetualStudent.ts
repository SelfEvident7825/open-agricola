import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import type { CardListenerContext } from '../../card-listeners'
import type { ActionDefinition } from '../../../contract/types'
import { registerAdHocAction } from '../../../actions/helpers/ad-hoc-action-registry'
import { getOccupationActionCost } from '../../../actions/effects/occupation'
import { rollAndCacheCardPick } from '../../helpers/card-random'
import { gainLeaf } from '../../helpers/pay-gain-node'
import { getOccupation } from '../../registry-display'
const CARD_ID = 'OLD_K275_PerpetualStudent'
const ACTION = 'card_' + CARD_ID + '_draw'
const candidates = (context: CardListenerContext) => context.player.occupationHand.filter(id => getOccupation(id))
const eligible = (context: CardListenerContext) => !context.actionContext?.checkedReplaceAction
  && !Array.isArray(context.params?.allowedCards) && candidates(context).length > 0
const randomOccupation: ActionDefinition = {
  id: ACTION,
  nameKey: 'actions.occupation.name',
  descriptionKey: 'actions.lessons.description',
  roundAvailable: 1,
  gainPerRound: {},
  canBeExecutedByPlayer: (_state, player) => player.occupationHand.some(id => getOccupation(id)),
  execute: ({ state, player, params, reportProtectedObservation }) => {
    const hand = player.occupationHand.filter(id => getOccupation(id))
    if (!hand.length) return { type: 'fail', errorKey: 'log.occupationFail' }
    const key = typeof params?.rollKey === 'string' ? params.rollKey : 'pick-' + (state.rngTick ?? 0)
    const pick = rollAndCacheCardPick(state, player, CARD_ID, key, hand, reportProtectedObservation, 'player-private')
    state.pendingUndoBoundary = true
    return {
      type: 'flow',
      flow: {
        type: 'leaf',
        actionId: 'occupation',
        sourceCard: CARD_ID,
        params: { exactCost: params?.exactCost, allowedCards: [pick], foodShortfallToBegging: true },
      },
    }
  },
}
registerAdHocAction(randomOccupation)

const cardImpl = {
  listeners: [{
    id: CARD_ID + '-random-occupation',
    cardIds: [CARD_ID],
    actions: ['occupation'],
    phases: ['computeReplace'],
    handler: context => eligible(context) ? {
      sourceCard: CARD_ID,
      decline: true,
      alternativeFlow: {
        type: 'seq',
        children: [
          gainLeaf(CARD_ID, { food: 3 }),
          {
            type: 'leaf',
            actionId: ACTION,
            sourceCard: CARD_ID,
            params: {
              rollKey: 'pick-' + (context.state.rngTick ?? 0),
              exactCost: context.params?.exactCost ?? getOccupationActionCost(context.player, context.space?.id ?? ''),
            },
          },
        ],
      },
    } : undefined,
  }, {
    id: CARD_ID + '-random-affordable',
    cardIds: [CARD_ID],
    actions: ['occupation'],
    phases: ['isDoable'],
    handler: context => eligible(context) ? { doable: true } : undefined,
  }],
} satisfies CardImpl

export const OLD_K275_PerpetualStudent = defineOccupationCard({
  meta: {
    id: 'OLD_K275_PerpetualStudent',
    originalId: 'K275_PerpetualStudent',
    gameEdition: 'classic',
    name: '懒惰的学生',
    deck: 'K',
    number: 275,
    desc: [
      '每当你打出1张职业卡前，你可以获得3份食物，然后让一名其他玩家从你的手牌中随机选择一张职业牌，你必须打出此卡并支付相应的费用(如情圣)，你每缺少1份食物就获得1张乞讨卡。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K275.png',
    locales: {
      zh: {
        name: '懒惰的学生',
        desc: [
          '每当你打出1张职业卡前，你可以获得3份食物，然后让一名其他玩家从你的手牌中随机选择一张职业牌，你必须打出此卡并支付相应的费用(如情圣)，你每缺少1份食物就获得1张乞讨卡。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
