// Generated classic import. Remove this line before manually porting a card.
import { defineOccupationCard } from '../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../card-listeners'
import type { ActionHookResult } from '../../actions/hooks'
import type { CardImpl } from '../registry'

const CARD_ID = 'OLD_I225_FieldWatchman'
const listener: CardListenerRegistration = {
  id: 'OLD_I225_FieldWatchman-field-watchman-before-place-farmer',
  cardIds: [CARD_ID],
  phases: ['before'],
  actionSpaces: 'all',
  handler: (context: CardListenerContext): ActionHookResult | void => {
    if (context.space?.id !== 'grain-seeds') return
    return {
      flow: {
        type: 'leaf',
        actionId: 'plow',
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

export const OLD_I225_FieldWatchman = defineOccupationCard({
  meta: {
  "id": "OLD_I225_FieldWatchman",
  "name": "农田巡逻",
  "deck": "I",
  "number": 225,
  "category": "FARM_PLANNER",
  "desc": [
    "每当你使用小麦种子行动格时，你可以额外犁1块田。"
  ],
  "cost": {},
  "players": "1+",
  "originalId": "I225_FieldWatchman",
  "gameEdition": "classic",
  "vp": 0,
  "prerequisite": "",
  "passing": false,
  "extraVp": false,
  "implemented": true,
  "artUrl": "/card-art/classic/I225.png",
  "locales": {
    "zh": {
      "name": "农田巡逻",
      "desc": [
        "每当你使用小麦种子行动格时，你可以额外犁1块田。"
      ],
      "prerequisite": ""
    }
  }
},
  impl: cardImpl,
})

export const OLD_I225_FieldWatchman_impl = OLD_I225_FieldWatchman.impl
