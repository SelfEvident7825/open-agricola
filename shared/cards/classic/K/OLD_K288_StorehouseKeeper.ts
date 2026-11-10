import { defineOccupationCard } from '../../card-source'
import { gainLeaf } from '../../helpers/pay-gain-node'
import { sumActionSpaceMovedToTriggerPlayerFromSpace } from '../../helpers/event-provenance'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K288_StorehouseKeeper'
const cardImpl = {
  listeners: [{
    id: CARD_ID + '-take-reed-and-stone',
    cardIds: [CARD_ID],
    actionSpaces: 'all',
    phases: ['after'],
    handler: (context) => {
      if (sumActionSpaceMovedToTriggerPlayerFromSpace(context, 'reed') <= 0
        || sumActionSpaceMovedToTriggerPlayerFromSpace(context, 'stone') <= 0) return
      return {
        sourceCard: CARD_ID,
        flow: { type: 'xor', children: [gainLeaf(CARD_ID, { clay: 1 }), gainLeaf(CARD_ID, { grain: 1 })] },
      }
    },
  },],
} satisfies CardImpl

export const OLD_K288_StorehouseKeeper = defineOccupationCard({
  meta: {
    id: 'OLD_K288_StorehouseKeeper',
    name: '仓库管理员',
    deck: 'K',
    number: 288,
    category: 'GOODS_PROVIDER',
    desc: ['每当你使用从行动格上同时获得芦苇和石头时，你额外获得1块砖头或1份小麦。'],
    cost: {},
    players: '1+',
    originalId: 'K288_StorehouseKeeper',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K288.png',
    locales: {
      zh: {
        name: '仓库管理员',
        desc: ['每当你使用从行动格上同时获得芦苇和石头时，你额外获得1块砖头或1份小麦。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_K288_StorehouseKeeper_impl = OLD_K288_StorehouseKeeper.impl
