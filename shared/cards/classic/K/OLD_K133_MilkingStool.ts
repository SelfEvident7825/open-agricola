import { defineMinorCard } from '../../card-source'
import { gainLeaf } from '../../helpers/pay-gain-node'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K133_MilkingStool'
const cattleFoodIncome = (cattle: number): number => {
  if (cattle >= 5) return 3
  if (cattle >= 3) return 2
  if (cattle >= 1) return 1
  return 0
}

const cardImpl = {
  effect: {
    id: CARD_ID,
    onHarvestFieldPhase: (_state, player) => {
      const gain = cattleFoodIncome(player.resources.cattle ?? 0)
      if (gain <= 0) return
      return gainLeaf(CARD_ID, { food: gain })
    },
    computeBonusScore: (_state, player) => {
      return Math.floor(player.resources.cattle / 2)
    },
  },
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_K133_MilkingStool = defineMinorCard({
  meta: {
    id: 'OLD_K133_MilkingStool',
    name: '挤奶凳',
    deck: 'K',
    number: 133,
    category: 'POINTS_PROVIDER',
    desc: [
      '每个丰收时节的收割阶段，若你有不少于1/3/5头牛，则你获得1/2/3份食物。游戏结束时，你每拥有2头牛便能额外获得1分。（卡牌提供的收割阶段不算）',
    ],
    cost: {
      wood: 1,
    },
    prerequisite: '2 Occupations',
    occupationPrerequisites: {
      min: 2,
    },
    extraVp: true,
    originalId: 'K133_MilkingStool',
    gameEdition: 'classic',
    vp: 0,
    passing: false,
    implemented: true,
    artUrl: '/assets/classic/K/K133.png',
    locales: {
      zh: {
        name: '挤奶凳',
        desc: [
          '每个丰收时节的收割阶段，若你有不少于1/3/5头牛，则你获得1/2/3份食物。游戏结束时，你每拥有2头牛便能额外获得1分。（卡牌提供的收割阶段不算）',
        ],
        prerequisite: '职业×2',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_K133_MilkingStool_impl = OLD_K133_MilkingStool.impl
