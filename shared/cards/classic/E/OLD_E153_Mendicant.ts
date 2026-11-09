import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { payLeaf } from '../../helpers/pay-gain-node'
const CARD_ID = 'OLD_E153_Mendicant'
const cardImpl = {
  effect: {
    id: CARD_ID,
    onBeforeEndGame: (_state, player) => {
      const amount = Math.min(2, player.resources.begging)
      if (amount > 0)
        return payLeaf({
          cardId: CARD_ID,
          cost: { begging: amount },
        })
    },
  },
} satisfies CardImpl
export const OLD_E153_Mendicant = defineOccupationCard({
  meta: {
    id: 'OLD_E153_Mendicant',
    originalId: 'E153_Mendicant',
    gameEdition: 'classic',
    name: '乞丐',
    deck: 'E',
    number: 153,
    desc: ['游戏结束时，你可以弃掉至多2张乞讨卡。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E153.png',
    locales: {
      zh: {
        name: '乞丐',
        desc: ['游戏结束时，你可以弃掉至多2张乞讨卡。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E153_Mendicant_impl = OLD_E153_Mendicant.impl
