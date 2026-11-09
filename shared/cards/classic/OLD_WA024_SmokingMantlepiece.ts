// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../card-source'
import type { CardImpl } from '../registry'
import { bonusVpLeaf } from '../helpers/pay-gain-node'

const CARD_ID = 'OLD_WA024_SmokingMantlepiece'

const cardImpl = {
  prerequisiteCheck: (player) => player.houseType !== 'wood',
  effect: {
  id: CARD_ID,
  onBuy: (state, _player) => {
    const roundsLeft = Math.max(0, 14 - state.round)
    if (roundsLeft <= 0) return
    return bonusVpLeaf(CARD_ID, roundsLeft)
  },
},
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_WA024_SmokingMantlepiece = defineMinorCard({
  meta: {
  "id": "OLD_WA024_SmokingMantlepiece",
  "name": "壁炉台",
  "deck": "WA",
  "number": 24,
  "category": "POINTS_PROVIDER",
  "desc": [
    "打出此卡时，距离游戏结束每之后1个完整回合，你就获得1分，你无法再翻修你的房屋"
  ],
  "cost": {
    "stone": 1
  },
  "vp": 1,
  "prerequisite": "砖屋或石屋",
  "extraVp": true,
  "blocksRenovation": true,
  "originalId": "WA024_SmokingMantlepiece",
  "gameEdition": "classic",
  "passing": false,
  "implemented": true,
  "artUrl": "/card-art/classic/WA024.png",
  "locales": {
    "zh": {
      "name": "壁炉台",
      "desc": [
        "打出此卡时，距离游戏结束每之后1个完整回合，你就获得1分，你无法再翻修你的房屋"
      ],
      "prerequisite": "砖屋或石屋"
    }
  }
},
  presentation: { counters: ['bonusVp'] },
  impl: cardImpl,
})

export const OLD_WA024_SmokingMantlepiece_impl = OLD_WA024_SmokingMantlepiece.impl
