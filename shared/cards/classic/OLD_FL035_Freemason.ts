// Generated classic import. Remove this line before manually porting a card.
import { defineOccupationCard } from '../card-source'
import { gainLeaf } from '../helpers/pay-gain-node'
import type { CardImpl } from '../registry'

const CARD_ID = 'OLD_FL035_Freemason'

const cardImpl = {
  effect: {
  id: CARD_ID,
  stageEligibility: { onWorkStart: (_state, player) => player.roomTiles.length === 2 && (player.houseType === 'clay' || player.houseType === 'stone') },
  onWorkStart: (_state, player, ctx) => {
    const roomCount = player.roomTiles.length
    if (!ctx?.roundPreparation && (roomCount !== 2)) return
    if (player.houseType === 'stone') {
      return gainLeaf(CARD_ID, { stone: 2 })
    }
    if (player.houseType === 'clay') {
      return gainLeaf(CARD_ID, { clay: 2 })
    }
  },
},
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_FL035_Freemason = defineOccupationCard({
  meta: {
  "id": "OLD_FL035_Freemason",
  "name": "共济会员",
  "deck": "FL",
  "number": 35,
  "category": "BUILDING_RESOURCE_PROVIDER",
  "desc": [
    "只要你居住在仅有2个房间的砖屋/石屋内，在每回合的工作阶段开始时，你获得2块砖头/石头。"
  ],
  "cost": {},
  "players": "1+",
  "originalId": "FL035_Freemason",
  "gameEdition": "classic",
  "vp": 0,
  "prerequisite": "",
  "passing": false,
  "extraVp": false,
  "implemented": true,
  "artUrl": "/card-art/classic/FL035.png",
  "locales": {
    "zh": {
      "name": "共济会员",
      "desc": [
        "只要你居住在仅有2个房间的砖屋/石屋内，在每回合的工作阶段开始时，你获得2块砖头/石头。"
      ],
      "prerequisite": ""
    }
  }
},
  impl: cardImpl,
})

export const OLD_FL035_Freemason_impl = OLD_FL035_Freemason.impl
