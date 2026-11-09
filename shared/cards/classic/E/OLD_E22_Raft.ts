import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { gainLeaf } from '../../helpers/pay-gain-node'
const CARD_ID = 'OLD_E22_Raft'
const cardImpl = {
  listeners: [
    {
      id: CARD_ID + '-fishing',
      cardIds: [CARD_ID],
      actionSpaces: ['fishing'],
      phases: ['before'],
      handler: () => ({
        sourceCard: CARD_ID,
        flow: {
          type: 'xor',
          children: [gainLeaf(CARD_ID, { food: 1 }), gainLeaf(CARD_ID, { reed: 1 })],
        },
      }),
    },
  ],
} satisfies CardImpl
export const OLD_E22_Raft = defineMinorCard({
  meta: {
    id: 'OLD_E22_Raft',
    originalId: 'E22_Raft',
    gameEdition: 'classic',
    name: '木筏',
    deck: 'E',
    number: 22,
    desc: ['每当你使用钓鱼积累行动格时，额外获得1份食物/1捆芦苇。'],
    cost: {
      wood: 2,
    },
    vp: 1,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E22.png',
    locales: {
      zh: {
        name: '木筏',
        desc: ['每当你使用钓鱼积累行动格时，额外获得1份食物/1捆芦苇。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E22_Raft_impl = OLD_E22_Raft.impl
