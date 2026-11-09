import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { createEventQuery } from '../../../events/query'
const CARD_ID = 'OLD_E156_BrushMaker'
const cardImpl = {
  listeners: [
    {
      id: CARD_ID + '-cook-boar',
      cardIds: [CARD_ID],
      actions: ['exchange'],
      phases: ['after'],
      handler: (context) => {
        const count = createEventQuery(context.actionEvents ?? [])
          .filter(
            'resource.exchanged',
            (e) =>
              e.paidFrom.kind === 'player' &&
              e.paidFrom.playerId === context.player.id &&
              (e.gained.food ?? 0) > 0,
          )
          .reduce((n, e) => n + (e.paid.boar ?? 0), 0)
        if (count)
          return {
            sourceCard: CARD_ID,
            flow: {
              type: 'leaf',
              actionId: 'special-effect',
              sourceCard: CARD_ID,
              params: {
                kind: 'increment-counter',
                key: 'cookedBoar',
                amount: count,
              },
            },
          }
      },
    },
  ],
  effect: {
    id: CARD_ID,
    computeBonusScore: (_state, player) =>
      Math.min(3, Math.max(0, (player.cardStates[CARD_ID]?.counters?.cookedBoar ?? 0) - 1)),
  },
} satisfies CardImpl
export const OLD_E156_BrushMaker = defineOccupationCard({
  meta: {
    id: 'OLD_E156_BrushMaker',
    originalId: 'E156_BrushMaker',
    gameEdition: 'classic',
    name: '制刷工',
    deck: 'E',
    number: 156,
    desc: [
      '每当你将猪转换成食物，就把转化的猪放在此卡上。游戏结束时，如果此卡上有2/3/4+头猪，额外获得1/2/3分。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: true,
    implemented: true,
    artUrl: '/assets/classic/E/E156.png',
    locales: {
      zh: {
        name: '制刷工',
        desc: [
          '每当你将猪转换成食物，就把转化的猪放在此卡上。游戏结束时，如果此卡上有2/3/4+头猪，额外获得1/2/3分。',
        ],
        prerequisite: '',
      },
    },
  },
  presentation: { counters: ['cookedBoar'] },
  impl: cardImpl,
})
export const OLD_E156_BrushMaker_impl = OLD_E156_BrushMaker.impl
