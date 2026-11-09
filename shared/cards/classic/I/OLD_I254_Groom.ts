import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_I254_Groom'

const cardImpl = {
  effect: {
    id: CARD_ID,
    stageEligibility: {
      onRoundStart: (_state, player) => player.houseType === 'stone',
    },
    onRoundStart: (_state, player, ctx) => {
      if (!ctx?.roundPreparation && player.houseType !== 'stone') return
      return {
        type: 'leaf' as const,
        actionId: 'stables',
        sourceCard: CARD_ID,
        optional: true,
        actionContext: {
          max: 1,
          exactCost: { wood: 1, max: 1 },
        },
      }
    },
  },
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_I254_Groom = defineOccupationCard({
  meta: {
    id: 'OLD_I254_Groom',
    originalId: 'I254_Groom',
    gameEdition: 'classic',
    name: '马夫',
    deck: 'I',
    number: 254,
    desc: ['一旦你的房屋等级是石屋，你可以在每回合开始时花费1根木头来建造1个马厩。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '3+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I254.png',
    locales: {
      zh: {
        name: '马夫',
        desc: ['一旦你的房屋等级是石屋，你可以在每回合开始时花费1根木头来建造1个马厩。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_I254_Groom_impl = OLD_I254_Groom.impl
