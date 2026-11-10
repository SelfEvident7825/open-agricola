import { defineMinorCard } from '../../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../../card-listeners'
import type { ActionHookResult } from '../../../actions/hooks'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K113_Flail'
const TRIGGER_SPACES = new Set(['farmland', 'cultivation'])

const listener: CardListenerRegistration = {
  id: 'OLD_K113_Flail-threshing-board-before-place-farmer',
  cardIds: [CARD_ID],
  phases: ['before'],
  actionSpaces: 'all',
  handler: (context: CardListenerContext): ActionHookResult | void => {
    if (!context.space || !TRIGGER_SPACES.has(context.space.id)) return
    return {
      flow: {
        type: 'leaf',
        actionId: 'bake-bread',
        optional: true,
        sourceCard: CARD_ID,
      },
      sourceCard: CARD_ID,
    }
  },
}

const cardImpl = {
  listeners: [listener],
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_K113_Flail = defineMinorCard({
  meta: {
    id: 'OLD_K113_Flail',
    name: '连枷',
    deck: 'K',
    number: 113,
    category: 'ACTIONS_BOOSTER',
    desc: ['每当你使用犁田/粮食耕种[犁播]行动格时，额外获得1次“烤面包”行动。'],
    cost: {
      wood: 1,
    },
    vp: 0,
    prerequisite: '1 Occupations',
    occupationPrerequisites: {
      min: 1,
    },
    originalId: 'K113_Flail',
    gameEdition: 'classic',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K113.png',
    locales: {
      zh: {
        name: '连枷',
        desc: ['每当你使用犁田/粮食耕种[犁播]行动格时，额外获得1次“烤面包”行动。'],
        prerequisite: '职业×1',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_K113_Flail_impl = OLD_K113_Flail.impl
