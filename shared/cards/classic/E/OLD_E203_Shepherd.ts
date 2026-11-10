import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E203_Shepherd'
const cardImpl = {
  effect: {
    id: CARD_ID,
    computeBreedOffspringCount: (_state, _player, type, count, ctx) =>
      type === 'sheep' && ctx.breedableCount >= 4 ? Math.max(2, count) : undefined,
  },
} satisfies CardImpl
export const OLD_E203_Shepherd = defineOccupationCard({
  meta: {
    id: 'OLD_E203_Shepherd',
    originalId: 'E203_Shepherd',
    gameEdition: 'classic',
    name: '牧羊人',
    deck: 'E',
    number: 203,
    desc: ['每个繁殖阶段，如果你有至少4只羊，你能繁殖2只羊而不是1只。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '4+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E203.png',
    locales: {
      zh: {
        name: '牧羊人',
        desc: ['每个繁殖阶段，如果你有至少4只羊，你能繁殖2只羊而不是1只。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E203_Shepherd_impl = OLD_E203_Shepherd.impl
