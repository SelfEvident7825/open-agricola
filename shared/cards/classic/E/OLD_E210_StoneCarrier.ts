import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { gainLeaf } from '../../helpers/pay-gain-node'
import { createEventQuery } from '../../../events/query'
import { payGainNode } from '../../helpers/pay-gain-node'
const CARD_ID = 'OLD_E210_StoneCarrier'
const cardImpl = {
  listeners: [
    {
      id: CARD_ID + '-stone',
      cardIds: [CARD_ID],
      actionSpaces: 'all',
      phases: ['after'],
      handler: (context) => {
        const moved = createEventQuery(context.actionEvents ?? []).filter(
          'resource.moved',
          (e) =>
            e.from.kind === 'actionSpace' &&
            e.to.kind === 'player' &&
            e.to.playerId === context.player.id,
        )
        if (!moved.some((e) => (e.resources.stone ?? 0) > 0)) return
        if (
          moved.some(
            (e) => (e.resources.wood ?? 0) + (e.resources.clay ?? 0) + (e.resources.reed ?? 0) > 0,
          )
        )
          return context.player.resources.food > 0
            ? payGainNode({
                cardId: CARD_ID,
                cost: { food: 1 },
                gain: { stone: 1 },
              })
            : undefined
        return {
          sourceCard: CARD_ID,
          flow: gainLeaf(CARD_ID, { stone: 1 }),
        }
      },
    },
  ],
} satisfies CardImpl
export const OLD_E210_StoneCarrier = defineOccupationCard({
  meta: {
    id: 'OLD_E210_StoneCarrier',
    originalId: 'E210_StoneCarrier',
    gameEdition: 'classic',
    name: '运石工',
    deck: 'E',
    number: 210,
    desc: [
      '每当你从行动格上获得石头时，你额外获得1个石头。如果你同时获得了其他种类的建筑资源，你需要支付1份食物。（通过卡牌获得的石头不算）',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '4+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E210.png',
    locales: {
      zh: {
        name: '运石工',
        desc: [
          '每当你从行动格上获得石头时，你额外获得1个石头。如果你同时获得了其他种类的建筑资源，你需要支付1份食物。（通过卡牌获得的石头不算）',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E210_StoneCarrier_impl = OLD_E210_StoneCarrier.impl
