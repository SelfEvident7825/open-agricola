import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E150_Baker'
const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (_state, player) => {
      if (player.resources.grain < 1) return
      return {
        type: 'leaf',
        actionId: 'bake-bread',
        optional: true,
        sourceCard: CARD_ID,
      }
    },
    onStartHarvestFeedingPhase: (_state, player) => {
      if (player.resources.grain < 1) return
      return {
        type: 'leaf',
        actionId: 'bake-bread',
        optional: true,
        sourceCard: CARD_ID,
      }
    },
  },
  reaches: [] as readonly string[],
} satisfies CardImpl
export const OLD_E150_Baker = defineOccupationCard({
  meta: {
    id: 'OLD_E150_Baker',
    name: '烘焙师',
    deck: 'E',
    number: 150,
    category: 'FOOD_PROVIDER',
    desc: ['打出此卡时，以及每个丰收时节的喂养阶段开始时，你都可以获得1次“烤面包”行动。'],
    cost: {},
    players: '1+',
    originalId: 'E150_Baker',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E150.png',
    locales: {
      zh: {
        name: '烘焙师',
        desc: ['打出此卡时，以及每个丰收时节的喂养阶段开始时，你都可以获得1次“烤面包”行动。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E150_Baker_impl = OLD_E150_Baker.impl
