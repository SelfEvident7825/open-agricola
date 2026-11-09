// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../card-source'
import { gainLeaf } from '../helpers/pay-gain-node'
import type { CardImpl } from '../registry'

const CARD_ID = 'OLD_NL060_Shack'

const cardImpl = {
  effect: {
  id: CARD_ID,
  stageEligibility: { onRoundStart: (_state, player) => player.houseType === 'wood' },
  onRoundStart: (_state, player, ctx) => {
    if (!ctx?.roundPreparation && (player.houseType !== 'wood')) return
    return gainLeaf(CARD_ID, { food: 1 })
  },
},
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_NL060_Shack = defineMinorCard({
  meta: {
  "id": "OLD_NL060_Shack",
  "name": "简陋木屋",
  "deck": "NL",
  "number": 60,
  "category": "FOOD_PROVIDER",
  "desc": [
    "每回合开始时，若你仍居住在木屋内，则你获得1份食物"
  ],
  "cost": {
    "wood": 1,
    "stone": 1
  },
  "originalId": "NL060_Shack",
  "gameEdition": "classic",
  "vp": 1,
  "prerequisite": "",
  "passing": false,
  "extraVp": false,
  "implemented": true,
  "artUrl": "/card-art/classic/NL060.png",
  "locales": {
    "zh": {
      "name": "简陋木屋",
      "desc": [
        "每回合开始时，若你仍居住在木屋内，则你获得1份食物"
      ],
      "prerequisite": ""
    }
  }
},
  impl: cardImpl,
})

export const OLD_NL060_Shack_impl = OLD_NL060_Shack.impl
