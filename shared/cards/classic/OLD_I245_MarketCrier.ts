// Generated classic import. Remove this line before manually porting a card.
import { defineOccupationCard } from '../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../card-listeners'
import type { ActionHookResult } from '../../actions/hooks'
import { gainLeaf } from '../helpers/pay-gain-node'
import type { CardImpl } from '../registry'

const CARD_ID = 'OLD_I245_MarketCrier'
/**
 * Before the Grain Seeds action: optionally gain 1 grain + 1 vegetable,
 * and if you do, each other player gets 1 grain.
 */
const listener: CardListenerRegistration = {
  id: 'OLD_I245_MarketCrier-market-crier-before-grain-seeds',
  cardIds: [CARD_ID],
  phases: ['before'],
  actionSpaces: 'all',
  handler: (context: CardListenerContext): ActionHookResult | void => {
    if (context.space?.id !== 'grain-seeds') return
    return {
      flow: {
        type: 'seq',
        optional: true,
        children: [
          gainLeaf(CARD_ID, { grain: 1, vegetable: 1 }),
          { type: 'leaf', actionId: 'gain', params: { recipientMode: 'others', grain: 1 }, sourceCard: CARD_ID },
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

export const OLD_I245_MarketCrier = defineOccupationCard({
  meta: {
  "id": "OLD_I245_MarketCrier",
  "name": "叫卖贩",
  "deck": "I",
  "number": 245,
  "category": "CROP_PROVIDER",
  "desc": [
    "每当你使用小麦种子行动格时，你可以选择额外获得1份小麦+1份蔬菜。若如此做，则其他玩家各获得1份小麦。"
  ],
  "cost": {},
  "players": "1+",
  "originalId": "I245_MarketCrier",
  "gameEdition": "classic",
  "vp": 0,
  "prerequisite": "",
  "passing": false,
  "extraVp": false,
  "implemented": true,
  "artUrl": "/card-art/classic/I245.png",
  "locales": {
    "zh": {
      "name": "叫卖贩",
      "desc": [
        "每当你使用小麦种子行动格时，你可以选择额外获得1份小麦+1份蔬菜。若如此做，则其他玩家各获得1份小麦。"
      ],
      "prerequisite": ""
    }
  }
},
  impl: cardImpl,
})

export const OLD_I245_MarketCrier_impl = OLD_I245_MarketCrier.impl
