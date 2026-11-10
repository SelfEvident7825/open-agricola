import { defineOccupationCard } from '../../card-source'
import { queueFutureMeeplesFlow } from '../../../actions/effects/internal/future-meeples'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K283_WoodDeliveryman'
const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state, player) => queueFutureMeeplesFlow(
      state,
      {
        cardId: CARD_ID,
        playerId: player.id,
        entries: [8, 9, 10, 11, 12, 13, 14]
          .filter(round => round > state.round)
          .map(round => ({ round, resources: { wood: 1 } })),
      }
    ),
  },
} satisfies CardImpl

export const OLD_K283_WoodDeliveryman = defineOccupationCard({
  meta: {
    id: 'OLD_K283_WoodDeliveryman',
    originalId: 'K283_WoodDeliveryman',
    gameEdition: 'classic',
    name: '运木工',
    deck: 'K',
    number: 283,
    desc: [
      '在第8至14回合中尚未开启的回合行动格上各放置1根木头。这些回合开始时，你获得对应的木头。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K283.png',
  },
  impl: cardImpl,
})
