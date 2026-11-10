// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
import { getWorkPhaseBuildingResources } from '../../../session/work-phase-resources'
import { writeCardInfobox } from '../../helpers/card-state'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_NL030_DutchClaypipe'

const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state, player) => {
      const totalBuilding = getWorkPhaseBuildingResources(state, player.id)
      writeCardInfobox(player, CARD_ID, `${totalBuilding} / 7`)
    },
    onReturnHome: (state, player) => {
      const totalBuilding = getWorkPhaseBuildingResources(state, player.id)
      writeCardInfobox(player, CARD_ID, '0 / 7')
      if (totalBuilding < 7) return
      return {
        type: 'seq',
        children: [{ type: 'leaf', actionId: 'gain', params: { food: 2 }, sourceCard: CARD_ID }],
      }
    },
  },
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_NL030_DutchClaypipe = defineMinorCard({
  meta: {
    id: 'OLD_NL030_DutchClaypipe',
    name: '陶制烟斗',
    deck: 'NL',
    number: 30,
    category: 'FOOD_PROVIDER',
    desc: ['在每回合的回家阶段，若你在当回合工作阶段获得了不少于7份建筑资源，则你获得2份食物'],
    cost: {
      clay: 1,
    },
    originalId: 'NL030_DutchClaypipe',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/NL/NL030.png',
  },
  impl: cardImpl,
})

export const OLD_NL030_DutchClaypipe_impl = OLD_NL030_DutchClaypipe.impl
