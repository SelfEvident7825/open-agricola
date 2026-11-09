import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { queueFutureMeeplesFlow } from '../../../actions/effects/internal/future-meeples'
const CARD_ID = 'OLD_I72_GoosePond'

const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state, player) =>
      queueFutureMeeplesFlow(state, {
        cardId: CARD_ID,
        playerId: player.id,
        startRound: state.round + 1,
        count: 4,
        resources: { food: 1 },
      }),
  },
} satisfies CardImpl
export const OLD_I72_GoosePond = defineMinorCard({
  meta: {
    id: 'OLD_I72_GoosePond',
    originalId: 'I72_GoosePond',
    gameEdition: 'classic',
    name: '鹅塘',
    deck: 'I',
    number: 72,
    desc: ['打出此卡后，在之后的4个回合行动格上各放1份食物。这些回合开始时，你获得对应的食物。'],
    cost: {},
    vp: 1,
    prerequisite: '3 Occupations',
    occupationPrerequisites: {
      min: 3,
    },
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I72.png',
    locales: {
      zh: {
        name: '鹅塘',
        desc: [
          '打出此卡后，在之后的4个回合行动格上各放1份食物。这些回合开始时，你获得对应的食物。',
        ],
        prerequisite: '职业×3',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_I72_GoosePond_impl = OLD_I72_GoosePond.impl
