// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../card-listeners'
import type { ActionHookResult } from '../../actions/hooks'
import { futureMeeplesNode } from '../../actions/effects/internal/future-meeples'
import type { CardImpl } from '../registry'

const CARD_ID = 'OLD_NL033_HerringPot'
const listener: CardListenerRegistration = {
  id: 'OLD_NL033_HerringPot-herring-pot-before-space-use',
  cardIds: [CARD_ID],
  phases: ['before'],
  actionSpaces: 'all',
  mandatory: true,
  handler: (context: CardListenerContext): ActionHookResult | void => {
    if (context.space?.id !== 'fishing') return
    const request = {
      cardId: CARD_ID,
      playerId: context.player.id,
      startRound: context.state.round + 1,
      count: 3,
      resources: { food: 1 },
    }
    return { flow: futureMeeplesNode(request), sourceCard: CARD_ID }
  },
}

const cardImpl = {
  listeners: [listener],
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_NL033_HerringPot = defineMinorCard({
  meta: {
  "id": "OLD_NL033_HerringPot",
  "name": "烹鱼锅",
  "deck": "NL",
  "number": 33,
  "category": "FOOD_PROVIDER",
  "desc": [
    "每当你使用钓鱼积累行动格时，在之后3个回合的行动格上各放1份食物，在这些回合开始时，你获得这份食物"
  ],
  "cost": {
    "clay": 1
  },
  "originalId": "NL033_HerringPot",
  "gameEdition": "classic",
  "vp": 0,
  "prerequisite": "",
  "passing": false,
  "extraVp": false,
  "implemented": true,
  "artUrl": "/card-art/classic/NL033.png",
  "locales": {
    "zh": {
      "name": "烹鱼锅",
      "desc": [
        "每当你使用钓鱼积累行动格时，在之后3个回合的行动格上各放1份食物，在这些回合开始时，你获得这份食物"
      ],
      "prerequisite": ""
    }
  }
},
  impl: cardImpl,
})

export const OLD_NL033_HerringPot_impl = OLD_NL033_HerringPot.impl
