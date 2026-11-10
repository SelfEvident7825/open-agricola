import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import type { CardListenerContext } from '../../card-listeners'
import type { ActionFlow } from '../../../contract/types'
import { improvementAction, readImprovementTypes } from '../../../actions/effects/improvement'
import { isUsedThisTurnOrGap, markUsedThisTurnOrGapLeaf } from '../../helpers/turn-token'

const CARD_ID = 'OLD_K281_TravelingSalesman'
const alternative = (context: CardListenerContext): ActionFlow | undefined => {
  if (context.trueAction === false || context.actionContext?.checkedReplaceAction || isUsedThisTurnOrGap(context.player, CARD_ID)) return
  const types = readImprovementTypes(context)
  if (!types.includes('minor')) return
  const nextTypes = types.includes('major') ? ['minor'] : ['major']
  const nextContext = { types: nextTypes, trueAction: false }
  if (!improvementAction.canBeExecutedByPlayer?.(context.state, context.player, { actionHooks: context.actionHooks, sourceCard: CARD_ID, actionContext: nextContext })) return
  const improvement: ActionFlow = { type: 'leaf', actionId: 'improvement', sourceCard: CARD_ID, actionContext: nextContext }
  return { type: 'seq', children: [
    markUsedThisTurnOrGapLeaf(context.player, CARD_ID), improvement,
    ...(types.includes('major') ? [{ ...improvement, optional: true } as ActionFlow] : []),
  ] }
}
const cardImpl = {
  listeners: [{
    id: CARD_ID + '-replace-improvement',
    cardIds: [CARD_ID],
    actions: ['improvement'],
    phases: ['computeReplace'],
    handler: context => {
      const flow = alternative(context)
      return flow ? { sourceCard: CARD_ID, decline: true, alternativeFlow: flow } : undefined
    },
  }, {
    id: CARD_ID + '-available-improvement',
    cardIds: [CARD_ID],
    actions: ['improvement'],
    phases: ['isDoable'],
    handler: context => alternative(context) ? { doable: true } : undefined,
  }],
} satisfies CardImpl

export const OLD_K281_TravelingSalesman = defineOccupationCard({
  meta: {
    id: 'OLD_K281_TravelingSalesman',
    originalId: 'K281_TravelingSalesman',
    gameEdition: 'classic',
    name: '流动商贩',
    deck: 'K',
    number: 281,
    desc: [
      '每轮次限1次：每当你执行“打次发”行动时，你可以改为打出1张主要发展卡。每当你执行“打主发或次发”行动时，可以改为打出2张次要发展卡。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K281.png',
    locales: {
      zh: {
        name: '流动商贩',
        desc: [
          '每轮次限1次：每当你执行“打次发”行动时，你可以改为打出1张主要发展卡。每当你执行“打主发或次发”行动时，可以改为打出2张次要发展卡。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
