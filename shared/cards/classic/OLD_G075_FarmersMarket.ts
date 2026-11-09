// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../card-source'
import type { CardImpl } from '../registry'

const CARD_ID = 'OLD_G075_FarmersMarket'

const cardImpl = {
  effect: {
  id: CARD_ID,
  onBuy: () => ({
    type: 'leaf' as const,
    actionId: 'gain',
    sourceCard: CARD_ID,
    params: { vegetable: 1 },
  }),
},
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_G075_FarmersMarket = defineMinorCard({
  meta: {
  "id": "OLD_G075_FarmersMarket",
  "name": "农夫市场",
  "deck": "G",
  "number": 75,
  "category": "PASSING_-_CROP",
  "desc": [
    "打出时你获得1个蔬菜使用后请将此卡交给下家，此卡将加入他的手牌。"
  ],
  "cost": {
    "food": 2
  },
  "passing": true,
  "originalId": "G075_FarmersMarket",
  "gameEdition": "classic",
  "vp": 0,
  "prerequisite": "",
  "extraVp": false,
  "implemented": true,
  "artUrl": "/card-art/classic/G075.png",
  "locales": {
    "zh": {
      "name": "农夫市场",
      "desc": [
        "打出时你获得1个蔬菜使用后请将此卡交给下家，此卡将加入他的手牌。"
      ],
      "prerequisite": ""
    }
  }
},
  impl: cardImpl,
})

export const OLD_G075_FarmersMarket_impl = OLD_G075_FarmersMarket.impl
