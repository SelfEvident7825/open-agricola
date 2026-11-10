import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { playerHasCardCapability } from '../../helpers/card-type'

const CARD_ID = 'OLD_K125_Broom'

const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (_state, player) => ({
      type: 'seq', children: [
        {
          type: 'leaf',
          actionId: 'draw-ordinary-cards',
          sourceCard: CARD_ID,
          params: {
            cardType: 'minor',
            count: 7,
            replaceHand: !playerHasCardCapability(player, 'preventsHandDiscard'),
          },
        },
        {
          type: 'leaf',
          actionId: 'improvement',
          optional: true,
          sourceCard: CARD_ID,
          actionContext: { types: ['minor'] },
        },
      ],
    }),
  },
} satisfies CardImpl

export const OLD_K125_Broom = defineMinorCard({
  meta: {
    id: 'OLD_K125_Broom',
    originalId: 'K125_Broom',
    gameEdition: 'classic',
    name: '扫帚',
    deck: 'K',
    number: 125,
    desc: [
      '打出此卡时，立即弃掉你手中所有未打出的次要发展卡，从牌库中重新抽7张。然后你可以立即打出1张次要发展卡。(需满足条件并正常支付费用)',
    ],
    cost: {
      wood: 1,
    },
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K125.png',
    locales: {
      zh: {
        name: '扫帚',
        desc: [
          '打出此卡时，立即弃掉你手中所有未打出的次要发展卡，从牌库中重新抽7张。然后你可以立即打出1张次要发展卡。(需满足条件并正常支付费用)',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_K125_Broom_impl = OLD_K125_Broom.impl
