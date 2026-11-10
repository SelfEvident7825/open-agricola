import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { getCardDefinition } from '../../catalog'
import { countRoomAnimals } from '../../../domain/animals'

const CARD_ID = 'OLD_K124_Yoke'

const cardImpl = {
  prerequisiteCheck: player => countRoomAnimals(player, 'cattle') + player.pastures.reduce((total, pasture) => total + (pasture.animalCounts?.cattle ?? (pasture.animalType === 'cattle' ? pasture.animalCount : 0)), 0) +
    Object.values(player.stableAnimals ?? {}).reduce((total, animals) => total + (animals.animalType === 'cattle' ? animals.animalCount : 0), 0) >= 1,
  effect: {
    id: CARD_ID,
    onBuy: state => {
      const count = state.players.flatMap(player => player.minorPlayed).filter(id => getCardDefinition(id)?.plowEffect).length
      if (!count) return
      return {
        type: 'seq', children: Array.from({ length: count }, () => ({
          type: 'leaf' as const,
          actionId: 'plow',
          optional: true,
          sourceCard: CARD_ID,
        }))
      }
    },
  },
} satisfies CardImpl

export const OLD_K124_Yoke = defineMinorCard({
  meta: {
    id: 'OLD_K124_Yoke',
    originalId: 'K124_Yoke',
    gameEdition: 'classic',
    name: '轭具',
    deck: 'K',
    number: 124,
    desc: ['打出此卡时，场上每有1个犁或I68耙，你就能立即犁1块田。'],
    cost: {
      wood: 1,
    },
    vp: 0,
    prerequisite: '牛×1',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K124.png',
    locales: {
      zh: {
        name: '轭具',
        desc: ['打出此卡时，场上每有1个犁或I68耙，你就能立即犁1块田。'],
        prerequisite: '牛×1',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_K124_Yoke_impl = OLD_K124_Yoke.impl
