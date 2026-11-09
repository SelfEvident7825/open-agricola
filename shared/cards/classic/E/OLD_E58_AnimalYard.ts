import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E58_AnimalYard'
const cardImpl = {
  reaches: ['OLD_E29_ShepherdsPipe', 'OLD_E59_DrinkingTrough'] as readonly string[],
  effect: {
    id: CARD_ID,
    onComputeAnimalZones: (player, zones) => {
      const pipe = player.occupationPlayed.includes('OLD_E29_ShepherdsPipe')
      zones.push({
        id: 'card:' + CARD_ID,
        zoneType: 'card',
        cardId: CARD_ID,
        capacity:
          2 + (player.minorPlayed.includes('OLD_E59_DrinkingTrough') ? 2 : 0) + (pipe ? 2 : 0),
        ...(pipe ? { reservedCapacity: { sheep: 2 } } : {}),
        allowedAnimalType: null,
        animalType: null,
        animalCount: 0,
      })
    },
  },
} satisfies CardImpl
export const OLD_E58_AnimalYard = defineMinorCard({
  meta: {
    id: 'OLD_E58_AnimalYard',
    originalId: 'E58_AnimalYard',
    gameEdition: 'classic',
    name: '兽笼',
    deck: 'E',
    number: 58,
    desc: ['此卡可以容纳两只任意种类的动物。（可被E59饮水槽和E29兽角笛扩充容量）'],
    cost: {
      wood: 2,
    },
    vp: 1,
    prerequisite: '1 Occupations',
    occupationPrerequisites: {
      min: 1,
    },
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E58.png',
    locales: {
      zh: {
        name: '兽笼',
        desc: ['此卡可以容纳两只任意种类的动物。（可被E59饮水槽和E29兽角笛扩充容量）'],
        prerequisite: '职业×1',
      },
    },
    animalHolder: true,
  },
  impl: cardImpl,
})
export const OLD_E58_AnimalYard_impl = OLD_E58_AnimalYard.impl
