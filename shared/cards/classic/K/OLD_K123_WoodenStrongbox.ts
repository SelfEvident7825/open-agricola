import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K123_WoodenStrongbox'

const cardImpl = {
  effect: {
    id: CARD_ID,
    computeBonusScore: (_state, player) => player.roomTiles.length >= 6 ? 4 : player.roomTiles.length >= 5 ? 2 : 0,
  },
} satisfies CardImpl

export const OLD_K123_WoodenStrongbox = defineMinorCard({
  meta: {
    id: 'OLD_K123_WoodenStrongbox',
    originalId: 'K123_WoodenStrongbox',
    gameEdition: 'classic',
    name: '木制保险箱',
    deck: 'K',
    number: 123,
    desc: ['游戏结束时，如果你有5/6+个房间板块，额外获得2/4分。'],
    cost: {
      wood: 1,
    },
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: true,
    implemented: true,
    artUrl: '/assets/classic/K/K123.png',
  },
  impl: cardImpl,
})

export const OLD_K123_WoodenStrongbox_impl = OLD_K123_WoodenStrongbox.impl
