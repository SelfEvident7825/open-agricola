import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { classicPlowUseTaken } from '../../helpers/classic-plow'
import { readCardExtraData } from '../../helpers/card-state'
const CARD_ID = 'OLD_I68_Harrow'

const cardImpl = {
  listeners: [
    {
      id: CARD_ID + '-harrow',
      cardIds: [CARD_ID],
      actionSpaces: ['farmland', 'cultivation'],
      phases: ['before'],
      scope: 'any',
      handler: (context) => {
        const owner = context.ownerPlayer ?? context.player,
          actor = context.player,
          useId = context.actionSpaceUse?.useId
        const users = readCardExtraData<string[]>(owner, CARD_ID, 'users') ?? []
        if (
          !useId ||
          users.includes(actor.id) ||
          classicPlowUseTaken(context.state, useId) ||
          (owner.id !== actor.id && actor.resources.food < 2)
        )
          return
        return {
          sourceCard: CARD_ID,
          flow: {
            type: 'seq',
            optional: true,
            children: [
              ...(owner.id !== actor.id
                ? [
                    {
                      type: 'leaf' as const,
                      actionId: 'gain',
                      sourceCard: CARD_ID,
                      targetPlayerId: actor.id,
                      params: {
                        food: 2,
                        payerId: actor.id,
                        recipientPlayerId: owner.id,
                      },
                    },
                  ]
                : []),
              {
                type: 'leaf',
                actionId: 'special-effect',
                sourceCard: CARD_ID,
                targetPlayerId: owner.id,
                params: {
                  kind: 'set-extra-data',
                  key: 'users',
                  value: [...users, actor.id],
                },
              },
              {
                type: 'leaf',
                actionId: 'special-effect',
                sourceCard: CARD_ID,
                targetPlayerId: owner.id,
                params: {
                  kind: 'set-extra-data',
                  key: 'plowUse',
                  value: useId,
                },
              },
              {
                type: 'leaf',
                actionId: 'plow',
                sourceCard: CARD_ID,
                targetPlayerId: actor.id,
              },
            ],
          },
        }
      },
    },
  ],
} satisfies CardImpl
export const OLD_I68_Harrow = defineMinorCard({
  meta: {
    id: 'OLD_I68_Harrow',
    originalId: 'I68_Harrow',
    gameEdition: 'classic',
    name: '耙',
    deck: 'I',
    number: 68,
    desc: [
      '限1次：每当你使用犁田/粮食耕种[犁播]行动格时，可改为犁2块田。其他玩家可以支付给你2份食物使用此卡1次。每次使用犁田/粮食耕种[犁播]行动格时，只能使用1个犁/I68耙的效果。',
    ],
    cost: {
      wood: 2,
    },
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I68.png',
    locales: {
      zh: {
        name: '耙',
        desc: [
          '限1次：每当你使用犁田/粮食耕种[犁播]行动格时，可改为犁2块田。其他玩家可以支付给你2份食物使用此卡1次。每次使用犁田/粮食耕种[犁播]行动格时，只能使用1个犁/I68耙的效果。',
        ],
        prerequisite: '',
      },
    },
    plowEffect: true,
  },
  impl: cardImpl,
})
export const OLD_I68_Harrow_impl = OLD_I68_Harrow.impl
