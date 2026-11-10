import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K303_StoneBreaker'
const cardImpl = {
  listeners: [{
    id: CARD_ID + '-renovate',
    cardIds: [CARD_ID],
    actions: ['anytime'],
    phases: ['anytime'],
    handler: context => context.player.houseType === 'clay' ? {
      sourceCard: CARD_ID,
      flow: { type: 'leaf', actionId: 'renovate-house', sourceCard: CARD_ID },
    } : undefined,
  }],
} satisfies CardImpl

export const OLD_K303_StoneBreaker = defineOccupationCard({
  meta: {
    id: 'OLD_K303_StoneBreaker',
    originalId: 'K303_StoneBreaker',
    gameEdition: 'classic',
    name: '碎石工',
    deck: 'K',
    number: 303,
    desc: ['任意时刻，你可以将你的砖屋翻修成石屋。（正常支付费用）'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '3+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K303.png',
    locales: {
      zh: {
        name: '碎石工',
        desc: ['任意时刻，你可以将你的砖屋翻修成石屋。（正常支付费用）'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_K303_StoneBreaker_impl = OLD_K303_StoneBreaker.impl
