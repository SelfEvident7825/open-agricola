import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { createEventQuery } from '../../../events/query'
import type { ActionFlow, GameState } from '../../../contract/types'
const CARD_ID = 'OLD_I87_Flagon'
const reward = (state: GameState, ownerId: string, count: number): ActionFlow => ({
  type: 'seq',
  children: state.players.map((p) => ({
    type: 'leaf',
    actionId: 'gain',
    sourceCard: CARD_ID,
    targetPlayerId: p.id,
    params: { food: count * (p.id === ownerId ? 4 : 1) },
  })),
})
const cardImpl = {
  reaches: [
    'Major_Well',
    'OLD_I66_VillageWell',
    'OLD_WM062_BackyardWell',
    'OLD_WA019_LaGraceFountain',
    'OLD_WA020_MarketFountain',
    'OLD_NL042_DrawWell',
  ] as readonly string[],
  effect: {
    id: CARD_ID,
    onBuy: (state, owner) => {
      const count = state.players.reduce(
        (n, p) =>
          n +
          [...p.improvements, ...p.minorPlayed].filter((id) =>
            [
              'Major_Well',
              'OLD_I66_VillageWell',
              'OLD_WM062_BackyardWell',
              'OLD_WA019_LaGraceFountain',
              'OLD_WA020_MarketFountain',
              'OLD_NL042_DrawWell',
            ].includes(id),
          ).length,
        0,
      )
      return count ? reward(state, owner.id, count) : undefined
    },
  },
  listeners: [
    {
      id: CARD_ID + '-well',
      cardIds: [CARD_ID],
      actions: ['improvement'],
      phases: ['after'],
      scope: 'any',
      handler: (context) =>
        createEventQuery(context.actionEvents ?? [])
          .filter('card.played')
          .some((e) =>
            [
              'Major_Well',
              'OLD_I66_VillageWell',
              'OLD_WM062_BackyardWell',
              'OLD_WA019_LaGraceFountain',
              'OLD_WA020_MarketFountain',
              'OLD_NL042_DrawWell',
            ].includes(e.cardId),
          )
          ? {
              sourceCard: CARD_ID,
              flow: reward(context.state, context.ownerPlayer!.id, 1),
            }
          : undefined,
    },
  ],
} satisfies CardImpl
export const OLD_I87_Flagon = defineMinorCard({
  meta: {
    id: 'OLD_I87_Flagon',
    originalId: 'I87_Flagon',
    gameEdition: 'classic',
    name: '大酒壶',
    deck: 'I',
    number: 87,
    desc: [
      '打出此卡时，场上每打出了1个井，你立即获得4份食物，其他每位玩家各获得1份食物。之后的游戏中，任意玩家每打出1个井，你立即获得4份食物，其他每位玩家各获得1份食物。井：A10水井、I66村中水井、WM062后院水井、WA019绵羊井、WA020人工水井、NL042提水井。',
    ],
    cost: {
      clay: 1,
    },
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I87.png',
  },
  impl: cardImpl,
})
export const OLD_I87_Flagon_impl = OLD_I87_Flagon.impl
