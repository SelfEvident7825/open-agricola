import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E40_MiniPasture'
const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (_state, _player) => ({
      type: 'leaf' as const,
      actionId: 'fence',
      sourceCard: CARD_ID,
      actionContext: {
        fencePolicy: {
          segmentBounds: {
            total: {
              min: 1,
              max: 4,
            },
          },
          newPastureBounds: {
            count: {
              min: 1,
              max: 1,
            },
            totalSize: {
              min: 1,
              max: 1,
            },
          },
          costPolicy: { fence: { wood: 0 } },
        },
      },
    }),
  },
  reaches: [] as readonly string[],
} satisfies CardImpl
export const OLD_E40_MiniPasture = defineMinorCard({
  meta: {
    id: 'OLD_E40_MiniPasture',
    name: '迷你圈地',
    deck: 'E',
    number: 40,
    category: 'FARM_PLANNER',
    desc: [
      '立即免费将你的1个农场格子围成圈地。（遵守围建栅栏的一般规则，且不能分割原有圈地。）使用后请将此卡交给下家，此卡将加入他的手牌。',
    ],
    cost: {
      food: 2,
    },
    passing: true,
    originalId: 'E40_MiniPasture',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E40.png',
  },
  impl: cardImpl,
})
export const OLD_E40_MiniPasture_impl = OLD_E40_MiniPasture.impl
