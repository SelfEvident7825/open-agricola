import { defineOccupationCard } from '../../card-source'
import {
  queueFutureMeeples,
  futureMeeplesNode,
} from '../../../actions/effects/internal/future-meeples'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_I235_WoodCollector'

const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state, player) => {
      queueFutureMeeples(state, {
        cardId: CARD_ID,
        playerId: player.id,
        startRound: state.round + 1,
        count: 5,
        resources: { wood: 1 },
      })
      return futureMeeplesNode()
    },
  },
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_I235_WoodCollector = defineOccupationCard({
  meta: {
    id: 'OLD_I235_WoodCollector',
    name: '拾木工',
    deck: 'I',
    number: 235,
    category: 'BUILDING_RESOURCE_PROVIDER',
    desc: ['在之后5个回合的行动格上各放1根木头。这些回合开始时，你获得对应的木头。'],
    players: '1+',
    originalId: 'I235_WoodCollector',
    gameEdition: 'classic',
    cost: {},
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I235.png',
  },
  impl: cardImpl,
})

export const OLD_I235_WoodCollector_impl = OLD_I235_WoodCollector.impl
