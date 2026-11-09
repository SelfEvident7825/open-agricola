// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
import { hasNoUnusedFarmyardSpaces } from '../../../domain/farm'
import type { CardImpl } from '../../registry'
import { bonusVpLeaf } from '../../helpers/pay-gain-node'
import { isMoorBalanceRulesEnabled } from '../../../contract/game-variants'

const CARD_ID = 'OLD_Z321_Ranch'

const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state) => {
      const nb = 14 - state.round
      if (nb <= 0) return
      return {
        type: 'seq' as const,
        children: [
          {
            type: 'leaf' as const,
            actionId: 'gain',
            sourceCard: CARD_ID,
            params: { food: 2 * nb },
          },
          bonusVpLeaf(CARD_ID, nb),
        ],
      }
    },
  },
  prerequisiteCheck: (player, state) =>
    hasNoUnusedFarmyardSpaces(player) &&
    (!isMoorBalanceRulesEnabled(state) || (player.farmTerrain?.length ?? 0) === 0),
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_Z321_Ranch = defineMinorCard({
  meta: {
    id: 'OLD_Z321_Ranch',
    name: '大农庄',
    deck: 'Z',
    number: 321,
    category: 'POINTS_PROVIDER',
    desc: ['打出此卡时，距离游戏结束每剩1个完整回合，你便可获得1分+2份食物稻草人'],
    cost: {},
    prerequisite: '农场无空格',
    extraVp: true,
    originalId: 'Z321_Ranch',
    gameEdition: 'classic',
    vp: 0,
    passing: false,
    implemented: true,
    artUrl: '/assets/classic/Z/Z321.png',
    locales: {
      zh: {
        name: '大农庄',
        desc: ['打出此卡时，距离游戏结束每剩1个完整回合，你便可获得1分+2份食物稻草人'],
        prerequisite: '农场无空格',
      },
    },
  },
  presentation: { counters: ['bonusVp'] },
  impl: cardImpl,
})

export const OLD_Z321_Ranch_impl = OLD_Z321_Ranch.impl
