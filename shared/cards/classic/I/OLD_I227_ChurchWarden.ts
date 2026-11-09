import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { gainLeaf } from '../../helpers/pay-gain-node'
import { readCardExtraData } from '../../helpers/card-state'
import { getRoundPersonPlacementDetails } from '../../helpers/round-placement'
const CARD_ID = 'OLD_I227_ChurchWarden'

const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state) => {
      const left = 14 - state.round
      const wood = left >= 9 ? 4 : left >= 6 ? 3 : left >= 3 ? 2 : left >= 1 ? 1 : 0
      return wood ? gainLeaf(CARD_ID, { wood }) : undefined
    },
    computeSharedPostScore: (state) => {
      return state.players
        .filter(
          (p) => (readCardExtraData<string[]>(p, CARD_ID, 'round14Workers') ?? []).length >= 5,
        )
        .map((p) => ({ playerId: p.id, score: 3 }))
    },
  },
  listeners: [
    {
      id: CARD_ID + '-workers',
      cardIds: [CARD_ID],
      actionSpaces: 'all',
      phases: ['after'],
      scope: 'any',
      handler: (context) => {
        if (context.state.round !== 14 || !context.actionSpaceUse?.newPlacement) return
        const ids = [
          ...new Set(getRoundPersonPlacementDetails(context.player).map((x) => x.workerId)),
        ]
        return {
          sourceCard: CARD_ID,
          flow: {
            type: 'leaf',
            actionId: 'special-effect',
            sourceCard: CARD_ID,
            targetPlayerId: context.player.id,
            params: {
              kind: 'set-extra-data',
              key: 'round14Workers',
              value: ids,
            },
          },
        }
      },
    },
  ],
} satisfies CardImpl
export const OLD_I227_ChurchWarden = defineOccupationCard({
  meta: {
    id: 'OLD_I227_ChurchWarden',
    originalId: 'I227_ChurchWarden',
    gameEdition: 'classic',
    name: '教会管理员',
    deck: 'I',
    number: 227,
    desc: [
      '打出此卡时，若距离游戏结束还有1/3/6/9个完整回合，则你立即获得1/2/3/4根木头。在第14回合派遣了至少5名不同家庭成员(包括食客)的玩家都额外获得3分。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: true,
    implemented: true,
    artUrl: '/assets/classic/I/I227.png',
    locales: {
      zh: {
        name: '教会管理员',
        desc: [
          '打出此卡时，若距离游戏结束还有1/3/6/9个完整回合，则你立即获得1/2/3/4根木头。在第14回合派遣了至少5名不同家庭成员(包括食客)的玩家都额外获得3分。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_I227_ChurchWarden_impl = OLD_I227_ChurchWarden.impl
