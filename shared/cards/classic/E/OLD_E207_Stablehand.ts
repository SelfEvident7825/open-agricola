import { defineOccupationCard } from '../../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../../card-listeners'
import type { ActionHookPhase, ActionHookResult } from '../../../actions/hooks'
import { readCardExtraData } from '../../helpers/card-state'
import { hasOrdinaryFenceBuiltEvent } from '../../helpers/fence-events'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E207_Stablehand'
const listener: CardListenerRegistration = {
  id: 'OLD_E207_Stablehand-stablehand-after-fencing',
  cardIds: [CARD_ID],
  phases: ['after' as ActionHookPhase],
  actions: ['fence'],
  handler: (context: CardListenerContext): ActionHookResult | void => {
    if (
      !hasOrdinaryFenceBuiltEvent(context) ||
      readCardExtraData(context.player, CARD_ID, 'usedRound') === context.state.round
    )
      return
    return {
      flow: {
        type: 'seq',
        optional: true,
        children: [
          {
            type: 'leaf',
            actionId: 'special-effect',
            sourceCard: CARD_ID,
            params: {
              kind: 'set-extra-data',
              key: 'usedRound',
              value: context.state.round,
            },
          },
          {
            type: 'leaf',
            actionId: 'stables',
            sourceCard: CARD_ID,
            actionContext: {
              max: 1,
              exactCost: { max: 1 },
              trueAction: false,
            },
          },
        ],
      },
      sourceCard: CARD_ID,
    }
  },
}
const cardImpl = {
  listeners: [listener],
  reaches: [] as readonly string[],
} satisfies CardImpl
export const OLD_E207_Stablehand = defineOccupationCard({
  meta: {
    id: 'OLD_E207_Stablehand',
    name: '马厩帮工',
    deck: 'E',
    number: 207,
    category: 'FARM_PLANNER',
    desc: ['每轮次限1次：每当你建造至少1根栅栏，你便可以免费建造1个马厩。'],
    cost: {},
    players: '4+',
    originalId: 'E207_Stablehand',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E207.png',
  },
  impl: cardImpl,
})
export const OLD_E207_Stablehand_impl = OLD_E207_Stablehand.impl
