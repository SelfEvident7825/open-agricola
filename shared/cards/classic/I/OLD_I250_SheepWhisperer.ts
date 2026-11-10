import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import {
  queueFutureMeeplesFlow,
  buildFutureEntries,
} from '../../../actions/effects/internal/future-meeples'
const CARD_ID = 'OLD_I250_SheepWhisperer'

const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state, player) =>
      queueFutureMeeplesFlow(state, {
        cardId: CARD_ID,
        playerId: player.id,
        entries: buildFutureEntries(
          state.round,
          [4, 7, 9, 11].map((offset) => ({ offset, resources: { sheep: 1 } })),
        ),
      }),
  },
} satisfies CardImpl
export const OLD_I250_SheepWhisperer = defineOccupationCard({
  meta: {
    id: 'OLD_I250_SheepWhisperer',
    originalId: 'I250_SheepWhisperer',
    gameEdition: 'classic',
    name: '驯羊人',
    deck: 'I',
    number: 250,
    desc: [
      '将当前回合数加4,7,9,11，在这些回合的行动格上各放1只羊。这些回合开始时，你获得对应的羊。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '4+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I250.png',
  },
  impl: cardImpl,
})
export const OLD_I250_SheepWhisperer_impl = OLD_I250_SheepWhisperer.impl
