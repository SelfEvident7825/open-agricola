// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../card-source'
import type { ActionFlow } from '../../contract/types'
import type { CardImpl } from '../registry'

const CARD_ID = 'OLD_G064_BarteringHut'

const cardImpl = {
  effect: {
  id: CARD_ID,
  onBuy: () => {
    const makeAnimalOption = (animal: 'sheep' | 'boar' | 'cattle', cost: number): ActionFlow => {
      const payChoices: ActionFlow[] = [
        { type: 'leaf' as const, actionId: 'pay', sourceCard: CARD_ID, params: { wood: 1 } },
        { type: 'leaf' as const, actionId: 'pay', sourceCard: CARD_ID, params: { clay: 1 } },
        { type: 'leaf' as const, actionId: 'pay', sourceCard: CARD_ID, params: { reed: 1 } },
        { type: 'leaf' as const, actionId: 'pay', sourceCard: CARD_ID, params: { stone: 1 } },
      ]
      const paySteps: ActionFlow[] = Array.from({ length: cost }, () => ({
        type: 'xor' as const,
        children: payChoices,
      }))
      return {
        type: 'seq' as const,
        children: [
          { type: 'leaf' as const, actionId: 'gain', sourceCard: CARD_ID, params: { [animal]: 1 } },
          ...paySteps,
        ],
      }
    }

    const oneTime: ActionFlow = {
      type: 'xor' as const,
      optional: true,
      children: [
        makeAnimalOption('sheep', 2),
        makeAnimalOption('boar', 3),
        makeAnimalOption('cattle', 4),
      ],
    }

    return {
      type: 'seq' as const,
      children: [oneTime, oneTime],
    }
  },
},
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_G064_BarteringHut = defineMinorCard({
  meta: {
  "id": "OLD_G064_BarteringHut",
  "name": "交易小屋",
  "deck": "G",
  "number": 64,
  "category": "PASSING_-_ANIMAL",
  "desc": [
    "打出时你可以购买至多2只任意动物。羊/猪/牛分别花费2/3/4个建筑资源使用后请将此卡交给下家，此卡将加入他的手牌。"
  ],
  "passing": true,
  "originalId": "G064_BarteringHut",
  "gameEdition": "classic",
  "cost": {},
  "vp": 0,
  "prerequisite": "",
  "extraVp": false,
  "implemented": true,
  "artUrl": "/card-art/classic/G064.png",
  "locales": {
    "zh": {
      "name": "交易小屋",
      "desc": [
        "打出时你可以购买至多2只任意动物。羊/猪/牛分别花费2/3/4个建筑资源使用后请将此卡交给下家，此卡将加入他的手牌。"
      ],
      "prerequisite": ""
    }
  }
},
  impl: cardImpl,
})

export const OLD_G064_BarteringHut_impl = OLD_G064_BarteringHut.impl
