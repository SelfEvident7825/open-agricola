import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import {
  queueFutureMeeples,
  futureMeeplesNode,
} from '../../../actions/effects/internal/future-meeples'
const CARD_ID = 'OLD_E57_Dovecote'
const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state, player) => {
      const entries = [10, 11, 12, 13, 14]
        .filter((round) => round > state.round && round <= 14)
        .map((round) => ({
          round,
          resources: { food: 1 },
        }))
      if (!entries.length) return
      queueFutureMeeples(state, {
        cardId: CARD_ID,
        playerId: player.id,
        entries,
      })
      return futureMeeplesNode()
    },
  },
} satisfies CardImpl
export const OLD_E57_Dovecote = defineMinorCard({
  meta: {
    id: 'OLD_E57_Dovecote',
    originalId: 'E57_Dovecote',
    gameEdition: 'classic',
    name: '鸽舍',
    deck: 'E',
    number: 57,
    desc: ['打出此卡时，在第10至14回合行动格上各放1份食物。这些回合开始时，你获得对应的食物。'],
    cost: {
      stone: 2,
    },
    vp: 2,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E57.png',
    locales: {
      zh: {
        name: '鸽舍',
        desc: ['打出此卡时，在第10至14回合行动格上各放1份食物。这些回合开始时，你获得对应的食物。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E57_Dovecote_impl = OLD_E57_Dovecote.impl
