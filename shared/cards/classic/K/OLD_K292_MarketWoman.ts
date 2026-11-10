import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { gainLeaf } from '../../helpers/pay-gain-node'
import { isMinorCardId } from '../../helpers/card-type'
import { createEventQuery } from '../../../events/query'

const CARD_ID = 'OLD_K292_MarketWoman'
const cardImpl = {
  listeners: [{
    id: CARD_ID + '-vegetables',
    cardIds: [CARD_ID],
    actions: ['collect', 'gain', 'receive'],
    phases: ['after'],
    handler: context => {
      const received = createEventQuery(context.actionEvents ?? []).filter('resource.moved').some(event =>
        event.to.kind === 'player' && event.to.playerId === context.player.id &&
        (event.resources.vegetable ?? 0) > 0 && (
          event.from.kind === 'actionSpace' ||
          (context.sourceCard !== CARD_ID && isMinorCardId(context.sourceCard ?? ''))
        ),
      )
      return received ? { sourceCard: CARD_ID, flow: gainLeaf(CARD_ID, { grain: 2 }) } : undefined
    },
  }],
} satisfies CardImpl

export const OLD_K292_MarketWoman = defineOccupationCard({
  meta: {
    id: 'OLD_K292_MarketWoman',
    originalId: 'K292_MarketWoman',
    gameEdition: 'classic',
    name: '女商贩',
    deck: 'K',
    number: 292,
    desc: ['每当你使用行动格或次要发展卡获得蔬菜时，你额外获得2份小麦。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K292.png',
  },
  impl: cardImpl,
})

export const OLD_K292_MarketWoman_impl = OLD_K292_MarketWoman.impl
