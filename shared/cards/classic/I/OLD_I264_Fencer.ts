import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { createEventQuery } from '../../../events/query'
import { gainLeaf } from '../../helpers/pay-gain-node'
const CARD_ID = 'OLD_I264_Fencer'

const cardImpl = {
  listeners: [
    {
      id: CARD_ID + '-fences',
      cardIds: [CARD_ID],
      actions: ['fence'],
      phases: ['after'],
      scope: 'opponent',
      handler: (context) => {
        const count = createEventQuery(context.actionEvents ?? [])
          .filter('farm.fenceBuilt')
          .reduce((n, e) => n + e.fences.length, 0)
        return count
          ? {
              sourceCard: CARD_ID,
              flow: gainLeaf(CARD_ID, { wood: count >= 5 ? 2 : 1 }),
            }
          : undefined
      },
    },
  ],
} satisfies CardImpl
export const OLD_I264_Fencer = defineOccupationCard({
  meta: {
    id: 'OLD_I264_Fencer',
    originalId: 'I264_Fencer',
    gameEdition: 'classic',
    name: '筑篱工',
    deck: 'I',
    number: 264,
    desc: ['每当其他玩家建造1-4/5+根栅栏时，你额外获得1/2根木头。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '3+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I264.png',
    locales: {
      zh: {
        name: '筑篱工',
        desc: ['每当其他玩家建造1-4/5+根栅栏时，你额外获得1/2根木头。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_I264_Fencer_impl = OLD_I264_Fencer.impl
