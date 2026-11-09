// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../card-source'
import type { CardImpl } from '../registry'
import { getFarmyardTilePositions, positionKey } from '../../domain/farmyard-geometry'
import { getUsedFarmyardTileKeys } from '../../domain/farmyard-usage'

const CARD_ID = 'OLD_FL015_CourtyardGarden'

const cardImpl = {
  effect: {
  id: CARD_ID,
  computeBonusScore: (_state, player) => {
    if (player.houseType !== 'stone') return 0
    const usedTiles = getUsedFarmyardTileKeys(player)
    return getFarmyardTilePositions(player).filter(tile =>
      !usedTiles.has(positionKey(tile)) && player.roomTiles.some(room =>
        Math.abs(tile.row - room.row) + Math.abs(tile.col - room.col) === 1,
      ),
    ).length * 2
  },
},
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_FL015_CourtyardGarden = defineMinorCard({
  meta: {
  "id": "OLD_FL015_CourtyardGarden",
  "name": "避暑宅院",
  "deck": "FL",
  "number": 15,
  "category": "POINTS_PROVIDER",
  "desc": [
    "在计分时，若你居住在石屋内，则你的每块与房间正交相邻的空地都使你获得2分。（你仍然会因这些空地而扣分）"
  ],
  "cost": {
    "wood": 3,
    "stone": 1
  },
  "prerequisite": "Still in Wooden House",
  "extraVp": true,
  "originalId": "FL015_CourtyardGarden",
  "gameEdition": "classic",
  "vp": 0,
  "passing": false,
  "implemented": true,
  "artUrl": "/card-art/classic/FL015.png",
  "locales": {
    "zh": {
      "name": "避暑宅院",
      "desc": [
        "在计分时，若你居住在石屋内，则你的每块与房间正交相邻的空地都使你获得2分。（你仍然会因这些空地而扣分）"
      ],
      "prerequisite": "木屋阶段"
    }
  }
},
  impl: cardImpl,
})

export const OLD_FL015_CourtyardGarden_impl = OLD_FL015_CourtyardGarden.impl
