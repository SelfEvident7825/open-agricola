import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K144_Mansion'
const cardImpl = {
  effect: {
    id: CARD_ID,
    computeBonusScore: (_state, player) => player.houseType === 'stone' ? 2 * player.rooms : 0,
  },
} satisfies CardImpl

export const OLD_K144_Mansion = defineMinorCard({
  meta: {
    id: 'OLD_K144_Mansion',
    originalId: 'K144_Mansion',
    gameEdition: 'classic',
    name: '豪宅',
    deck: 'K',
    number: 144,
    desc: ['游戏结束时，你的每间石屋都额外获得2分。'],
    cost: {
      wood: 3,
      clay: 3,
      stone: 3,
      reed: 2,
    },
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: true,
    implemented: true,
    artUrl: '/assets/classic/K/K144.png',
    locales: {
      zh: {
        name: '豪宅',
        desc: ['游戏结束时，你的每间石屋都额外获得2分。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_K144_Mansion_impl = OLD_K144_Mansion.impl
