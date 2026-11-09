import { defineMinorCard } from '../../card-source'
import { queueFutureMeeplesFlow } from '../../../actions/effects/internal/future-meeples'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E46_SackCart'
const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state, player) => {
      return queueFutureMeeplesFlow(state, {
        cardId: CARD_ID,
        playerId: player.id,
        entries: [
          {
            round: 5,
            resources: { grain: 1 },
          },
          {
            round: 8,
            resources: { grain: 1 },
          },
          {
            round: 11,
            resources: { grain: 1 },
          },
          {
            round: 14,
            resources: { grain: 1 },
          },
        ].filter((e) => e.round > state.round),
      })
    },
  },
  reaches: [] as readonly string[],
} satisfies CardImpl
export const OLD_E46_SackCart = defineMinorCard({
  meta: {
    id: 'OLD_E46_SackCart',
    name: '运粮推车',
    deck: 'E',
    number: 46,
    category: 'CROP_PROVIDER',
    desc: ['打出此卡时，在第5,8,11,14回合行动格上各放1份小麦。这些回合开始时，你获得对应的小麦。'],
    cost: {
      wood: 2,
    },
    prerequisite: '2 Occupations',
    occupationPrerequisites: {
      min: 2,
    },
    originalId: 'E46_SackCart',
    gameEdition: 'classic',
    vp: 0,
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E46.png',
    locales: {
      zh: {
        name: '运粮推车',
        desc: [
          '打出此卡时，在第5,8,11,14回合行动格上各放1份小麦。这些回合开始时，你获得对应的小麦。',
        ],
        prerequisite: '职业×2',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E46_SackCart_impl = OLD_E46_SackCart.impl
