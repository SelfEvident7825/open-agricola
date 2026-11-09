// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../card-source'
import { makeCardFieldImpl } from '../helpers/card-field'

const CARD_ID = 'OLD_I78_Copse'

const cardImpl = makeCardFieldImpl(CARD_ID, {
  allowedCrops: ['wood'],
  capacity: 2,
})

export const OLD_I78_Copse = defineMinorCard({
  meta: {
  "id": "OLD_I78_Copse",
  "name": "木头地",
  "deck": "I",
  "number": 78,
  "category": "BUILDING_RESOURCE_PROVIDER",
  "desc": [
    "你可以在此卡上播种2列木头。木头的播种和收割遵循小麦的一般规则。播种后视为2个已播种田地。(卡牌田)此卡上未收割的木头不算作你的资源，不参与计算任何职业卡和发展卡分数。"
  ],
  "vp": 1,
  "cost": {
    "wood": 2
  },
  "prerequisite": "1 Occupations",
  "occupationPrerequisites": {
    "min": 1
  },
  "isField": true,
  "cardField": {
    "allowedCrops": [
      "wood"
    ],
    "capacity": 2
  },
  "originalId": "I78_Copse",
  "gameEdition": "classic",
  "passing": false,
  "extraVp": false,
  "implemented": true,
  "artUrl": "/card-art/classic/I78.png",
  "locales": {
    "zh": {
      "name": "木头地",
      "desc": [
        "你可以在此卡上播种2列木头。木头的播种和收割遵循小麦的一般规则。播种后视为2个已播种田地。(卡牌田)此卡上未收割的木头不算作你的资源，不参与计算任何职业卡和发展卡分数。"
      ],
      "prerequisite": "职业×1"
    }
  }
},
  presentation: { cardFields: true },
  impl: cardImpl,
})

export const OLD_I78_Copse_impl = OLD_I78_Copse.impl
