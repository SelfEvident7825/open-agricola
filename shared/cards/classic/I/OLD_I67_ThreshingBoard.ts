import { defineMinorCard } from '../../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../../card-listeners'
import type { ActionHookResult } from '../../../actions/hooks'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_I67_ThreshingBoard'
const TRIGGER_SPACES = new Set(['farmland', 'cultivation'])

const listener: CardListenerRegistration = {
  id: 'OLD_I67_ThreshingBoard-threshing-board-before-place-farmer',
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

export const OLD_I67_ThreshingBoard = defineMinorCard({
  meta: {
    id: 'OLD_I67_ThreshingBoard',
    name: '打谷板',
    deck: 'I',
    number: 67,
    category: 'ACTIONS_BOOSTER',
    desc: ['每当你使用犁田/粮食耕种[犁播]行动格时，可以获得1次“烤面包”行动。'],
    cost: {
      wood: 2,
    },
    vp: 1,
    prerequisite: '2 Occupations',
    occupationPrerequisites: {
      min: 2,
    },
    originalId: 'I67_ThreshingBoard',
    gameEdition: 'classic',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I67.png',
    locales: {
      zh: {
        name: '打谷板',
        desc: ['每当你使用犁田/粮食耕种[犁播]行动格时，可以获得1次“烤面包”行动。'],
        prerequisite: '职业×2',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_I67_ThreshingBoard_impl = OLD_I67_ThreshingBoard.impl
