import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import type { ActionFlow } from '../../../contract/types'
import { payLeaf, gainLeaf } from '../../helpers/pay-gain-node'
const CARD_ID = 'OLD_I103_WaterMill'
const mill = (ownerId: string, playerId: string): ActionFlow => ({
  type: 'seq',
  optional: true,
  children: [
    {
      ...payLeaf({
        cardId: CARD_ID,
        cost: { grain: 1 },
        choiceLabelKey: 'ui.interactionResourceExchange',
        choiceLabelParams: {
          resourcesPaid: { grain: 1 },
          resourcesGained: { food: ownerId === playerId ? 3 : 2 },
        },
      }),
      targetPlayerId: playerId,
    },
    { ...gainLeaf(CARD_ID, { food: 3 }), targetPlayerId: playerId },
    ...(ownerId === playerId
      ? []
      : [
          {
            type: 'leaf' as const,
            actionId: 'gain',
            sourceCard: CARD_ID,
            targetPlayerId: playerId,
            params: { food: 1, payerId: playerId, recipientPlayerId: ownerId },
          },
        ]),
  ],
})
const cardImpl = {
  effect: {
    id: CARD_ID,
    onEndHarvestFieldPhase: (state, owner) => ({
      type: 'seq',
      children: state.players.map((player) => mill(owner.id, player.id)),
    }),
  },
  listeners: [
    {
      id: CARD_ID + '-private-mill',
      cardIds: [CARD_ID],
      actions: ['reap'],
      phases: ['after'],
      scope: 'any',
      handler: (context) =>
        (context.actionContext?.trigger as { phase?: string } | undefined)?.phase ===
        'private-field-phase'
          ? {
              sourceCard: CARD_ID,
              flow: mill(context.ownerPlayer!.id, context.player.id),
            }
          : undefined,
    },
  ],
} satisfies CardImpl
export const OLD_I103_WaterMill = defineMinorCard({
  meta: {
    id: 'OLD_I103_WaterMill',
    originalId: 'I103_WaterMill',
    gameEdition: 'classic',
    name: '水磨坊',
    deck: 'I',
    number: 103,
    desc: [
      '每个丰收时节的收割阶段后，所有玩家都可以使用此卡将至多1份小麦转化为3份食物。（这不是“烤面包”行动）其他玩家如此做之后必须支付给你1份食物。可触发I103水磨坊效果：I92肥料、FR005艺术花园、G061历书、G118冬季花园、NL047早熟麦。不可触发I103水磨坊效果：NL104小麦收割工、G080秋收盛宴、G115养鱼场、WM014轮耕农。',
    ],
    cost: {
      stone: 2,
      clay: 2,
      wood: 1,
      reed: 1,
    },
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I103.png',
    locales: {
      zh: {
        name: '水磨坊',
        desc: [
          '每个丰收时节的收割阶段后，所有玩家都可以使用此卡将至多1份小麦转化为3份食物。（这不是“烤面包”行动）其他玩家如此做之后必须支付给你1份食物。可触发I103水磨坊效果：I92肥料、FR005艺术花园、G061历书、G118冬季花园、NL047早熟麦。不可触发I103水磨坊效果：NL104小麦收割工、G080秋收盛宴、G115养鱼场、WM014轮耕农。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_I103_WaterMill_impl = OLD_I103_WaterMill.impl
