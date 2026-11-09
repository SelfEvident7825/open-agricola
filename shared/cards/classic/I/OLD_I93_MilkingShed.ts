import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { gainLeaf } from '../../helpers/pay-gain-node'
const CARD_ID = 'OLD_I93_MilkingShed'

const cardImpl = {
  effect: {
    id: CARD_ID,
    onHarvestFieldPhase: (state) => {
      const sheep = state.players.reduce((n, p) => n + p.resources.sheep, 0)
      const cattle = state.players.reduce((n, p) => n + p.resources.cattle, 0)
      const food = Math.floor(sheep / 5) + Math.floor(cattle / 3)
      return food ? gainLeaf(CARD_ID, { food }) : undefined
    },
  },
} satisfies CardImpl
export const OLD_I93_MilkingShed = defineMinorCard({
  meta: {
    id: 'OLD_I93_MilkingShed',
    originalId: 'I93_MilkingShed',
    gameEdition: 'classic',
    name: '挤奶棚',
    deck: 'I',
    number: 93,
    desc: [
      '每个丰收时节的收割阶段开始时，计算所有玩家农场中的羊和牛的总数，每有5只羊/3头牛，你额外获得1份食物。(卡牌提供的“收割阶段”不算，如：I92肥料)',
    ],
    cost: {
      clay: 2,
      stone: 3,
    },
    vp: 2,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I93.png',
    locales: {
      zh: {
        name: '挤奶棚',
        desc: [
          '每个丰收时节的收割阶段开始时，计算所有玩家农场中的羊和牛的总数，每有5只羊/3头牛，你额外获得1份食物。(卡牌提供的“收割阶段”不算，如：I92肥料)',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_I93_MilkingShed_impl = OLD_I93_MilkingShed.impl
