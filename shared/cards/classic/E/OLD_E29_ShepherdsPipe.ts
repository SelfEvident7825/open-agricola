import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E29_ShepherdsPipe'
const cardImpl = {
  effect: {
    id: CARD_ID,
    onComputeAnimalZones: (_player, zones) => {
      for (const zone of zones) {
        const extra =
          zone.zoneType === 'pasture'
            ? 2
            : zone.zoneType === 'stable'
              ? Math.max(0, 2 - zone.capacity)
              : 0
        if (extra) {
          zone.capacity += extra
          zone.reservedCapacity = {
            ...zone.reservedCapacity,
            sheep: (zone.reservedCapacity?.sheep ?? 0) + extra,
          }
        }
      }
    },
  },
} satisfies CardImpl
export const OLD_E29_ShepherdsPipe = defineOccupationCard({
  meta: {
    id: 'OLD_E29_ShepherdsPipe',
    originalId: 'E29_ShepherdsPipe',
    gameEdition: 'classic',
    name: '兽角笛',
    deck: 'E',
    number: 29,
    desc: ['每个饲养羊的圈地可以额外饲养2只羊，每个圈地外的马厩可以饲养2只羊。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '4+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E29.png',
    locales: {
      zh: {
        name: '兽角笛',
        desc: ['每个饲养羊的圈地可以额外饲养2只羊，每个圈地外的马厩可以饲养2只羊。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E29_ShepherdsPipe_impl = OLD_E29_ShepherdsPipe.impl
