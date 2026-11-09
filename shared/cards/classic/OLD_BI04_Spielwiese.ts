// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../card-source'
export const OLD_BI04_Spielwiese = defineMinorCard({ meta: {
  "id": "OLD_BI04_Spielwiese",
  "originalId": "BI04_Spielwiese",
  "gameEdition": "classic",
  "name": "游乐场",
  "deck": "BI",
  "number": 4,
  "desc": [
    "从牌库中随机抽取2张职业卡加入手牌。查看这两张牌的适用玩家数(如1+,3+,或4+)并取较小值，你获得等同于该数量的由你选择的不同种类的建筑资源。使用后请将此卡交给下家，此卡将加入他的手牌。"
  ],
  "cost": {
    "food": 1
  },
  "vp": 1,
  "prerequisite": "职业≤1",
  "occupationPrerequisites": {
    "max": 1
  },
  "passing": true,
  "extraVp": false,
  "implemented": false,
  "artUrl": "/card-art/classic/BI04.png",
  "locales": {
    "zh": {
      "name": "游乐场",
      "desc": [
        "从牌库中随机抽取2张职业卡加入手牌。查看这两张牌的适用玩家数(如1+,3+,或4+)并取较小值，你获得等同于该数量的由你选择的不同种类的建筑资源。使用后请将此卡交给下家，此卡将加入他的手牌。"
      ],
      "prerequisite": "职业≤1"
    }
  }
} })
