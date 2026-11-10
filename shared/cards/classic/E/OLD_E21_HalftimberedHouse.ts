import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E21_HalftimberedHouse'
const cardImpl = {
  effect: {
    id: CARD_ID,
    computeBonusScore: (_state, player) => {
      return player.houseType === 'stone' && !player.minorPlayed.includes('OLD_K144_Mansion')
        ? player.rooms
        : 0
    },
  },
  reaches: ['OLD_K144_Mansion'] as readonly string[],
} satisfies CardImpl
export const OLD_E21_HalftimberedHouse = defineMinorCard({
  meta: {
    id: 'OLD_E21_HalftimberedHouse',
    name: '半木梁房',
    deck: 'E',
    number: 21,
    category: 'POINTS_PROVIDER',
    desc: ['游戏结束时，你的每间石屋都额外获得1分。'],
    cost: {
      wood: 1,
      clay: 1,
      stone: 2,
      reed: 1,
    },
    extraVp: true,
    originalId: 'E21_HalftimberedHouse',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    implemented: true,
    artUrl: '/assets/classic/E/E21.png',
  },
  impl: cardImpl,
})
export const OLD_E21_HalftimberedHouse_impl = OLD_E21_HalftimberedHouse.impl
