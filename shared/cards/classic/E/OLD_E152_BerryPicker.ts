import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { gainLeaf } from '../../helpers/pay-gain-node'
import { createEventQuery } from '../../../events/query'
const CARD_ID = 'OLD_E152_BerryPicker'
const cardImpl = {
  listeners: [
    {
      id: CARD_ID + '-collect',
      cardIds: [CARD_ID],
      actionSpaces: 'all',
      phases: ['after'],
      handler: (context) => {
        const taken = createEventQuery(context.actionEvents ?? []).filter(
          'resource.moved',
          (e) =>
            e.from.kind === 'actionSpace' &&
            e.to.kind === 'player' &&
            e.to.playerId === context.player.id &&
            (e.resources.wood ?? 0) > 0,
        )
        if (!taken.length) return
        return {
          sourceCard: CARD_ID,
          flow: gainLeaf(CARD_ID, { food: 1 }),
        }
      },
    },
  ],
} satisfies CardImpl
export const OLD_E152_BerryPicker = defineOccupationCard({
  meta: {
    id: 'OLD_E152_BerryPicker',
    originalId: 'E152_BerryPicker',
    gameEdition: 'classic',
    name: '采莓工',
    deck: 'E',
    number: 152,
    desc: ['每当你从行动格上获得木头时，你额外获得1份食物。（通过卡牌获得的木头不算）'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E152.png',
    locales: {
      zh: {
        name: '采莓工',
        desc: ['每当你从行动格上获得木头时，你额外获得1份食物。（通过卡牌获得的木头不算）'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E152_BerryPicker_impl = OLD_E152_BerryPicker.impl
