import { defineOccupationCard } from '../../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../../card-listeners'
import type { ActionHookResult } from '../../../actions/hooks'
import { gainLeaf } from '../../helpers/pay-gain-node'
import type { CardImpl } from '../../registry'
import { isTravelingPlayersSpaceId } from '../../helpers/action-space-categories'
const CARD_ID = 'OLD_E167_Conjurer'
const listener: CardListenerRegistration = {
  id: 'OLD_E167_Conjurer-conjurer-before-place-farmer',
  cardIds: [CARD_ID],
  phases: ['before'],
  actionSpaces: 'all',
  handler: (context: CardListenerContext): ActionHookResult | void => {
    if (!isTravelingPlayersSpaceId(context.space?.id)) return
    return {
      flow: gainLeaf(CARD_ID, { grain: 1 }),
      sourceCard: CARD_ID,
    }
  },
}
const cardImpl = {
  listeners: [listener],
  reaches: [] as readonly string[],
} satisfies CardImpl
export const OLD_E167_Conjurer = defineOccupationCard({
  meta: {
    id: 'OLD_E167_Conjurer',
    name: '杂耍艺人',
    deck: 'E',
    number: 167,
    category: 'GOODS_PROVIDER',
    desc: ['每当你使用卖艺积累行动格时，额外获得1份小麦。'],
    cost: {},
    players: '1+',
    originalId: 'E167_Conjurer',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E167.png',
  },
  impl: cardImpl,
})
export const OLD_E167_Conjurer_impl = OLD_E167_Conjurer.impl
