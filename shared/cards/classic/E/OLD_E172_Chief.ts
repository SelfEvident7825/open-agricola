import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E172_Chief'
const cardImpl = {
  effect: {
    id: CARD_ID,
    computeBonusScore: (_state, player, _ctx) => (player.houseType === 'stone' ? player.rooms : 0),
  },
} satisfies CardImpl
export const OLD_E172_Chief = defineOccupationCard({
  meta: {
    id: 'OLD_E172_Chief',
    originalId: 'E172_Chief',
    gameEdition: 'classic',
    name: '酋长',
    deck: 'E',
    number: 172,
    desc: ['打出此卡时，额外支付2份食物。游戏结束时，你的每间石屋都额外获得1分。'],
    cost: { food: 2 },
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: true,
    implemented: true,
    artUrl: '/assets/classic/E/E172.png',
    locales: {
      zh: {
        name: '酋长',
        desc: ['打出此卡时，额外支付2份食物。游戏结束时，你的每间石屋都额外获得1分。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E172_Chief_impl = OLD_E172_Chief.impl
