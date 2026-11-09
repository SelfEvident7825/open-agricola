// Generated classic import. Remove this line before manually porting a card.
import { defineOccupationCard } from '../card-source'
import type { CardImpl } from '../registry'
import { gainLeaf } from '../helpers/pay-gain-node'

const CARD_ID = 'OLD_I252_PigBreeder'

const cardImpl = {
  effect: {
    id: CARD_ID,
  onBuy: () => gainLeaf(CARD_ID, { boar: 1 }),
  timedRules: [{ key: 'extra-breeding', at: { kind: 'rounds', rounds: [12], phase: 'onAfterRoundEnd' }, body: { kind: 'condition', condition: { kind: 'compare', left: { kind: 'supply', resource: 'boar' }, operator: 'ge', right: 2 }, body: { kind: 'operation', operation: { kind: 'breed-animals', animals: ['boar'], requireCapacity: true } } } }],
  },
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_I252_PigBreeder = defineOccupationCard({
  meta: {
  "id": "OLD_I252_PigBreeder",
  "name": "野猪哺育师",
  "deck": "I",
  "number": 252,
  "category": "LIVESTOCK_PROVIDER",
  "desc": [
    "打出时立即获得1头猪。在第12回合结束时，你的猪将会进行一次繁殖。"
  ],
  "cost": {},
  "players": "3+",
  "originalId": "I252_PigBreeder",
  "gameEdition": "classic",
  "vp": 0,
  "prerequisite": "",
  "passing": false,
  "extraVp": false,
  "implemented": true,
  "artUrl": "/card-art/classic/I252.png",
  "locales": {
    "zh": {
      "name": "野猪哺育师",
      "desc": [
        "打出时立即获得1头猪。在第12回合结束时，你的猪将会进行一次繁殖。"
      ],
      "prerequisite": ""
    }
  }
},
  impl: cardImpl,
})

export const OLD_I252_PigBreeder_impl = OLD_I252_PigBreeder.impl
