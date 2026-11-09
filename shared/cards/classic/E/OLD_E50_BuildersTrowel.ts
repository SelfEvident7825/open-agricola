import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E50_BuildersTrowel'
const cardImpl = {
  listeners: [
    {
      id: CARD_ID + '-anytime',
      cardIds: [CARD_ID],
      actions: ['anytime'],
      phases: ['anytime'],
      preScoring: true,
      handler: ({ player }) =>
        player.houseType === 'wood'
          ? {
              sourceCard: CARD_ID,
              flow: {
                type: 'leaf',
                actionId: 'renovate-house',
                sourceCard: CARD_ID,
                params: { selectedOption: 'clay' },
              },
            }
          : undefined,
    },
  ],
} satisfies CardImpl
export const OLD_E50_BuildersTrowel = defineMinorCard({
  meta: {
    id: 'OLD_E50_BuildersTrowel',
    originalId: 'E50_BuildersTrowel',
    gameEdition: 'classic',
    name: '泥铲',
    deck: 'E',
    number: 50,
    desc: ['你可以随时将木屋翻修成砖屋。(正常支付翻修费用)。'],
    cost: {
      wood: 1,
    },
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E50.png',
    locales: {
      zh: {
        name: '泥铲',
        desc: ['你可以随时将木屋翻修成砖屋。(正常支付翻修费用)。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E50_BuildersTrowel_impl = OLD_E50_BuildersTrowel.impl
