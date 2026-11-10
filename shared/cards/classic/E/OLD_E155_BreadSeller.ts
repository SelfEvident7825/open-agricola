import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { gainLeaf } from '../../helpers/pay-gain-node'
import { createEventQuery } from '../../../events/query'
const CARD_ID = 'OLD_E155_BreadSeller'
const cardImpl = {
  listeners: [
    {
      id: CARD_ID + '-bake',
      cardIds: [CARD_ID],
      actions: ['bake-bread'],
      phases: ['after'],
      scope: 'any',
      handler: (context) => {
        const grain = createEventQuery(context.actionEvents ?? [])
          .filter('resource.exchanged')
          .reduce((n, e) => n + (e.paid.grain ?? 0), 0)
        if (grain)
          return {
            sourceCard: CARD_ID,
            flow: gainLeaf(CARD_ID, { food: grain }),
          }
      },
    },
  ],
} satisfies CardImpl
export const OLD_E155_BreadSeller = defineOccupationCard({
  meta: {
    id: 'OLD_E155_BreadSeller',
    originalId: 'E155_BreadSeller',
    gameEdition: 'classic',
    name: '面包贩',
    deck: 'E',
    number: 155,
    desc: ['每当任意玩家（包括你自己）执行“烤面包”行动时，每份被转化的小麦都使你额外获得1份食物。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E155.png',
  },
  impl: cardImpl,
})
export const OLD_E155_BreadSeller_impl = OLD_E155_BreadSeller.impl
