import { defineMinorCard } from '../../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../../card-listeners'
import type { ActionHookPhase, ActionHookResult } from '../../../actions/hooks'
import type { ActionFlow } from '../../../contract/types'
import { computeAllowedPlacementSpaces } from '../../../actions/helpers/placement-availability'
import { isCardFlagged } from '../../helpers/card-state'
import { workersAvailable } from '../../../domain/player'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_I88_Lasso'
const MARKET_SPACES = ['sheep-market', 'pig-market', 'cattle-market']

const listener: CardListenerRegistration = {
  id: 'OLD_I88_Lasso-lasso-after-place-farmer',
  cardIds: [CARD_ID],
  phases: ['after' as ActionHookPhase],
  actions: ['place-farmer'],
  handler: (context: CardListenerContext): ActionHookResult | void => {
    if (isCardFlagged(context.player, CARD_ID)) return
    if (workersAvailable(context.state, context.player) <= 0) return
    const usedMarket = MARKET_SPACES.includes(context.space?.id ?? '')
    const allowed = computeAllowedPlacementSpaces(context.state, context.player, {
      actionHooks: context.actionHooks,
      sourceCard: CARD_ID,
    })
    const constraints = usedMarket
      ? allowed.map((placement) => placement.spaceId)
      : allowed
          .filter((placement) => MARKET_SPACES.includes(placement.spaceId))
          .map((placement) => placement.spaceId)
    if (constraints.length === 0) return
    const placeFarmer: Extract<ActionFlow, { type: 'leaf' }> = {
      type: 'leaf',
      actionId: 'place-farmer',
      sourceCard: CARD_ID,
      actionContext: { constraints },
    }
    return {
      flow: {
        type: 'seq',
        optional: true,
        children: [
          {
            type: 'leaf',
            actionId: 'special-effect',
            sourceCard: CARD_ID,
            params: { kind: 'set-flag', flag: true },
          },
          placeFarmer,
          {
            type: 'leaf',
            actionId: 'special-effect',
            sourceCard: CARD_ID,
            params: { kind: 'set-flag', flag: false },
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

export const OLD_I88_Lasso = defineMinorCard({
  meta: {
    id: 'OLD_I88_Lasso',
    name: '套索',
    deck: 'I',
    number: 88,
    category: 'ACTIONS_BOOSTER',
    desc: [
      '轮到你行动时，你可以连续派遣2名家庭成员，只要这2名家庭成员中至少有1人使用了羊市场/猪市场/牛市场积累行动格。',
    ],
    cost: {
      reed: 1,
    },
    originalId: 'I88_Lasso',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I88.png',
  },
  impl: cardImpl,
})

export const OLD_I88_Lasso_impl = OLD_I88_Lasso.impl
