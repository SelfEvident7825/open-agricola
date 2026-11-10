import { defineMinorCard } from '../../card-source'
import { getAssignedAnimalsByType } from '../../../domain/animals'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K135_Horse'
const cardImpl = {
  effect: {
    id: CARD_ID,
    computeBonusScore: (state, player) => {
      const animals = getAssignedAnimalsByType(player, state)
      return animals.sheep === 0 || animals.boar === 0 || animals.cattle === 0 ? 2 : 0
    },
  },
} satisfies CardImpl

export const OLD_K135_Horse = defineMinorCard({
  meta: {
    id: 'OLD_K135_Horse',
    originalId: 'K135_Horse',
    gameEdition: 'classic',
    name: '马',
    deck: 'K',
    number: 135,
    desc: [
      '游戏结束时，如果你缺少某1种动物，你可以获得2分。(仍然会因为没有该种动物扣分)（缺少多种动物，也只获得2分）',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: true,
    implemented: true,
    artUrl: '/assets/classic/K/K135.png',
  },
  impl: cardImpl,
})
export const OLD_K135_Horse_impl = OLD_K135_Horse.impl
