import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K145_ForestPasture'
const cardImpl = {
  effect: {
    id: CARD_ID,
    onComputeAnimalZones: () => [
      {
        id: `card:${CARD_ID}`,
        zoneType: 'card',
        cardId: CARD_ID,
        capacity: Number.MAX_SAFE_INTEGER,
        allowedAnimalType: 'boar',
      }
    ],
  },
} satisfies CardImpl

export const OLD_K145_ForestPasture = defineMinorCard({
  meta: {
    id: 'OLD_K145_ForestPasture',
    originalId: 'K145_ForestPasture',
    gameEdition: 'classic',
    name: '林间牧场',
    deck: 'K',
    number: 145,
    desc: ['此卡可以容纳任意数量的猪。'],
    cost: {},
    vp: 1,
    prerequisite: '3 Occupations',
    occupationPrerequisites: {
      min: 3,
    },
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K145.png',
    locales: {
      zh: {
        name: '林间牧场',
        desc: ['此卡可以容纳任意数量的猪。'],
        prerequisite: '职业×3',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_K145_ForestPasture_impl = OLD_K145_ForestPasture.impl
