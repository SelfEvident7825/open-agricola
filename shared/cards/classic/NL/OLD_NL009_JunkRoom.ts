// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../../card-listeners'
import type { ActionHookPhase, ActionHookResult } from '../../../actions/hooks'
import { gainLeaf } from '../../helpers/pay-gain-node'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_NL009_JunkRoom'
const foodGainFlow = () => gainLeaf(CARD_ID, { food: 1 })
const listener: CardListenerRegistration = {
  id: 'OLD_NL009_JunkRoom-junk-room-after-improvement',
  cardIds: [CARD_ID],
  phases: ['after' as ActionHookPhase],
  actions: ['improvement'],
  handler: (_context: CardListenerContext): ActionHookResult | void => {
    return { flow: foodGainFlow(), sourceCard: CARD_ID }
  },
}

const cardImpl = {
  listeners: [listener],
  effect: { id: CARD_ID, onBuy: foodGainFlow },
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_NL009_JunkRoom = defineMinorCard({
  meta: {
    id: 'OLD_NL009_JunkRoom',
    name: '杂物房',
    deck: 'NL',
    number: 9,
    category: 'FOOD_PROVIDER',
    desc: ['每当你打出1张发展卡（包括此卡）后，你获得1份食物你有小溪家庭成员'],
    cost: {
      wood: 1,
      clay: 1,
    },
    originalId: 'NL009_JunkRoom',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/NL/NL009.png',
  },
  impl: cardImpl,
})

export const OLD_NL009_JunkRoom_impl = OLD_NL009_JunkRoom.impl
