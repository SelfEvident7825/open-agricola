// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
import { payLeaf } from '../../helpers/pay-gain-node'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_WA004_BeerTable'

const cardImpl = {
  prerequisiteCheck: (player) => (player.resources.grain ?? 0) === 0,
  effect: {
    id: CARD_ID,
    preHarvestGoodsWanted: ['grain'],
    onEndHarvestFieldPhase: (_state, player) => {
      if ((player.resources.grain ?? 0) < 1) return
      return {
        type: 'seq',
        optional: true,
        children: [
          payLeaf({ cardId: CARD_ID, cost: { grain: 1 } }),
          { type: 'leaf', actionId: 'bonus-vp', sourceCard: CARD_ID },
          { type: 'leaf', actionId: 'bonus-vp', sourceCard: CARD_ID },
          {
            type: 'leaf',
            actionId: 'gain',
            params: { recipientMode: 'others', food: 1 },
            sourceCard: CARD_ID,
          },
        ],
      }
    },
  },
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_WA004_BeerTable = defineMinorCard({
  meta: {
    id: 'OLD_WA004_BeerTable',
    name: '啤酒桌',
    deck: 'WA',
    number: 4,
    category: 'POINTS_PROVIDER',
    desc: [
      '每个丰收时节的收割阶段结束时，你可以支付1份小麦来获得2分。若你如此做，其他玩家分别获得1份食物漫画店8或9',
    ],
    cost: {
      wood: 2,
    },
    prerequisite: '补给区无小麦',
    extraVp: true,
    originalId: 'WA004_BeerTable',
    gameEdition: 'classic',
    vp: 0,
    passing: false,
    implemented: true,
    artUrl: '/assets/classic/WA/WA004.png',
  },
  presentation: { counters: ['bonusVp'] },
  impl: cardImpl,
})

export const OLD_WA004_BeerTable_impl = OLD_WA004_BeerTable.impl
