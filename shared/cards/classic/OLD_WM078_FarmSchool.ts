// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../card-source'
export const OLD_WM078_FarmSchool = defineMinorCard({ meta: {
  "id": "OLD_WM078_FarmSchool",
  "originalId": "WM078_FarmSchool",
  "gameEdition": "classic",
  "name": "农业学校",
  "deck": "WM",
  "number": 78,
  "desc": [
    "每个丰收时节的收割阶段，如果你至少收割了2个物品，则你可以支付2份食物来打出1张职业卡。注：（1）卡牌提供的“收割阶段”不算。（2）卡牌田/田地板块上收割的每份物品都可计算在内。"
  ],
  "cost": {
    "wood": 1,
    "reed": 1
  },
  "vp": 1,
  "prerequisite": "2 Occupations",
  "occupationPrerequisites": {
    "min": 2
  },
  "passing": false,
  "extraVp": false,
  "implemented": false,
  "artUrl": "/card-art/classic/WM078.png",
  "locales": {
    "zh": {
      "name": "农业学校",
      "desc": [
        "每个丰收时节的收割阶段，如果你至少收割了2个物品，则你可以支付2份食物来打出1张职业卡。注：（1）卡牌提供的“收割阶段”不算。（2）卡牌田/田地板块上收割的每份物品都可计算在内。"
      ],
      "prerequisite": "职业×2"
    }
  }
} })
