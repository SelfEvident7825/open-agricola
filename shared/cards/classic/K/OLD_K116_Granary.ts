import { defineMinorCard } from '../../card-source'
import {
  queueFutureMeeples,
  futureMeeplesNode,
} from '../../../actions/effects/internal/future-meeples'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K116_Granary'

const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state, player) => {
      const targetRounds = [8, 10, 12].filter((r) => r > state.round)
      if (targetRounds.length === 0) return
      queueFutureMeeples(state, {
        cardId: CARD_ID,
        playerId: player.id,
        entries: targetRounds.map((round) => ({ round, resources: { grain: 1 } })),
      })
      return futureMeeplesNode()
    },
  },
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_K116_Granary = defineMinorCard({
  meta: {
    id: 'OLD_K116_Granary',
    name: '粮仓',
    deck: 'K',
    number: 116,
    category: 'CROP_PROVIDER',
    desc: ['打出此卡时，在第8,10,12回合行动格上各放1份小麦。这些回合开始时，你获得对应的小麦。'],
    vp: 0,
    altCosts: [
      {
        wood: 3,
      },
      {
        clay: 3,
      },
    ],
    originalId: 'K116_Granary',
    gameEdition: 'classic',
    cost: {},
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K116.png',
  },
  impl: cardImpl,
})

export const OLD_K116_Granary_impl = OLD_K116_Granary.impl
