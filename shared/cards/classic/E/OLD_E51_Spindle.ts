import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { gainLeaf } from '../../helpers/pay-gain-node'
const CARD_ID = 'OLD_E51_Spindle'
const cardImpl = {
  effect: {
    id: CARD_ID,
    onHarvestFieldPhase: (_state, player) => {
      const food = player.resources.sheep >= 5 ? 2 : player.resources.sheep >= 3 ? 1 : 0
      if (food) return gainLeaf(CARD_ID, { food })
    },
  },
} satisfies CardImpl
export const OLD_E51_Spindle = defineMinorCard({
  meta: {
    id: 'OLD_E51_Spindle',
    originalId: 'E51_Spindle',
    gameEdition: 'classic',
    name: '纺锤',
    deck: 'E',
    number: 51,
    desc: [
      '每个丰收时节的收割阶段，你有3/5+只羊，额外获得1/2份食物。(卡牌提供的“收割阶段”不算，如：I92肥料)',
    ],
    cost: {
      wood: 1,
    },
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E51.png',
    locales: {
      zh: {
        name: '纺锤',
        desc: [
          '每个丰收时节的收割阶段，你有3/5+只羊，额外获得1/2份食物。(卡牌提供的“收割阶段”不算，如：I92肥料)',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E51_Spindle_impl = OLD_E51_Spindle.impl
