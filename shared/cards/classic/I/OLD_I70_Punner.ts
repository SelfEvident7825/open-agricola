import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { getCardDefinition } from '../../catalog'
import { readCardExtraData } from '../../helpers/card-state'
const CARD_ID = 'OLD_I70_Punner'

const cardImpl = {
  listeners: [
    {
      id: CARD_ID + '-plow',
      cardIds: [CARD_ID],
      actions: ['plow'],
      phases: ['after'],
      scope: 'opponent',
      handler: (context) => {
        if (
          !context.sourceCard ||
          !getCardDefinition(context.sourceCard)?.plowEffect ||
          !context.actionEvents?.some((e) => e.type === 'farm.fieldPlowed')
        )
          return
        const plowOwner = context.state.players.find((p) =>
          p.minorPlayed.includes(context.sourceCard!),
        )
        const useId = plowOwner
          ? readCardExtraData<string>(plowOwner, context.sourceCard, 'plowUse')
          : undefined
        const owner = context.ownerPlayer!
        if (!useId || readCardExtraData(owner, CARD_ID, 'lastUse') === useId) return
        return {
          sourceCard: CARD_ID,
          flow: {
            type: 'seq',
            children: [
              {
                type: 'leaf',
                actionId: 'special-effect',
                sourceCard: CARD_ID,
                params: {
                  kind: 'set-extra-data',
                  key: 'lastUse',
                  value: useId,
                },
              },
              {
                type: 'leaf',
                actionId: 'plow',
                sourceCard: CARD_ID,
                optional: true,
              },
            ],
          },
        }
      },
    },
  ],
} satisfies CardImpl
export const OLD_I70_Punner = defineMinorCard({
  meta: {
    id: 'OLD_I70_Punner',
    originalId: 'I70_Punner',
    gameEdition: 'classic',
    name: '夯具',
    deck: 'I',
    number: 70,
    desc: ['每当其他玩家使用犁或I68耙时，你可以犁1块田。'],
    cost: {
      wood: 1,
    },
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I70.png',
  },
  impl: cardImpl,
})
export const OLD_I70_Punner_impl = OLD_I70_Punner.impl
