// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../../card-listeners'
import type { ActionHookPhase, ActionHookResult } from '../../../actions/hooks'
import { gainLeaf } from '../../helpers/pay-gain-node'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K112_Bookshelf'
const beforeListener: CardListenerRegistration = {
  id: 'OLD_K112_Bookshelf-bookshelf-before-occupation',
  cardIds: [CARD_ID],
  phases: ['before' as ActionHookPhase],
  actions: ['occupation'],
  handler: (_context: CardListenerContext): ActionHookResult | void => {
    return { flow: gainLeaf(CARD_ID, { food: 3 }), sourceCard: CARD_ID }
  },
}

const isDoableListener: CardListenerRegistration = {
  id: 'OLD_K112_Bookshelf-bookshelf-isdoable-occupation',
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
    locales: {
      zh: {
        name: '书架',
        desc: ['每当你打出1张职业卡前，首先获得3份食物。（在支付技能培训费之前）'],
        prerequisite: '职业×3',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_K112_Bookshelf_impl = OLD_K112_Bookshelf.impl
