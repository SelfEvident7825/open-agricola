import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { createEventQuery } from '../../../events/query'
import { payLeaf } from '../../helpers/pay-gain-node'

const CARD_ID = 'OLD_K273_BasinMaker'
const cardImpl = {
  effect: {
    id: CARD_ID,
    computeBonusScore: (_state, player) => {
      const wood = player.cardStates[CARD_ID]?.counters?.wood ?? 0
      return wood - Math.ceil(wood / 3)
    },
  },
  listeners: [{
    id: CARD_ID + '-cook-boar',
    cardIds: [CARD_ID],
    actions: ['exchange'],
    phases: ['after'],
    handler: (context) => {
      const boar = createEventQuery(context.actionEvents ?? context.transactionEvents)
        .filter('resource.exchanged')
        .reduce((count, event) => count + ((event.gained.food ?? 0) > 0 ? (event.paid.boar ?? 0) : 0), 0)
      if (boar <= 0) return
      return {
        sourceCard: CARD_ID,
        flow: {
          type: 'seq',
          children: Array.from({ length: boar }, () => ({
            type: 'seq' as const,
            optional: true,
            children: [
              payLeaf({ cardId: CARD_ID, cost: { wood: 2 } }),
              {
                type: 'leaf' as const,
                actionId: 'special-effect',
                sourceCard: CARD_ID,
                params: { kind: 'increment-counter', key: 'wood', amount: 2 },
              },
            ],
          })),
        },
      }
    },
  }],
} satisfies CardImpl

export const OLD_K273_BasinMaker = defineOccupationCard({
  meta: {
    id: 'OLD_K273_BasinMaker',
    originalId: 'K273_BasinMaker',
    gameEdition: 'classic',
    name: '制盆工',
    deck: 'K',
    number: 273,
    desc: [
      '每当你把猪转化为食物时，对于每只猪，你可以将你的2根木头放在此卡上。游戏结束时，除了第1、4、7、10根木头，此卡上的每根木头都使你额外获得1分。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: true,
    implemented: true,
    artUrl: '/assets/classic/K/K273.png',
    locales: {
      zh: {
        name: '制盆工',
        desc: [
          '每当你把猪转化为食物时，对于每只猪，你可以将你的2根木头放在此卡上。游戏结束时，除了第1、4、7、10根木头，此卡上的每根木头都使你额外获得1分。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
