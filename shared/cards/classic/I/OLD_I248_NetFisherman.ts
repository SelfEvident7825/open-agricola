import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { sumActionSpaceMovedToTriggerPlayer } from '../../helpers/event-provenance'
import { readCardExtraData } from '../../helpers/card-state'
const CARD_ID = 'OLD_I248_NetFisherman'

const cardImpl = {
  effect: {
    id: CARD_ID,
    onBeforeReturnHome: (state, player) => {
      if (readCardExtraData<number>(player, CARD_ID, 'reedRound') !== state.round) return
      const space = state.actionSpaces.find((s) => s.id === 'fishing')
      const food = space?.resources.food ?? 0
      return food > 0
        ? {
            type: 'leaf',
            actionId: 'collect',
            sourceCard: CARD_ID,
            optional: true,
            actionContext: { spaceId: 'fishing', resourceTypes: ['food'] },
          }
        : undefined
    },
  },
  listeners: [
    {
      id: CARD_ID + '-reed',
      cardIds: [CARD_ID],
      actionSpaces: 'all',
      phases: ['after'],
      handler: (context) =>
        sumActionSpaceMovedToTriggerPlayer(context, 'reed') > 0
          ? {
              sourceCard: CARD_ID,
              flow: {
                type: 'leaf',
                actionId: 'special-effect',
                sourceCard: CARD_ID,
                params: {
                  kind: 'set-extra-data',
                  key: 'reedRound',
                  value: context.state.round,
                },
              },
            }
          : undefined,
    },
  ],
} satisfies CardImpl
export const OLD_I248_NetFisherman = defineOccupationCard({
  meta: {
    id: 'OLD_I248_NetFisherman',
    originalId: 'I248_NetFisherman',
    gameEdition: 'classic',
    name: '网鱼人',
    deck: 'I',
    number: 248,
    desc: [
      '每回合返家阶段，如果本回合你有家庭成员使用了获得芦苇的行动格，则你可以获得钓鱼积累行动格上的所有食物。（通过卡牌获得的芦苇不算）',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '3+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I248.png',
    locales: {
      zh: {
        name: '网鱼人',
        desc: [
          '每回合返家阶段，如果本回合你有家庭成员使用了获得芦苇的行动格，则你可以获得钓鱼积累行动格上的所有食物。（通过卡牌获得的芦苇不算）',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_I248_NetFisherman_impl = OLD_I248_NetFisherman.impl
