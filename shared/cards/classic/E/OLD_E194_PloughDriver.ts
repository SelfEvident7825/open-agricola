import { defineOccupationCard } from '../../card-source'
import { payLeaf } from '../../helpers/pay-gain-node'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E194_PloughDriver'
const cardImpl = {
  effect: {
    id: CARD_ID,
    stageEligibility: { onRoundStart: (_state, player) => player.houseType === 'stone' },
    onRoundStart: (_state, player, ctx) => {
      if (!ctx?.roundPreparation && player.houseType !== 'stone') return
      if ((player.resources.food ?? 0) < 1) return
      return {
        type: 'seq',
        optional: true,
        children: [
          payLeaf({
            cardId: CARD_ID,
            cost: { food: 1 },
          }),
          {
            type: 'leaf',
            actionId: 'plow',
            sourceCard: CARD_ID,
          },
        ],
      }
    },
  },
  reaches: [] as readonly string[],
} satisfies CardImpl
export const OLD_E194_PloughDriver = defineOccupationCard({
  meta: {
    id: 'OLD_E194_PloughDriver',
    name: '驭犁者',
    deck: 'E',
    number: 194,
    category: 'FARM_PLANNER',
    desc: ['一旦你的房屋等级是石屋，你可以在每回合开始时支付1份食物来犁1块田。'],
    cost: {},
    players: '3+',
    originalId: 'E194_PloughDriver',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E194.png',
  },
  impl: cardImpl,
})
export const OLD_E194_PloughDriver_impl = OLD_E194_PloughDriver.impl
