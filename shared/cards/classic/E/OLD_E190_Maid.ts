import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import {
  queueFutureMeeples,
  futureMeeplesNode,
} from '../../../actions/effects/internal/future-meeples'
import type { GameState, PlayerState } from '../../../contract/types'
import { readCardExtraData, writeCardExtraData } from '../../helpers/card-state'
const CARD_ID = 'OLD_E190_Maid'
const queue = (state: GameState, player: PlayerState) => {
  if (player.houseType === 'wood' || readCardExtraData(player, CARD_ID, 'queued')) return
  writeCardExtraData(player, CARD_ID, 'queued', true)
  queueFutureMeeples(state, {
    cardId: CARD_ID,
    playerId: player.id,
    entries: Array.from({ length: Math.max(0, 14 - state.round) }, (_, i) => ({
      round: state.round + i + 1,
      resources: { food: 1 },
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
export const OLD_E190_Maid = defineOccupationCard({
  meta: {
    id: 'OLD_E190_Maid',
    originalId: 'E190_Maid',
    gameEdition: 'classic',
    name: '女仆',
    deck: 'E',
    number: 190,
    desc: [
      '限一次：一旦你的房屋等级是砖屋/石屋，在之后每回合的行动格上各放1份食物。这些回合开始时，你获得对应的食物。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '3+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E190.png',
    locales: {
      zh: {
        name: '女仆',
        desc: [
          '限一次：一旦你的房屋等级是砖屋/石屋，在之后每回合的行动格上各放1份食物。这些回合开始时，你获得对应的食物。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E190_Maid_impl = OLD_E190_Maid.impl
