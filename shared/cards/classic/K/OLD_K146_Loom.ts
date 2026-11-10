import { defineMinorCard } from '../../card-source'
import { gainLeaf } from '../../helpers/pay-gain-node'
import { getAssignedAnimalsByType } from '../../../domain/animals'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K146_Loom'
const sheepFoodIncome = (sheep: number): number => {
  const map = [0, 1, 1, 1, 2, 2, 2, 3]
  return map[Math.min(sheep, 7)] ?? 3
}

const cardImpl = {
  effect: {
    id: CARD_ID,
    onHarvestFieldPhase: (state, player) => {
      const sheep = getAssignedAnimalsByType(player, state).sheep
      const gain = sheepFoodIncome(sheep)
      if (gain <= 0) return
      return gainLeaf(CARD_ID, { food: gain })
    },
    computeBonusScore: (state, player) => {
      const sheep = getAssignedAnimalsByType(player, state).sheep
      return Math.floor(sheep / 3)
    },
  },
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_K146_Loom = defineMinorCard({
  meta: {
    id: 'OLD_K146_Loom',
    name: '织布机',
    deck: 'K',
    number: 146,
    category: 'POINTS_PROVIDER',
    desc: [
      '每个丰收时节的收割阶段，若你有不少于1/4/7只羊，则你获得1/2/3份食物。游戏结束时，你每拥有3只羊便能额外获得1分。（卡牌提供的收割阶段不算）',
    ],
    cost: {
      wood: 2,
    },
    prerequisite: '2 Occupations',
    occupationPrerequisites: {
      min: 2,
    },
    vp: 1,
    extraVp: false,
    originalId: 'K146_Loom',
    gameEdition: 'classic',
    passing: false,
    implemented: true,
    artUrl: '/assets/classic/K/K146.png',
  },
  impl: cardImpl,
})

export const OLD_K146_Loom_impl = OLD_K146_Loom.impl
