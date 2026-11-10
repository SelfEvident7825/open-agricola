import { defineOccupationCard } from '../../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../../card-listeners'
import type { ActionHookPhase, ActionHookResult } from '../../../actions/hooks'
import { readImprovementTypes } from '../../../actions/effects/improvement'
import { payThenActionFlow } from '../../helpers/pay-gain-node'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E179_Merchant'
const immediatelyAfterListener: CardListenerRegistration = {
  id: 'OLD_E179_Merchant-merchant-immediately-after-improvement',
  cardIds: [CARD_ID],
  phases: ['immediatelyAfter' as ActionHookPhase],
  actions: ['improvement'],
  handler: (context: CardListenerContext): ActionHookResult | void => {
    if (context.sourceCard === CARD_ID) return
    if (context.trueAction === false) return
    const types = readImprovementTypes(context)
    const secondTypes = types.length === 1 && types[0] === 'minor' ? ['minor'] : undefined
    return payThenActionFlow({
      cardId: CARD_ID,
      cost: { food: 1 },
      promptKey: 'ui.interactionMerchantPrompt',
      action: {
        type: 'leaf',
        actionId: 'improvement',
        optional: true,
        promptKey: 'ui.interactionMerchantPrompt',
        sourceCard: CARD_ID,
        ...(secondTypes ? { actionContext: { types: secondTypes } } : {}),
      },
    })
  },
}
const cardImpl = {
  listeners: [immediatelyAfterListener],
  reaches: [] as readonly string[],
} satisfies CardImpl
export const OLD_E179_Merchant = defineOccupationCard({
  meta: {
    id: 'OLD_E179_Merchant',
    name: '商人',
    deck: 'E',
    number: 179,
    category: 'ACTIONS_BOOSTER',
    desc: ['每当你执行“打出主发或次发”或“打出次发”行动后，你可以支付1份食物来将该行动再执行一次。'],
    cost: {},
    players: '3+',
    originalId: 'E179_Merchant',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E179.png',
  },
  impl: cardImpl,
})
export const OLD_E179_Merchant_impl = OLD_E179_Merchant.impl
