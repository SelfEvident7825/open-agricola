// Generated classic import. Remove this line before manually porting a card.
import { defineOccupationCard } from '../../card-source'
import { gainLeaf, payLeaf } from '../../helpers/pay-gain-node'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_NL117_Overwinterer'

const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: () => gainLeaf(CARD_ID, { grain: 1 }),
    onEndHarvest: (_state, player) => {
      if (player.resources.food < 2) return
      return {
        type: 'seq',
        optional: true,
        children: [
          payLeaf({ cardId: CARD_ID, cost: { food: 2 } }),
          gainLeaf(CARD_ID, { vegetable: 1 }),
        ],
      }
    },
  },
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_NL117_Overwinterer = defineOccupationCard({
  meta: {
    id: 'OLD_NL117_Overwinterer',
    name: '冬季看守',
    deck: 'NL',
    number: 117,
    category: 'CROP_PROVIDER',
    desc: ['打出此卡时，你获得1份小麦。在每个丰收时节结束时，你可以支付2份食物来购买至多1份蔬菜。'],
    cost: {},
    players: '1+',
    originalId: 'NL117_Overwinterer',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/NL/NL117.png',
  },
  impl: cardImpl,
})

export const OLD_NL117_Overwinterer_impl = OLD_NL117_Overwinterer.impl
