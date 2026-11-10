import { defineOccupationCard } from '../../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../../card-listeners'
import type { ActionHookPhase, ActionHookResult } from '../../../actions/hooks'
import { gainLeaf } from '../../helpers/pay-gain-node'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E192_Patron'
const beforeListener: CardListenerRegistration = {
  id: 'OLD_E192_Patron-patron-before-occupation',
  cardIds: [CARD_ID],
  phases: ['before' as ActionHookPhase],
  actions: ['occupation'],
  handler: (_context: CardListenerContext): ActionHookResult | void => {
    return {
      flow: gainLeaf(CARD_ID, { food: 2 }),
      sourceCard: CARD_ID,
    }
  },
}
const isDoableListener: CardListenerRegistration = {
  id: 'OLD_E192_Patron-patron-isdoable-occupation',
  cardIds: [CARD_ID],
  phases: ['isDoable' as ActionHookPhase],
  actions: ['occupation'],
  handler: (context: CardListenerContext): ActionHookResult | void => {
    if (context.doable) return
    if (context.actionContext?.skipBeforeTriggers === true) return
    return { doable: true }
  },
}
const cardImpl = {
  listeners: [beforeListener, isDoableListener],
  reaches: [] as readonly string[],
} satisfies CardImpl
export const OLD_E192_Patron = defineOccupationCard({
  meta: {
    id: 'OLD_E192_Patron',
    name: '赞助商',
    deck: 'E',
    number: 192,
    category: 'ACTIONS_BOOSTER',
    desc: ['每当你打出1张职业卡前，你先获得2份食物。（在支付技能培训费之前）'],
    cost: {},
    players: '3+',
    originalId: 'E192_Patron',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E192.png',
  },
  impl: cardImpl,
})
export const OLD_E192_Patron_impl = OLD_E192_Patron.impl
