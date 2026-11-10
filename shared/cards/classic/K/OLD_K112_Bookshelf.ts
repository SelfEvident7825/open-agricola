import { defineMinorCard } from '../../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../../card-listeners'
import { gainLeaf } from '../../helpers/pay-gain-node'
import type { CardImpl } from '../../registry'
import { getOccupationActionCost, isOccupationPlayable } from '../../../actions/effects/occupation'
import { PaymentSolver } from '../../../actions/payment'
import { getOccupation } from '../../registry-display'
import { meetsCardPrerequisites } from '../../helpers/prerequisites'

const CARD_ID = 'OLD_K112_Bookshelf'

const eligibleOccupations = (context: CardListenerContext) => {
  const allowed = context.params?.allowedCards
  return context.player.occupationHand.filter(id => {
    const occupation = getOccupation(id)
    return occupation && (!Array.isArray(allowed) || allowed.includes(id)) &&
      meetsCardPrerequisites(context.player, occupation, context.state.round, context.state)
  })
}

const canPlayWithBookshelf = (context: CardListenerContext) => {
  const player = {
    ...context.player,
    resources: { ...context.player.resources, food: context.player.resources.food + 3 },
  }
  const exactCost = PaymentSolver.readExactCost({ ...context.actionContext, ...context.params })
  const cost = exactCost ? PaymentSolver.resolveExactUnitCost(exactCost, 1)
    : getOccupationActionCost(player, context.space?.id ?? '')
  return eligibleOccupations(context).some(id => isOccupationPlayable(context.state, player, id, cost ?? undefined, context.sourceCard, context.actionHooks))
}
const beforeListener: CardListenerRegistration = {
  id: CARD_ID + '-before-occupation',
  cardIds: [CARD_ID],
  phases: ['before'],
  actions: ['occupation'],
  handler: context => canPlayWithBookshelf(context)
    ? { flow: gainLeaf(CARD_ID, { food: 3 }), sourceCard: CARD_ID } : undefined,
}
const isDoableListener: CardListenerRegistration = {
  id: CARD_ID + '-occupation-admission',
  cardIds: [CARD_ID],
  phases: ['isDoable'],
  actions: ['occupation'],
  handler: context => {
    if (eligibleOccupations(context).length === 0) return { doable: false }
    if (context.doable || context.actionContext?.skipBeforeTriggers === true) return
    return canPlayWithBookshelf(context) ? { doable: true } : undefined
  },
}
const cardImpl = {
  listeners: [beforeListener, isDoableListener],
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_K112_Bookshelf = defineMinorCard({
  meta: {
    id: 'OLD_K112_Bookshelf',
    name: '书架',
    deck: 'K',
    number: 112,
    category: 'FOOD_PROVIDER',
    desc: ['每当你打出1张职业卡前，首先获得3份食物。（在支付技能培训费之前）'],
    cost: {
      wood: 1,
    },
    vp: 1,
    prerequisite: '3 Occupations',
    occupationPrerequisites: {
      min: 3,
    },
    originalId: 'K112_Bookshelf',
    gameEdition: 'classic',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K112.png',
  },
  impl: cardImpl,
})

export const OLD_K112_Bookshelf_impl = OLD_K112_Bookshelf.impl
