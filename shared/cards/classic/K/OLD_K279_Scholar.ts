import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K279_Scholar'
const cardImpl = {
  effect: {
    id: CARD_ID,
    stageEligibility: { onRoundStart: (_state, player) => player.houseType === 'stone' },
    onRoundStart: (_state, player, ctx) => {
      if (!ctx?.roundPreparation && player.houseType !== 'stone') return
      return {
        type: 'xor',
        optional: true,
        children: [
          {
            type: 'leaf',
            actionId: 'occupation',
            sourceCard: CARD_ID,
            params: { exactCost: { food: 1 } },
          },
          {
            type: 'leaf',
            actionId: 'improvement',
            sourceCard: CARD_ID,
            actionContext: { types: ['major', 'minor'], trueAction: false },
          },
        ],
      }
    },
  },
} satisfies CardImpl

export const OLD_K279_Scholar = defineOccupationCard({
  meta: {
    id: 'OLD_K279_Scholar',
    originalId: 'K279_Scholar',
    gameEdition: 'classic',
    name: '博学士',
    deck: 'K',
    number: 279,
    desc: [
      '一旦你的房屋等级是石屋，你可在每回合开始时支付1份食物作为技能培训费打出1张职业卡，或打出1张发展卡（需要满足条件照常支付费用）。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K279.png',
    locales: {
      zh: {
        name: '博学士',
        desc: [
          '一旦你的房屋等级是石屋，你可在每回合开始时支付1份食物作为技能培训费打出1张职业卡，或打出1张发展卡（需要满足条件照常支付费用）。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
