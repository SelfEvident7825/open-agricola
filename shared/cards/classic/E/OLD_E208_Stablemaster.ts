import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E208_Stablemaster'
const cardImpl = {
  effect: {
    id: CARD_ID,
    onComputeAnimalZones: (_player, zones, _state) => {
      const stableZone = zones.find((z) => z.zoneType === 'stable')
      if (stableZone) {
        stableZone.capacity = Math.max(stableZone.capacity, 3)
        delete stableZone.reservedCapacity // three animals of any single species // 1 → 3
      }
    },
  },
  reaches: [] as readonly string[],
} satisfies CardImpl
export const OLD_E208_Stablemaster = defineOccupationCard({
  meta: {
    id: 'OLD_E208_Stablemaster',
    name: '马厩管理员',
    deck: 'E',
    number: 208,
    category: 'FARM_PLANNER',
    desc: ['你可在至多1个未被栅栏围住的马厩里饲养3只同种类型的动物。'],
    cost: {},
    players: '4+',
    originalId: 'E208_Stablemaster',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E208.png',
    locales: {
      zh: {
        name: '马厩管理员',
        desc: ['你可在至多1个未被栅栏围住的马厩里饲养3只同种类型的动物。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E208_Stablemaster_impl = OLD_E208_Stablemaster.impl
