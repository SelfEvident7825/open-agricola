import { defineMinorCard } from '../../card-source'
import { futureMeeplesNode } from '../../../actions/effects/internal/future-meeples'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K140_SwanLake'
const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state, player) => futureMeeplesNode({
      cardId: CARD_ID,
      playerId: player.id,
      resources: { food: 1 },
      startRound: state.round + 1,
      count: 5,
    }),
  },
} satisfies CardImpl

export const OLD_K140_SwanLake = defineMinorCard({
  meta: {
    id: 'OLD_K140_SwanLake',
    originalId: 'K140_SwanLake',
    gameEdition: 'classic',
    name: '天鹅湖',
    deck: 'K',
    number: 140,
    desc: ['打出此卡时，在之后的5个回合行动格上各放1份食物。这些回合开始时，你获得对应的食物。'],
    cost: {},
    vp: 2,
    prerequisite: '4 Occupations',
    occupationPrerequisites: {
      min: 4,
    },
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K140.png',
  },
  impl: cardImpl,
})
export const OLD_K140_SwanLake_impl = OLD_K140_SwanLake.impl
