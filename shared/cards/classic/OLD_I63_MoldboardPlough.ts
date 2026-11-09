// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../card-listeners'
import type { ActionHookResult } from '../../actions/hooks'
import { getCardStack, pushToCardStack } from '../helpers/card-state'
import type { CardImpl } from '../registry'

const CARD_ID = 'OLD_I63_MoldboardPlough'
const listener: CardListenerRegistration = {
  id: 'OLD_I63_MoldboardPlough-moldboard-plow-before-place-farmer',
  cardIds: [CARD_ID],
  phases: ['before'],
  actionSpaces: 'all',
  handler: (context: CardListenerContext): ActionHookResult | void => {
    if (context.space?.id !== 'farmland') return
    const stack = getCardStack(context.player, CARD_ID)
    if (stack.length === 0) return
    return {
      flow: {
        type: 'seq',
        optional: true,
        children: [
          { type: 'leaf', actionId: 'plow', sourceCard: CARD_ID },
          { type: 'leaf', actionId: 'pop-card-stack', sourceCard: CARD_ID },
        ],
      },
      sourceCard: CARD_ID,
    }
  },
}

const cardImpl = {
  listeners: [listener],
  effect: {
  id: CARD_ID,
  onBuy: (_state, player) => {
    pushToCardStack(player, CARD_ID, ['field', 'field'])
  },
},
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_I63_MoldboardPlough = defineMinorCard({
  meta: {
  "id": "OLD_I63_MoldboardPlough",
  "name": "铧式犁",
  "deck": "I",
  "number": 63,
  "category": "FARM_PLANNER",
  "desc": [
    "在此卡上放2个田地板块。限2次：每当你使用犁田行动格时，你可以使用此卡上1块田，改为犁2块田。每次使用犁田/粮食耕种[犁播]行动格时，只能使用1个犁/I68耙的效果。"
  ],
  "cost": {
    "wood": 2
  },
  "prerequisite": "1 Occupations",
  "occupationPrerequisites": {
    "min": 1
  },
  "originalId": "I63_MoldboardPlough",
  "gameEdition": "classic",
  "vp": 0,
  "passing": false,
  "extraVp": false,
  "implemented": true,
  "artUrl": "/card-art/classic/I63.png",
  "locales": {
    "zh": {
      "name": "铧式犁",
      "desc": [
        "在此卡上放2个田地板块。限2次：每当你使用犁田行动格时，你可以使用此卡上1块田，改为犁2块田。每次使用犁田/粮食耕种[犁播]行动格时，只能使用1个犁/I68耙的效果。"
      ],
      "prerequisite": "职业×1"
    }
  }
},
  presentation: { stack: true },
  impl: cardImpl,
})

export const OLD_I63_MoldboardPlough_impl = OLD_I63_MoldboardPlough.impl
