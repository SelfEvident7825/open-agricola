// Generated classic import. Remove this line before manually porting a card.
import { defineOccupationCard } from '../card-source'
import { gainLeaf } from '../helpers/pay-gain-node'
import type { CardImpl } from '../registry'

const CARD_ID = 'OLD_NL118_PotatoHarvester'

const cardImpl = {
  effect: {
  id: CARD_ID,
  onBuy: () => gainLeaf(CARD_ID, { food: 3 }),
  onAfterReap: (_state, player) => {
    // Count vegetable fields that were harvested
    const vegFields = _state.harvestReapSummary?.[player.id]?.vegetableFields ?? 0
    if (vegFields <= 0) return
    return {
      type: 'seq',
      children: [gainLeaf(CARD_ID, { food: vegFields })],
    }
  },
},
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_NL118_PotatoHarvester = defineOccupationCard({
  meta: {
  "id": "OLD_NL118_PotatoHarvester",
  "name": "土豆收割工",
  "deck": "NL",
  "number": 118,
  "category": "FOOD_PROVIDER",
  "desc": [
    "打出此卡时，你获得3份食物。在每个丰收时节的收割阶段，你每从田地里收割1份蔬菜，便额外获得1份食物。"
  ],
  "cost": {},
  "players": "1+",
  "implemented": true,
  "originalId": "NL118_PotatoHarvester",
  "gameEdition": "classic",
  "vp": 0,
  "prerequisite": "",
  "passing": false,
  "extraVp": false,
  "artUrl": "/card-art/classic/NL118.png",
  "locales": {
    "zh": {
      "name": "土豆收割工",
      "desc": [
        "打出此卡时，你获得3份食物。在每个丰收时节的收割阶段，你每从田地里收割1份蔬菜，便额外获得1份食物。"
      ],
      "prerequisite": ""
    }
  }
},
  impl: cardImpl,
})

export const OLD_NL118_PotatoHarvester_impl = OLD_NL118_PotatoHarvester.impl
