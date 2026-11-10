import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import {
  queueFutureMeeples,
  futureMeeplesNode,
} from '../../../actions/effects/internal/future-meeples'
import type { GameState, PlayerState } from '../../../contract/types'
import { readCardExtraData, writeCardExtraData } from '../../helpers/card-state'

const CARD_ID = 'OLD_K298_ShepherdBoy'
const queue = (state: GameState, player: PlayerState) => {
  if (player.houseType !== 'stone' || readCardExtraData(player, CARD_ID, 'queued')) return
  writeCardExtraData(player, CARD_ID, 'queued', true)
  queueFutureMeeples(state, {
    cardId: CARD_ID,
    playerId: player.id,
    entries: Array.from({ length: Math.max(0, 14 - state.round) }, (_, i) => ({
      round: state.round + i + 1,
      resources: { sheep: 1 },
    })),
  })
  return futureMeeplesNode()
}
const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: queue,
    onRoundStart: queue,
  },
  listeners: [
    {
      id: CARD_ID + '-renovate',
      cardIds: [CARD_ID],
      actions: ['renovate-house'],
      phases: ['after'],
      handler: () => ({
        sourceCard: CARD_ID,
        flow: {
          type: 'leaf',
          actionId: 'activate-card-effect',
          sourceCard: CARD_ID,
          params: {
            cardId: CARD_ID,
            hook: 'onBuy',
          },
        },
      }),
    },
  ],
} satisfies CardImpl

export const OLD_K298_ShepherdBoy = defineOccupationCard({
  meta: {
    id: 'OLD_K298_ShepherdBoy',
    originalId: 'K298_ShepherdBoy',
    gameEdition: 'classic',
    name: '放羊的男孩',
    deck: 'K',
    number: 298,
    desc: [
      '一旦你的房屋等级是石屋，在之后回合的行动格上各放置1只羊。这些回合开始时，你获得对应的羊。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '3+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K298.png',
  },
  impl: cardImpl,
})

export const OLD_K298_ShepherdBoy_impl = OLD_K298_ShepherdBoy.impl
