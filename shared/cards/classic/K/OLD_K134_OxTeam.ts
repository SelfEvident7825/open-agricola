import { defineMinorCard } from '../../card-source'
import { getAssignedAnimalsByType } from '../../../domain/animals'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K134_OxTeam'
const cardImpl = {
  prerequisiteCheck: (player, state) => getAssignedAnimalsByType(player, state).cattle >= 2,
  effect: {
    id: CARD_ID,
    onBuy: state => {
      const max = Math.min(3, 14 - state.round)
      if (max <= 0) return
      return {
        type: 'seq',
        children: Array.from({ length: max }, () => ({
          type: 'leaf', actionId: 'plow', optional: true, sourceCard: CARD_ID,
        })),
      }
    },
  },
} satisfies CardImpl

export const OLD_K134_OxTeam = defineMinorCard({
  meta: {
    id: 'OLD_K134_OxTeam',
    originalId: 'K134_OxTeam',
    gameEdition: 'classic',
    name: '公牛挽具',
    deck: 'K',
    number: 134,
    desc: ['打出此卡时，计算剩余的完整回合数。你可以立即犁相等数量的田地板块，且至多3块。'],
    cost: {
      wood: 3,
    },
    vp: 1,
    prerequisite: '牛×2',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K134.png',
    locales: {
      zh: {
        name: '公牛挽具',
        desc: ['打出此卡时，计算剩余的完整回合数。你可以立即犁相等数量的田地板块，且至多3块。'],
        prerequisite: '牛×2',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_K134_OxTeam_impl = OLD_K134_OxTeam.impl
