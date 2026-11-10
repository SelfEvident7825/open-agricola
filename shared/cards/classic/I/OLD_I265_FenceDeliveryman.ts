import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { readCardExtraData, writeCardExtraData } from '../../helpers/card-state'
import { getOwnOrdinaryFenceReserveCount } from '../../../domain/supply-tokens'
import { payGainFlow } from '../../helpers/pay-gain-node'
const CARD_ID = 'OLD_I265_FenceDeliveryman'

const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state, player) => {
      const rounds = [state.round + 6, state.round + 10].filter((r) => r <= 14)
      const reserved = Math.min(rounds.length * 4, getOwnOrdinaryFenceReserveCount(player))
      writeCardExtraData(player, CARD_ID, 'rounds', rounds)
      writeCardExtraData(player, CARD_ID, 'reserved', reserved)
    },
    getRuleContributions: (player) => ({
      reservedSupply: {
        fence: readCardExtraData<number>(player, CARD_ID, 'reserved') ?? 0,
      },
    }),
    onRoundStart: (state, player) => {
      if (!(readCardExtraData<number[]>(player, CARD_ID, 'rounds') ?? []).includes(state.round))
        return
      const reserved = readCardExtraData<number>(player, CARD_ID, 'reserved') ?? 0
      const count = Math.min(4, reserved)
      if (count === 0) return
      writeCardExtraData(player, CARD_ID, 'reserved', reserved - count)
      return payGainFlow({
        cardId: CARD_ID,
        cost: { food: 2 },
        followUp: [
          {
            type: 'leaf',
            actionId: 'fence',
            sourceCard: CARD_ID,
            actionContext: {
              fencePolicy: {
                segmentBounds: { total: { min: 1, max: count } },
                costPolicy: { fence: { wood: 0 } },
              },
            },
          },
        ],
      })
    },
  },
} satisfies CardImpl
export const OLD_I265_FenceDeliveryman = defineOccupationCard({
  meta: {
    id: 'OLD_I265_FenceDeliveryman',
    originalId: 'I265_FenceDeliveryman',
    gameEdition: 'classic',
    name: '运篱工',
    deck: 'I',
    number: 265,
    desc: [
      '将当前回合数加6和10，在这些回合的行动格上各放置你的4根栅栏(若你的栅栏不足8根，则优先放在靠前的回合)。这些回合开始时，你可以支付2份食物来用这些栅栏条来围栅栏。(可以不用完)',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '3+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I265.png',
  },
  impl: cardImpl,
})
export const OLD_I265_FenceDeliveryman_impl = OLD_I265_FenceDeliveryman.impl
