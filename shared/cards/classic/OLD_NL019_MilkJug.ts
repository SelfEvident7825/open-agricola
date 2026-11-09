// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../card-source'
import type { CardListenerContext, CardListenerRegistration } from '../card-listeners'
import type { ActionHookResult } from '../../actions/hooks'
import { gainLeaf } from '../helpers/pay-gain-node'
import type { CardImpl } from '../registry'

const CARD_ID = 'OLD_NL019_MilkJug'
/**
 * A50 Milk Jug — Each time any player (including you) uses the Cattle Market
 * accumulation space, you get 3 food and each other player gets 1 food.
 *
 * scope 'any' — fires once for the card owner regardless of who triggered.
 */
const listener: CardListenerRegistration = {
  id: 'OLD_NL019_MilkJug-milk-jug-any-cattle-market',
  cardIds: [CARD_ID],
  actionSpaces: 'all',
  phases: ['before'],
  scope: 'any',
  handler: (context: CardListenerContext): ActionHookResult | void => {
    if (context.space?.id !== 'cattle-market') return
    // Owner always gets 3 food; every other player gets 1 food.
    return {
      flow: {
        type: 'seq',
        targetPlayerId: context.ownerPlayer?.id ?? context.player.id,
        children: [
          gainLeaf(CARD_ID, { food: 3 }),
          {
            type: 'leaf',
            actionId: 'gain',
            params: { recipientMode: 'others', food: 1 },
            sourceCard: CARD_ID,
          },
        ],
      },
      sourceCard: CARD_ID,
    }
  },
}

const cardImpl = {
  listeners: [listener],
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_NL019_MilkJug = defineMinorCard({
  meta: {
  "id": "OLD_NL019_MilkJug",
  "name": "牛奶罐",
  "deck": "NL",
  "number": 19,
  "category": "FOOD_PROVIDER",
  "desc": [
    "每当任意玩家（包括你）使用牛市场积累行动格时，你获得3份食物，而其他每位玩家各获得1份食物"
  ],
  "cost": {
    "clay": 1
  },
  "originalId": "NL019_MilkJug",
  "gameEdition": "classic",
  "vp": 0,
  "prerequisite": "",
  "passing": false,
  "extraVp": false,
  "implemented": true,
  "artUrl": "/card-art/classic/NL019.png",
  "locales": {
    "zh": {
      "name": "牛奶罐",
      "desc": [
        "每当任意玩家（包括你）使用牛市场积累行动格时，你获得3份食物，而其他每位玩家各获得1份食物"
      ],
      "prerequisite": ""
    }
  }
},
  impl: cardImpl,
})

export const OLD_NL019_MilkJug_impl = OLD_NL019_MilkJug.impl
