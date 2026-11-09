import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { gainLeaf } from '../../helpers/pay-gain-node'
const CARD_ID = 'OLD_E206_Swineherd'
const cardImpl = {
  listeners: [
    {
      id: CARD_ID + '-space',
      cardIds: [CARD_ID],
      actionSpaces: 'all',
      phases: ['before'],
      handler: (context) => {
        if (!(context.space?.id === 'pig-market')) return
        return {
          flow: gainLeaf(CARD_ID, { boar: 1 }),
          sourceCard: CARD_ID,
        }
      },
    },
  ],
} satisfies CardImpl
export const OLD_E206_Swineherd = defineOccupationCard({
  meta: {
    id: 'OLD_E206_Swineherd',
    originalId: 'E206_Swineherd',
    gameEdition: 'classic',
    name: '猪倌',
    deck: 'E',
    number: 206,
    desc: ['每当你使用猪市场积累行动格时，你额外获得1头猪。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '4+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E206.png',
    locales: {
      zh: {
        name: '猪倌',
        desc: ['每当你使用猪市场积累行动格时，你额外获得1头猪。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E206_Swineherd_impl = OLD_E206_Swineherd.impl
