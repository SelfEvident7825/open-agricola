import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { queueFutureMeeplesFlow } from '../../../actions/effects/internal/future-meeples'

const CARD_ID = 'OLD_K302_PigWhisperer'
const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state, player) => queueFutureMeeplesFlow(state, {
      cardId: CARD_ID,
      playerId: player.id,
      entries: [4, 7, 10]
        .map(offset => ({ round: state.round + offset, resources: { boar: 1 } }))
        .filter(entry => entry.round <= 14),
    }),
  },
} satisfies CardImpl

export const OLD_K302_PigWhisperer = defineOccupationCard({
  meta: {
    id: 'OLD_K302_PigWhisperer',
    originalId: 'K302_PigWhisperer',
    gameEdition: 'classic',
    name: '驯猪人',
    deck: 'K',
    number: 302,
    desc: [
      '将当前回合数加4、7和10，在这些回合的行动格上各放置1只猪。这些回合开始时，你获得对应的猪。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '3+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K302.png',
    locales: {
      zh: {
        name: '驯猪人',
        desc: [
          '将当前回合数加4、7和10，在这些回合的行动格上各放置1只猪。这些回合开始时，你获得对应的猪。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_K302_PigWhisperer_impl = OLD_K302_PigWhisperer.impl
