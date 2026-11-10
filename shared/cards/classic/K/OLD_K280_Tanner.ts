import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { createEventQuery } from '../../../events/query'
import type { ActionFlow } from '../../../contract/types'

const CARD_ID = 'OLD_K280_Tanner'
const cardImpl = {
  effect: {
    id: CARD_ID,
    computeBonusScore: (_state, player) => {
      const stored = player.cardStates[CARD_ID]?.counters
      return Math.min(3, Math.floor((stored?.boar ?? 0) / 2))
        + Math.max(0, Math.min(3, (stored?.cattle ?? 0) - 1))
    },
  },
  listeners: [{
    id: CARD_ID + '-tanned-animals',
    cardIds: [CARD_ID],
    actions: ['exchange'],
    phases: ['after'],
    handler: (context) => {
      const cooked = createEventQuery(context.actionEvents ?? context.transactionEvents)
        .filter('resource.exchanged', event => (event.gained.food ?? 0) > 0)
      const children: ActionFlow[] = (['boar', 'cattle'] as const).flatMap(animal => {
        const count = cooked.reduce((sum, event) => sum + (event.paid[animal] ?? 0), 0)
        return count ? [{
          type: 'leaf',
          actionId: 'special-effect',
          sourceCard: CARD_ID,
          params: { kind: 'increment-counter', key: animal, amount: count },
        } as ActionFlow] : []
      })
      return children.length
        ? { sourceCard: CARD_ID, flow: { type: 'seq', optional: true, children } }
        : undefined
    },
  }],
} satisfies CardImpl

export const OLD_K280_Tanner = defineOccupationCard({
  meta: {
    id: 'OLD_K280_Tanner',
    originalId: 'K280_Tanner',
    gameEdition: 'classic',
    name: '剥皮工',
    deck: 'K',
    number: 280,
    desc: [
      '每当你将猪或牛转换成食物后，可以将被转化的动物放到此卡上。游戏结束时，如果此卡上有至少2/4/6只猪或2/3/4头牛，你都获得1/2/3分。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: true,
    implemented: true,
    artUrl: '/assets/classic/K/K280.png',
    locales: {
      zh: {
        name: '剥皮工',
        desc: [
          '每当你将猪或牛转换成食物后，可以将被转化的动物放到此卡上。游戏结束时，如果此卡上有至少2/4/6只猪或2/3/4头牛，你都获得1/2/3分。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
