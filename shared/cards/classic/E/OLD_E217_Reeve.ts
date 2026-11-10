import { countOccupations } from '../../helpers/prerequisites'
import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E217_Reeve'
const WOOD_MAP: Record<number, number> = {
  0: 0,
  1: 1,
  2: 1,
  3: 2,
  4: 2,
  5: 2,
  6: 3,
  7: 3,
  8: 3,
  9: 4,
}
const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state) => {
      const remainingTurns = 14 - state.round
      const toGain = remainingTurns >= 9 ? 4 : (WOOD_MAP[remainingTurns] ?? 0)
      if (toGain <= 0) return
      return {
        type: 'leaf' as const,
        actionId: 'gain',
        sourceCard: CARD_ID,
        params: { wood: toGain },
      }
    },
    computeSharedPostScore: (state) => {
      const maxRooms = Math.max(...state.players.map(countOccupations))
      return state.players
        .filter((player) => countOccupations(player) === maxRooms)
        .map((player) => ({
          playerId: player.id,
          score: 3,
        }))
    },
  },
  reaches: [] as readonly string[],
} satisfies CardImpl
export const OLD_E217_Reeve = defineOccupationCard({
  meta: {
    id: 'OLD_E217_Reeve',
    name: '地方官',
    deck: 'E',
    number: 217,
    category: 'POINTS_PROVIDER',
    desc: [
      '打出此卡时，若距离游戏结束还有1/3/6/9个完整回合，则你立即获得1/2/3/4根木头。游戏结束时，打出职业最多的玩家都额外获得3分。',
    ],
    cost: {},
    players: '1+',
    extraVp: true,
    originalId: 'E217_Reeve',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    implemented: true,
    artUrl: '/assets/classic/E/E217.png',
  },
  impl: cardImpl,
})
export const OLD_E217_Reeve_impl = OLD_E217_Reeve.impl
