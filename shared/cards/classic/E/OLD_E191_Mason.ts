import { defineOccupationCard } from '../../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../../card-listeners'
import type { ActionHookPhase, ActionHookResult } from '../../../actions/hooks'
import { isCardFlagged } from '../../helpers/card-state'
import { readCardExtraData, writeCardExtraData } from '../../helpers/card-state'
import { writeCardInfobox } from '../../helpers/card-state'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E191_Mason'
const FREE_SINGLE_ROOM_CONTEXT = {
  maxRooms: 1,
  exactCost: { max: 1 },
  trueAction: false,
  cancelPolicy: 'forbidCancel',
}
const anytimeListener: CardListenerRegistration = {
  id: 'OLD_E191_Mason-mason-anytime',
  cardIds: [CARD_ID],
  actions: ['anytime'],
  phases: ['anytime' as ActionHookPhase],
  preScoring: true,
  handler: (context: CardListenerContext): ActionHookResult | void => {
    if (isCardFlagged(context.player, CARD_ID)) return
    const hasRoom = readCardExtraData<boolean>(context.player, CARD_ID, 'hasRoom')
    if (!hasRoom) return
    if (context.player.houseType !== 'stone') return
    if (context.player.rooms < 4) return
    return {
      flow: {
        type: 'seq',
        children: [
          {
            type: 'leaf',
            actionId: 'construct',
            sourceCard: CARD_ID,
            actionContext: FREE_SINGLE_ROOM_CONTEXT,
          },
          {
            type: 'leaf',
            actionId: 'special-effect',
            sourceCard: CARD_ID,
            params: {
              kind: 'set-flag',
              flag: true,
            },
          },
        ],
      },
      sourceCard: CARD_ID,
    }
  },
}
const cardImpl = {
  listeners: [anytimeListener],
  effect: {
    id: CARD_ID,
    onBuy: (_state, player) => {
      writeCardExtraData(player, CARD_ID, 'hasRoom', true)
      writeCardInfobox(player, CARD_ID, '1 Stone Room')
    },
  },
  reaches: [] as readonly string[],
} satisfies CardImpl
export const OLD_E191_Mason = defineOccupationCard({
  meta: {
    id: 'OLD_E191_Mason',
    name: '泥水匠',
    deck: 'E',
    number: 191,
    category: 'FARM_PLANNER',
    desc: ['放置1个石屋在此卡上。一旦你拥有了不少于4间石屋，你便可随时免费扩建此卡上的这间石屋。'],
    cost: {},
    players: '3+',
    implemented: true,
    originalId: 'E191_Mason',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    artUrl: '/assets/classic/E/E191.png',
    locales: {
      zh: {
        name: '泥水匠',
        desc: [
          '放置1个石屋在此卡上。一旦你拥有了不少于4间石屋，你便可随时免费扩建此卡上的这间石屋。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E191_Mason_impl = OLD_E191_Mason.impl
