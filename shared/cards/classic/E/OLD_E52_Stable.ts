import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E52_Stable'
const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (_state, _player) => {
      return {
        type: 'leaf' as const,
        actionId: 'stables',
        sourceCard: CARD_ID,
        actionContext: {
          max: 1,
          exactCost: {
            wood: 0,
            max: 1,
          },
          cancelPolicy: 'forbidCancel',
        },
      }
    },
  },
  reaches: [] as readonly string[],
} satisfies CardImpl
export const OLD_E52_Stable = defineMinorCard({
  meta: {
    id: 'OLD_E52_Stable',
    name: '小马厩',
    deck: 'E',
    number: 52,
    category: 'FARM_PLANNER',
    desc: ['立即免费建造1个马厩。使用后请将此卡交给下家，此卡将加入他的手牌。'],
    cost: {
      wood: 1,
    },
    passing: true,
    originalId: 'E52_Stable',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E52.png',
  },
  impl: cardImpl,
})
export const OLD_E52_Stable_impl = OLD_E52_Stable.impl
