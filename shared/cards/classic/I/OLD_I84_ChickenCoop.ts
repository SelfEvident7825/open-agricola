import { defineMinorCard } from '../../card-source'
import {
  queueFutureMeeples,
  futureMeeplesNode,
} from '../../../actions/effects/internal/future-meeples'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_I84_ChickenCoop'

const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state, player) => {
      queueFutureMeeples(state, {
        cardId: CARD_ID,
        playerId: player.id,
        startRound: state.round + 1,
        count: 8,
        resources: { food: 1 },
      })
      return futureMeeplesNode()
    },
  },
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_I84_ChickenCoop = defineMinorCard({
  meta: {
    id: 'OLD_I84_ChickenCoop',
    name: '鸡舍',
    deck: 'I',
    number: 84,
    category: 'FOOD_PROVIDER',
    desc: ['打出此卡时，在之后的8个回合行动格上各放1份食物。这些回合开始时，你获得对应的食物。'],
    vp: 1,
    altCosts: [
      {
        clay: 2,
        reed: 1,
      },
      {
        wood: 2,
        reed: 1,
      },
    ],
    originalId: 'I84_ChickenCoop',
    gameEdition: 'classic',
    cost: {},
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I84.png',
    locales: {
      zh: {
        name: '鸡舍',
        desc: [
          '打出此卡时，在之后的8个回合行动格上各放1份食物。这些回合开始时，你获得对应的食物。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_I84_ChickenCoop_impl = OLD_I84_ChickenCoop.impl
