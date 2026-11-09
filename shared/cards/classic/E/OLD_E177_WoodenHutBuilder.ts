import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E177_WoodenHutBuilder'
const cardImpl = {
  effect: {
    id: CARD_ID,
    computeBonusScore: (_state, player, _ctx) => (player.houseType === 'wood' ? player.rooms : 0),
  },
} satisfies CardImpl
export const OLD_E177_WoodenHutBuilder = defineOccupationCard({
  meta: {
    id: 'OLD_E177_WoodenHutBuilder',
    originalId: 'E177_WoodenHutBuilder',
    gameEdition: 'classic',
    name: '木屋建筑工',
    deck: 'E',
    number: 177,
    desc: ['游戏结束时，你所拥有的每间木屋都额外获得1分。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '3+',
    passing: false,
    extraVp: true,
    implemented: true,
    artUrl: '/assets/classic/E/E177.png',
    locales: {
      zh: {
        name: '木屋建筑工',
        desc: ['游戏结束时，你所拥有的每间木屋都额外获得1分。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E177_WoodenHutBuilder_impl = OLD_E177_WoodenHutBuilder.impl
