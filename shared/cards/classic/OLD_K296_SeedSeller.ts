// Generated classic import. Remove this line before manually porting a card.
import { defineOccupationCard } from '../card-source'
import type { CardListenerContext, CardListenerRegistration } from '../card-listeners'
import type { ActionHookResult } from '../../actions/hooks'
import { gainLeaf } from '../helpers/pay-gain-node'
import type { CardImpl } from '../registry'

const CARD_ID = 'OLD_K296_SeedSeller'
const listener: CardListenerRegistration = {
  id: 'OLD_K296_SeedSeller-seed-seller-before-grain-seeds',
  cardIds: [CARD_ID],
  actionSpaces: 'all',
  phases: ['before'],
  handler: (context: CardListenerContext): ActionHookResult | void => {
    if (context.space?.id !== 'grain-seeds') return
    return { flow: gainLeaf(CARD_ID, { grain: 1 }), sourceCard: CARD_ID }
  },
}

const cardImpl = {
  listeners: [listener],
  effect: {
  id: CARD_ID,
  onBuy: () => gainLeaf(CARD_ID, { grain: 1 }),
},
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_K296_SeedSeller = defineOccupationCard({
  meta: {
  "id": "OLD_K296_SeedSeller",
  "name": "种子贩售商",
  "deck": "K",
  "number": 296,
  "category": "CROP_PROVIDER",
  "desc": [
    "打出时立即获得1份小麦。每当你使用小麦种子行动格时，你额外获得1份小麦。"
  ],
  "cost": {},
  "players": "3+",
  "originalId": "K296_SeedSeller",
  "gameEdition": "classic",
  "vp": 0,
  "prerequisite": "",
  "passing": false,
  "extraVp": false,
  "implemented": true,
  "artUrl": "/card-art/classic/K296.png",
  "locales": {
    "zh": {
      "name": "种子贩售商",
      "desc": [
        "打出时立即获得1份小麦。每当你使用小麦种子行动格时，你额外获得1份小麦。"
      ],
      "prerequisite": ""
    }
  }
},
  impl: cardImpl,
})

export const OLD_K296_SeedSeller_impl = OLD_K296_SeedSeller.impl
