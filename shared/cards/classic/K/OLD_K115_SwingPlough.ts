// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../../card-listeners'
import type { ActionHookResult } from '../../../actions/hooks'
import { getCardStack, pushToCardStack } from '../../helpers/card-state'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K115_SwingPlough'
const listener: CardListenerRegistration = {
  id: 'OLD_K115_SwingPlough-swing-plow-before-place-farmer',
  cardIds: [CARD_ID],
  phases: ['before'],
  actionSpaces: 'all',
  handler: (context: CardListenerContext): ActionHookResult | void => {
    if (context.space?.id !== 'farmland') return
    const stack = getCardStack(context.player, CARD_ID)
    if (stack.length === 0) return

    if (stack.length >= 2) {
      // 2+ fields remaining — offer up to 2 plows (nested optional)
      return {
        flow: {
          type: 'seq',
          optional: true,
          children: [
            { type: 'leaf', actionId: 'pop-card-stack', sourceCard: CARD_ID },
            { type: 'leaf', actionId: 'plow', sourceCard: CARD_ID },
            {
              type: 'seq',
              optional: true,
              children: [
                { type: 'leaf', actionId: 'pop-card-stack', sourceCard: CARD_ID },
                { type: 'leaf', actionId: 'plow', sourceCard: CARD_ID },
              ],
            },
          ],
        },
        sourceCard: CARD_ID,
      }
    } else {
      // Only 1 field left — offer 1 plow
      return {
        flow: {
          type: 'seq',
          optional: true,
          children: [
            { type: 'leaf', actionId: 'pop-card-stack', sourceCard: CARD_ID },
            { type: 'leaf', actionId: 'plow', sourceCard: CARD_ID },
          ],
        },
        sourceCard: CARD_ID,
      }
    }
  },
}

const cardImpl = {
  listeners: [listener],
  effect: {
    id: CARD_ID,
    onBuy: (_state, player) => {
      pushToCardStack(player, CARD_ID, ['field', 'field', 'field', 'field'])
    },
  },
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_K115_SwingPlough = defineMinorCard({
  meta: {
    id: 'OLD_K115_SwingPlough',
    name: '摆杆步犁',
    deck: 'K',
    number: 115,
    category: 'FARM_PLANNER',
    desc: [
      '在此卡上放4个田地板块。限2次：每当你使用犁田行动格时，你可以使用此卡上2块田，改为犁3块田。每次使用犁田/粮食耕种[犁播]行动格时，只能使用1个犁/I68耙的效果。',
    ],
    cost: {
      wood: 3,
    },
    prerequisite: '3 Occupations',
    occupationPrerequisites: {
      min: 3,
    },
    originalId: 'K115_SwingPlough',
    gameEdition: 'classic',
    vp: 0,
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K115.png',
    locales: {
      zh: {
        name: '摆杆步犁',
        desc: [
          '在此卡上放4个田地板块。限2次：每当你使用犁田行动格时，你可以使用此卡上2块田，改为犁3块田。每次使用犁田/粮食耕种[犁播]行动格时，只能使用1个犁/I68耙的效果。',
        ],
        prerequisite: '职业×3',
      },
    },
  },
  presentation: { stack: true },
  impl: cardImpl,
})

export const OLD_K115_SwingPlough_impl = OLD_K115_SwingPlough.impl
