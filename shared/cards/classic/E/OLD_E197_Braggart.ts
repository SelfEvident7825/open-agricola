import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E197_Braggart'
const cardImpl = {
  effect: {
    id: CARD_ID,
    computeBonusScore: (_state, player, _ctx) =>
      Math.min(
        9,
        Math.max(0, (player.improvements.length + player.minorPlayed.length - 4) * 2 - 1),
      ),
  },
} satisfies CardImpl
export const OLD_E197_Braggart = defineOccupationCard({
  meta: {
    id: 'OLD_E197_Braggart',
    originalId: 'E197_Braggart',
    gameEdition: 'classic',
    name: '吹牛大王',
    deck: 'E',
    number: 197,
    desc: ['游戏结束时，若你场上拥有5/6/7/8/9+张发展卡，则你可获得1/3/5/7/9分。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '4+',
    passing: false,
    extraVp: true,
    implemented: true,
    artUrl: '/assets/classic/E/E197.png',
    locales: {
      zh: {
        name: '吹牛大王',
        desc: ['游戏结束时，若你场上拥有5/6/7/8/9+张发展卡，则你可获得1/3/5/7/9分。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E197_Braggart_impl = OLD_E197_Braggart.impl
