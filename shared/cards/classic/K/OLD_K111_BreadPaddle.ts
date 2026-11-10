import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K111_BreadPaddle'

const cardImpl = {
  listeners: [
    {
      id: CARD_ID + '-occupation-bake',
      cardIds: [CARD_ID],
      actions: ['occupation'],
      phases: ['after'],
      handler: context => context.actionEvents?.some(event => event.type === 'card.played')
        ? {
          sourceCard: CARD_ID,
          flow: {
            type: 'leaf',
            actionId: 'bake-bread',
            optional: true,
            sourceCard: CARD_ID,
          },
        }
        : undefined,
    },
  ],
} satisfies CardImpl

export const OLD_K111_BreadPaddle = defineMinorCard({
  meta: {
    id: 'OLD_K111_BreadPaddle',
    originalId: 'K111_BreadPaddle',
    gameEdition: 'classic',
    name: '面包托铲',
    deck: 'K',
    number: 111,
    desc: ['每当你打出1张职业卡后，额外获得1次“烤面包”行动。'],
    cost: {
      wood: 1,
    },
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K111.png',
  },
  impl: cardImpl,
})

export const OLD_K111_BreadPaddle_impl = OLD_K111_BreadPaddle.impl
