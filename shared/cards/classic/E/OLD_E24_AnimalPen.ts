import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import {
  queueFutureMeeples,
  futureMeeplesNode,
} from '../../../actions/effects/internal/future-meeples'
const CARD_ID = 'OLD_E24_AnimalPen'
const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state, player) => {
      const entries = Array.from({ length: 14 }, (_, i) => i + 1)
        .filter((round) => round > state.round && round <= 14)
        .map((round) => ({
          round,
          resources: { food: 2 },
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
export const OLD_E24_AnimalPen = defineMinorCard({
  meta: {
    id: 'OLD_E24_AnimalPen',
    originalId: 'E24_AnimalPen',
    gameEdition: 'classic',
    name: '畜栏',
    deck: 'E',
    number: 24,
    desc: ['打出此卡时，在之后的每个回合行动格上各放2份食物。这些回合开始时，你获得对应的食物。'],
    cost: {
      wood: 2,
    },
    vp: 1,
    prerequisite: '4 Occupations',
    occupationPrerequisites: {
      min: 4,
    },
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E24.png',
  },
  impl: cardImpl,
})
export const OLD_E24_AnimalPen_impl = OLD_E24_AnimalPen.impl
