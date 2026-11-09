// Generated classic import. Remove this line before manually porting a card.
import { defineOccupationCard } from '../../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../../card-listeners'
import type { ActionHookResult } from '../../../actions/hooks'
import { gainLeaf } from '../../helpers/pay-gain-node'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K288_StorehouseKeeper'
const RESOURCE_MARKET_SPACES = new Set(['resource-market', 'resource-market-4'])

/**
 * B156 Storehouse Keeper — Each time you use the Resource Market action space,
 * you also get your choice of 1 CLAY or 1 GRAIN.
 *
 * Rule: isActionCardEvent('ResourceMarket') →
 * returns a NODE_XOR of gainNode([CLAY => 1]) / gainNode([GRAIN => 1]).
 */
const listener: CardListenerRegistration = {
  id: 'OLD_K288_StorehouseKeeper-storehouse-keeper-before-place-farmer',
  cardIds: [CARD_ID],
  phases: ['before'],
  actionSpaces: 'all',
  handler: (context: CardListenerContext): ActionHookResult | void => {
    const spaceId = context.space?.id
    if (!spaceId || !RESOURCE_MARKET_SPACES.has(spaceId)) return
    return {
      flow: {
        type: 'xor',
        children: [gainLeaf(CARD_ID, { clay: 1 }), gainLeaf(CARD_ID, { grain: 1 })],
      },
      sourceCard: CARD_ID,
    }
  },
}

const cardImpl = {
  listeners: [listener],
  reaches: [] as readonly string[],
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
