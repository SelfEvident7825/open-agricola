// Generated classic import. Remove this line before manually porting a card.
import { defineOccupationCard } from '../card-source'
import { queueFutureMeeplesFlow } from '../../actions/effects/internal/future-meeples'
import type { CardImpl } from '../registry'

const CARD_ID = 'OLD_G047_ResourceCollector'

const cardImpl = {
  effect: {
  id: CARD_ID,
  onBuy: (state, player) => {
    const base = state.round
    return queueFutureMeeplesFlow(state, {
      cardId: CARD_ID,
      playerId: player.id,
      entries: [
        { round: base + 1, resources: { wood: 1 } },
        { round: base + 2, resources: { clay: 1 } },
        { round: base + 3, resources: { reed: 1 } },
        { round: base + 4, resources: { stone: 1 } },
      ],
    })
  },
},
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_G047_ResourceCollector = defineOccupationCard({
  meta: {
  "id": "OLD_G047_ResourceCollector",
  "name": "资源采集者",
  "deck": "G",
  "number": 47,
  "category": "BUILDING_RESOURCE_PROVIDER",
  "desc": [
    "在之后4个回合的行动格上分别放置1个木头、1个砖头、1捆芦苇和1个石头（顺序由你选择）。在这些回合开始时，你获得对应的物品。"
  ],
  "cost": {},
  "players": "3+",
  "originalId": "G047_ResourceCollector",
  "gameEdition": "classic",
  "vp": 0,
  "prerequisite": "",
  "passing": false,
  "extraVp": false,
  "implemented": true,
  "artUrl": "/card-art/classic/G047.png",
  "locales": {
    "zh": {
      "name": "资源采集者",
      "desc": [
        "在之后4个回合的行动格上分别放置1个木头、1个砖头、1捆芦苇和1个石头（顺序由你选择）。在这些回合开始时，你获得对应的物品。"
      ],
      "prerequisite": ""
    }
  }
},
  impl: cardImpl,
})

export const OLD_G047_ResourceCollector_impl = OLD_G047_ResourceCollector.impl
