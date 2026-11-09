import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { gainLeaf } from '../../helpers/pay-gain-node'
const CARD_ID = 'OLD_I257_StreetMusician'

const cardImpl = {
  listeners: [
    {
      id: CARD_ID + '-grain',
      cardIds: [CARD_ID],
      actionSpaces: ['traveling-players'],
      phases: ['after'],
      scope: 'opponent',
      handler: () => ({
        sourceCard: CARD_ID,
        flow: gainLeaf(CARD_ID, { grain: 1 }),
      }),
    },
  ],
} satisfies CardImpl
export const OLD_I257_StreetMusician = defineOccupationCard({
  meta: {
    id: 'OLD_I257_StreetMusician',
    originalId: 'I257_StreetMusician',
    gameEdition: 'classic',
    name: '街头乐手',
    deck: 'I',
    number: 257,
    desc: ['每当其他玩家使用卖艺积累行动格时，你获得1份小麦'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '3+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I257.png',
    locales: {
      zh: {
        name: '街头乐手',
        desc: ['每当其他玩家使用卖艺积累行动格时，你获得1份小麦'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_I257_StreetMusician_impl = OLD_I257_StreetMusician.impl
