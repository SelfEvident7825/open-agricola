// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../card-source'
import type { CardImpl } from '../registry'

const CARD_ID = 'OLD_I102_WildlifeReserve'

const cardImpl = {
  effect: {
    id: CARD_ID,
    onComputeAnimalZones: (_player, zones, _state) => {
      zones.push({
        id: `card:${CARD_ID}`,
        zoneType: 'card',
        cardId: CARD_ID,
        capacity: 3,
        animalType: null,
        animalCount: 0,
        allowedAnimalType: null,
      })
    },
    /**
     * The reference `Cards/C/the reference::getInvalidAnimals`:
     * counter per type; if same type appears more than once → invalid.
     * Mirrors the per-type cap of 1 sheep + 1 pig + 1 cattle.
     */
    getInvalidAnimals: (_player, _zone, meeples) => {
      const counters: Record<string, number> = { sheep: 0, boar: 0, cattle: 0 }
      const invalid: typeof meeples = []
      for (const meeple of meeples) {
        if (!(meeple.type in counters)) {
          invalid.push(meeple)
          continue
        }
        counters[meeple.type] = (counters[meeple.type] ?? 0) + 1
        if (counters[meeple.type]! > 1) invalid.push(meeple)
      }
      return invalid
    },
  },
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_I102_WildlifeReserve = defineMinorCard({
  meta: {
  "id": "OLD_I102_WildlifeReserve",
  "name": "野生保护区",
  "deck": "I",
  "number": 102,
  "category": "FARM_PLANNER",
  "desc": [
    "你可以在此卡上饲养至多1只羊+1只猪+1只牛。(可被E29兽角笛和E59饮水槽扩充容量)"
  ],
  "cost": {
    "wood": 2
  },
  "animalHolder": true,
  "vp": 1,
  "prerequisite": "2 Occupations",
  "occupationPrerequisites": {
    "min": 2
  },
  "originalId": "I102_WildlifeReserve",
  "gameEdition": "classic",
  "passing": false,
  "extraVp": false,
  "implemented": true,
  "artUrl": "/card-art/classic/I102.png",
  "locales": {
    "zh": {
      "name": "野生保护区",
      "desc": [
        "你可以在此卡上饲养至多1只羊+1只猪+1只牛。(可被E29兽角笛和E59饮水槽扩充容量)"
      ],
      "prerequisite": "职业×2"
    }
  }
},
  impl: cardImpl,
})

export const OLD_I102_WildlifeReserve_impl = OLD_I102_WildlifeReserve.impl
