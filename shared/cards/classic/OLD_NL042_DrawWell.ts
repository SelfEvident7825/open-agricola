// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../card-source'
import { queueFutureMeeples, futureMeeplesNode } from '../../actions/effects/internal/future-meeples'
import type { CardImpl } from '../registry'

const CARD_ID = 'OLD_NL042_DrawWell'

const cardImpl = {
  effect: {
  id: CARD_ID,
  onBuy: (state, player) => {
    const evenRounds = [2, 4, 6, 8, 10, 12, 14].filter((r) => r > state.round)
    if (evenRounds.length === 0) return

    queueFutureMeeples(state, {
      cardId: CARD_ID,
      playerId: player.id,
      entries: evenRounds.map((round) => ({ round, resources: { food: 1 } })),
    })
    return futureMeeplesNode()
  },
},
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_NL042_DrawWell = defineMinorCard({
  meta: {
  "id": "OLD_NL042_DrawWell",
  "name": "提水井",
  "deck": "NL",
  "number": 42,
  "category": "FOOD",
  "desc": [
    "在之后的偶数回合行动格上各放置1食物，这些回合开始时，你获得对应的食物。这是1个井。"
  ],
  "vp": 2,
  "cost": {
    "wood": 1,
    "stone": 2
  },
  "originalId": "NL042_DrawWell",
  "gameEdition": "classic",
  "prerequisite": "",
  "passing": false,
  "extraVp": false,
  "implemented": true,
  "artUrl": "/card-art/classic/NL042.png",
  "locales": {
    "zh": {
      "name": "提水井",
      "desc": [
        "在之后的偶数回合行动格上各放置1食物，这些回合开始时，你获得对应的食物。这是1个井。"
      ],
      "prerequisite": ""
    }
  }
},
  impl: cardImpl,
})

export const OLD_NL042_DrawWell_impl = OLD_NL042_DrawWell.impl
