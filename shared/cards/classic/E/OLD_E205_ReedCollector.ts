import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import {
  queueFutureMeeples,
  futureMeeplesNode,
} from '../../../actions/effects/internal/future-meeples'
const CARD_ID = 'OLD_E205_ReedCollector'
const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state, player) => {
      const entries = [state.round + 1, state.round + 2, state.round + 3, state.round + 4]
        .filter((round) => round > state.round && round <= 14)
        .map((round) => ({
          round,
          resources: { reed: 1 },
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
export const OLD_E205_ReedCollector = defineOccupationCard({
  meta: {
    id: 'OLD_E205_ReedCollector',
    originalId: 'E205_ReedCollector',
    gameEdition: 'classic',
    name: '打苇人',
    deck: 'E',
    number: 205,
    desc: ['打出此卡时，在之后的4个回合行动格上各放1捆芦苇。这些回合开始时，你获得对应的芦苇。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '4+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E205.png',
    locales: {
      zh: {
        name: '打苇人',
        desc: [
          '打出此卡时，在之后的4个回合行动格上各放1捆芦苇。这些回合开始时，你获得对应的芦苇。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E205_ReedCollector_impl = OLD_E205_ReedCollector.impl
