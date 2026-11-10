import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { getActionNewlyUsedTiles } from '../../helpers/farmyard-events'
import { payGainActionFlow } from '../../helpers/pay-gain-node'

const CARD_ID = 'OLD_K307_AnimalBreeder'
const cardImpl = {
  listeners: [{
    id: CARD_ID + '-new-pasture',
    cardIds: [CARD_ID],
    actions: ['fence'],
    phases: ['after'],
    handler: context => {
      if (!getActionNewlyUsedTiles(context, 'host').length) return
      return {
        sourceCard: CARD_ID,
        flow: {
          type: 'xor',
          optional: true,
          children: [
            payGainActionFlow({ cardId: CARD_ID, cost: { food: 1 }, gain: { sheep: 2 }, choiceLabelKey: 'ui.interactionResourceExchange' }),
            payGainActionFlow({ cardId: CARD_ID, cost: { food: 2 }, gain: { boar: 2 }, choiceLabelKey: 'ui.interactionResourceExchange' }),
            payGainActionFlow({ cardId: CARD_ID, cost: { food: 3 }, gain: { cattle: 2 }, choiceLabelKey: 'ui.interactionResourceExchange' }),
          ],
        },
      }
    },
  }],
} satisfies CardImpl

export const OLD_K307_AnimalBreeder = defineOccupationCard({
  meta: {
    id: 'OLD_K307_AnimalBreeder',
    originalId: 'K307_AnimalBreeder',
    gameEdition: 'classic',
    name: '哺育师',
    deck: 'K',
    number: 307,
    desc: ['每当你在未使用的空格上围起至少1格圈地时，你可以支付1/2/3份食物购买2只羊/2只猪/2头牛。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '4+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K307.png',
    locales: {
      zh: {
        name: '哺育师',
        desc: [
          '每当你在未使用的空格上围起至少1格圈地时，你可以支付1/2/3份食物购买2只羊/2只猪/2头牛。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_K307_AnimalBreeder_impl = OLD_K307_AnimalBreeder.impl
