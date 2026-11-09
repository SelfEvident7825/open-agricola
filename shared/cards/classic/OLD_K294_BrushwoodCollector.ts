// Generated classic import. Remove this line before manually porting a card.
import { defineOccupationCard } from '../card-source'
import type { BonusModifier, TradeModifier } from '../../contract/types'
import type { CardImpl } from '../registry'

const CARD_ID = 'OLD_K294_BrushwoodCollector'

/**
 * B145 Brushwood Collector — Each time you renovate or build a room,
 * you can replace the required 1 or 2 <REED> with a total of 1 <WOOD>.
 *
 * - onPlayerComputeCostsConstruct: for each trade that contains REED, creates an
 *   alternative with WOOD +1 and REED removed (all reed replaced by 1 wood).
 * - onPlayerComputeCostsRenovation: for each fee with 1 or 2 REED, creates an
 *   alternative with WOOD +1 and all REED removed.
 *
 * Implementation uses TradeModifiers to provide optional alternatives:
 * - construct: from { wood: 1 } to up to 2 reed — replace room reed with 1 wood
 * - renovation: bounded bonus choices replace exactly 1 or 2 reed with 1 wood
 */

export const OLD_K294_BrushwoodCollector = defineOccupationCard({
  meta: {
  "id": "OLD_K294_BrushwoodCollector",
  "name": "拾柴者",
  "deck": "K",
  "number": 294,
  "category": "BUILDING_RESOURCE_PROVIDER",
  "desc": [
    "在每次翻修/扩建每间房屋时，你可以用1根木头来代替所需的1捆/2捆芦苇。"
  ],
  "cost": {},
  "players": "3+",
  "originalId": "K294_BrushwoodCollector",
  "gameEdition": "classic",
  "vp": 0,
  "prerequisite": "",
  "passing": false,
  "extraVp": false,
  "implemented": true,
  "artUrl": "/card-art/classic/K294.png",
  "locales": {
    "zh": {
      "name": "拾柴者",
      "desc": [
        "在每次翻修/扩建每间房屋时，你可以用1根木头来代替所需的1捆/2捆芦苇。"
      ],
      "prerequisite": ""
    }
  }
},
  impl: {
  modifiers: [
    ...([
        {
          type: 'trade',
          cardId: CARD_ID,
          appliesTo: ['construct'],
          // scope:'unit' applies this replacement to each room cost row, matching
          // The reference's per-room `addCost` alternative.
          scope: 'unit',
          replaceUpTo: true,
          from: { wood: 1 },
          to: { reed: 2 },
        },
        {
          type: 'bonus',
          cardId: CARD_ID,
          appliesTo: ['renovation'],
          optional: true,
          choices: [
            { discount: { reed: 1, wood: -1 }, sources: [CARD_ID], minCost: { reed: 1 }, maxCost: { reed: 1 } },
            { discount: { reed: 2, wood: -1 }, sources: [CARD_ID], minCost: { reed: 2 }, maxCost: { reed: 2 } },
          ],
        },
      ] as (TradeModifier | BonusModifier)[]),
  ],
} satisfies CardImpl,
})

export const OLD_K294_BrushwoodCollector_impl = OLD_K294_BrushwoodCollector.impl
