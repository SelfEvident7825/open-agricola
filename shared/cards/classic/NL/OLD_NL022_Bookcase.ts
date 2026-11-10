// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../../card-listeners'
import type { ActionHookPhase, ActionHookResult } from '../../../actions/hooks'
import { gainLeaf } from '../../helpers/pay-gain-node'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_NL022_Bookcase'
const listener: CardListenerRegistration = {
  id: 'OLD_NL022_Bookcase-bookcase-after-occupation',
  cardIds: [CARD_ID],
  phases: ['after' as ActionHookPhase],
  actions: ['occupation'],
  handler: (_context: CardListenerContext): ActionHookResult | void => {
    return { flow: gainLeaf(CARD_ID, { vegetable: 1 }), sourceCard: CARD_ID }
  },
}

const cardImpl = {
  listeners: [listener],
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_NL022_Bookcase = defineMinorCard({
  meta: {
    id: 'OLD_NL022_Bookcase',
    name: '书柜',
    deck: 'NL',
    number: 22,
    category: 'CROP_PROVIDER',
    desc: ['每当你打出1个职业后，你额外获得1份蔬菜如果通过职业打出此卡，可以获得此蔬菜。'],
    cost: {
      wood: 2,
    },
    prerequisite: '1 Occupations',
    occupationPrerequisites: {
      min: 1,
    },
    originalId: 'NL022_Bookcase',
    gameEdition: 'classic',
    vp: 0,
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/NL/NL022.png',
  },
  impl: cardImpl,
})

export const OLD_NL022_Bookcase_impl = OLD_NL022_Bookcase.impl
