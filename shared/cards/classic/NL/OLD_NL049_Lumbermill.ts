// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
import type { CardListenerRegistration } from '../../card-listeners'
import type { ActionHookPhase } from '../../../actions/hooks'
import type { CardImpl } from '../../registry'
import { PaymentSolver } from '../../../actions/payment'

const CARD_ID = 'OLD_NL049_Lumbermill'
/**
 * A75 Lumber Mill — Every improvement costs you 1 wood less.
 * Rule: onPlayerComputeCardCosts, applies to MAJOR and MINOR types.
 */
const computeCostsListener: CardListenerRegistration = {
  id: 'OLD_NL049_Lumbermill-lumber-mill-compute-costs',
  cardIds: [CARD_ID],
  phases: ['computeCosts' as ActionHookPhase],
  actions: ['improvement'],
  deriveCardCostCandidate: (_context, candidate) =>
    PaymentSolver.discountCardCostCandidate(candidate, CARD_ID, { wood: 1 }),
}

const cardImpl = {
  listeners: [computeCostsListener],
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_NL049_Lumbermill = defineMinorCard({
  meta: {
    id: 'OLD_NL049_Lumbermill',
    name: '锯木厂',
    deck: 'NL',
    number: 49,
    category: 'BUILDING_RESOURCE_PROVIDER',
    desc: ['每张发展卡所需的木头花费于你而言都减少1'],
    cost: {
      stone: 2,
    },
    vp: 2,
    prerequisite: '',
    originalId: 'NL049_Lumbermill',
    gameEdition: 'classic',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/NL/NL049.png',
    locales: {
      zh: {
        name: '锯木厂',
        desc: ['每张发展卡所需的木头花费于你而言都减少1'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_NL049_Lumbermill_impl = OLD_NL049_Lumbermill.impl
