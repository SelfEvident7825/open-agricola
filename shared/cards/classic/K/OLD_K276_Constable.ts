import { defineOccupationCard } from '../../card-source'
import { gainLeaf } from '../../helpers/pay-gain-node'
import { getOrdinaryNegativeScoreTotal } from '../../../domain/score-rules'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K276_Constable'
const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state) => {
      const remaining = 14 - state.round
      const wood = remaining >= 9 ? 4 : remaining >= 6 ? 3 : remaining >= 3 ? 2 : remaining >= 1 ? 1 : 0
      if (wood) return gainLeaf(CARD_ID, { wood })
    },
    computeSharedPostScore: (_state, _owner, summaries) => summaries.flatMap(summary =>
      getOrdinaryNegativeScoreTotal(summary) < 0 ? [] : [{ playerId: summary.playerId, score: 5 }],
    ),
  },
} satisfies CardImpl

export const OLD_K276_Constable = defineOccupationCard({
  meta: {
    id: 'OLD_K276_Constable',
    originalId: 'K276_Constable',
    gameEdition: 'classic',
    name: '警官',
    deck: 'K',
    number: 276,
    desc: [
      '打出此卡时，若距离游戏结束还有1/3/6/9个完整回合，则你立即获得1/2/3/4根木头。游戏结束时，没有负分项目的玩家都额外获得5分。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: true,
    implemented: true,
    artUrl: '/assets/classic/K/K276.png',
  },
  impl: cardImpl,
})
