// Generated classic import. Remove this line before manually porting a card.
import { defineOccupationCard } from '../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../card-listeners'
import type { ActionHookResult } from '../../actions/hooks'
import { gainLeaf } from '../helpers/pay-gain-node'
import type { CardImpl } from '../registry'

const CARD_ID = 'OLD_I240_Cowherd'
const listener: CardListenerRegistration = {
  id: 'OLD_I240_Cowherd-cowherd-before-cattle-market',
  cardIds: [CARD_ID],
  phases: ['before'],
  actionSpaces: 'all',
  handler: (context: CardListenerContext): ActionHookResult | void => {
    if (context.space?.id !== 'cattle-market') return
    return { flow: gainLeaf(CARD_ID, { cattle: 1 }), sourceCard: CARD_ID }
  },
}

const cardImpl = {
  listeners: [listener],
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_I240_Cowherd = defineOccupationCard({
  meta: {
  "id": "OLD_I240_Cowherd",
  "name": "牧牛人",
  "deck": "I",
  "number": 240,
  "category": "LIVESTOCK_PROVIDER",
  "desc": [
    "每当你使用牛市场积累行动格时，额外获得1头牛。"
  ],
  "cost": {},
  "players": "1+",
  "originalId": "I240_Cowherd",
  "gameEdition": "classic",
  "vp": 0,
  "prerequisite": "",
  "passing": false,
  "extraVp": false,
  "implemented": true,
  "artUrl": "/card-art/classic/I240.png",
  "locales": {
    "zh": {
      "name": "牧牛人",
      "desc": [
        "每当你使用牛市场积累行动格时，额外获得1头牛。"
      ],
      "prerequisite": ""
    }
  }
},
  impl: cardImpl,
})

export const OLD_I240_Cowherd_impl = OLD_I240_Cowherd.impl
