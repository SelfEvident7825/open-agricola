import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { gainLeaf } from '../../helpers/pay-gain-node'
import { readCardExtraData } from '../../helpers/card-state'
import { hasOrdinaryFenceBuiltEvent } from '../../helpers/fence-events'
const CARD_ID = 'OLD_E160_Farmer'
const cardImpl = {
  listeners: [
    {
      id: CARD_ID + '-fence',
      cardIds: [CARD_ID],
      actions: ['fence'],
      phases: ['after'],
      handler: (context) => {
        if (!hasOrdinaryFenceBuiltEvent(context)) return
        return {
          sourceCard: CARD_ID,
          flow: {
            type: 'seq',
            children: [
              gainLeaf(
                CARD_ID,
                readCardExtraData(context.player, CARD_ID, 'fenced') ? { cattle: 1 } : { boar: 1 },
              ),
              {
                type: 'leaf',
                actionId: 'special-effect',
                sourceCard: CARD_ID,
                params: {
                  kind: 'set-extra-data',
                  key: 'fenced',
                  value: true,
                },
              },
            ],
          },
        }
      },
    },
  ],
} satisfies CardImpl
export const OLD_E160_Farmer = defineOccupationCard({
  meta: {
    id: 'OLD_E160_Farmer',
    originalId: 'E160_Farmer',
    gameEdition: 'classic',
    name: '农民',
    deck: 'E',
    number: 160,
    desc: [
      '下次你围建至少1根栅栏时，获得1只猪。在此之后，你每次围建至少1根栅栏时，获得1头牛。动物可以立即被转换成食物，即使你没有饲养空间。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E160.png',
  },
  impl: cardImpl,
})
export const OLD_E160_Farmer_impl = OLD_E160_Farmer.impl
