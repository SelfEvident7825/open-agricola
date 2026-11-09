import { defineOccupationCard } from '../../card-source'
import type { BonusModifier, TradeModifier } from '../../../contract/types'
import type { CardListenerRegistration } from '../../card-listeners'
import type { ActionHookPhase } from '../../../actions/hooks'
import type { CardImpl } from '../../registry'
import { PaymentSolver } from '../../../actions/payment'
const CARD_ID = 'OLD_E211_Stonecutter'
/**
 * A143 Stonecutter — Every improvement, room, and renovation costs you 1 stone less.
 *
 * Reference: onPlayerComputeCardCosts (improvements), onPlayerComputeCostsConstruct,
 * onPlayerComputeCostsRenovation.
 *
 * For construct and renovation we use the modifier system.
 * For improvements (majors/minors) we append sourced card-purchase cost candidates.
 */
const improvementCostListener: CardListenerRegistration = {
  id: 'OLD_E211_Stonecutter-stonecutter-costs-improvement',
  cardIds: [CARD_ID],
  phases: ['computeCosts' as ActionHookPhase],
  actions: ['improvement'],
  deriveCardCostCandidate: (_context, candidate) =>
    PaymentSolver.discountCardCostCandidate(candidate, CARD_ID, { stone: 1 }),
}
const cardImpl = {
  listeners: [improvementCostListener],
  modifiers: [
    {
      type: 'trade',
      cardId: CARD_ID,
      appliesTo: ['construct'],
      from: {},
      to: { stone: 1 },
      scope: 'unit',
    },
    {
      type: 'bonus',
      cardId: CARD_ID,
      appliesTo: ['renovation'],
      discount: { stone: 1 },
      optional: false,
    },
  ] as (TradeModifier | BonusModifier)[],
  reaches: [] as readonly string[],
} satisfies CardImpl
export const OLD_E211_Stonecutter = defineOccupationCard({
  meta: {
    id: 'OLD_E211_Stonecutter',
    name: '切石工',
    deck: 'E',
    number: 211,
    category: 'BUILDING_RESOURCE_PROVIDER',
    desc: ['打发展卡、建造房屋和翻修房屋所需的石头费用于你而言总是减少1。'],
    cost: {},
    players: '4+',
    originalId: 'E211_Stonecutter',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E211.png',
    locales: {
      zh: {
        name: '切石工',
        desc: ['打发展卡、建造房屋和翻修房屋所需的石头费用于你而言总是减少1。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E211_Stonecutter_impl = OLD_E211_Stonecutter.impl
