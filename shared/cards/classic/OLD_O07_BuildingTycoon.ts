// Generated classic import. Remove this line before manually porting a card.
import { defineOccupationCard } from '../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../card-listeners'
import type { ActionHookPhase, ActionHookResult } from '../../actions/hooks'
import { getRoomsBuiltThisAction } from '../helpers/construction-events'
import type { CardImpl } from '../registry'

const CARD_ID = 'OLD_O07_BuildingTycoon'
/**
 * D128 Building Tycoon:
 * Each time another player builds 1+ rooms, you can pay them 1 food
 * to then build 1 room at full building cost.
 * Players 4+.
 *
 * Trigger: opponent's construct action completes (after phase).
 */
const listener: CardListenerRegistration = {
  id: 'OLD_O07_BuildingTycoon-building-tycoon-opponent-construct',
  cardIds: [CARD_ID],
  actions: ['construct'],
  phases: ['after' as ActionHookPhase],
  scope: 'opponent',
  handler: (context: CardListenerContext): ActionHookResult | void => {
    const triggerPlayer = context.triggerPlayer ?? context.player
    const roomsBuilt = getRoomsBuiltThisAction(context)
    if (roomsBuilt <= 0) return
    const triggerPlayerId = triggerPlayer.id
    return {
      flow: {
        type: 'seq',
        optional: true,
        children: [
          {
            type: 'leaf',
            actionId: 'pay',
            params: { food: 1 },
            sourceCard: CARD_ID,
          },
          {
            type: 'leaf',
            actionId: 'gain',
            params: { food: 1, recipientPlayerId: triggerPlayerId },
            sourceCard: CARD_ID,
          },
          {
            type: 'leaf',
            actionId: 'construct',
            sourceCard: CARD_ID,
            actionContext: { maxRooms: 1, trueAction: false },
          },
        ],
      },
      sourceCard: CARD_ID,
    }
  },
}

const cardImpl = {
  listeners: [listener],
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_O07_BuildingTycoon = defineOccupationCard({
  meta: {
  "id": "OLD_O07_BuildingTycoon",
  "name": "建筑大亨",
  "deck": "O",
  "number": 7,
  "category": "FARM_PLANNER",
  "desc": [
    "每当其他玩家扩建至少1间房屋后，你可以支付给他1份食物来扩建恰好1间房屋。（照常支付建造费用）"
  ],
  "cost": {},
  "players": "3+",
  "originalId": "O07_BuildingTycoon",
  "gameEdition": "classic",
  "vp": 0,
  "prerequisite": "",
  "passing": false,
  "extraVp": false,
  "implemented": true,
  "artUrl": "/card-art/classic/O07.png",
  "locales": {
    "zh": {
      "name": "建筑大亨",
      "desc": [
        "每当其他玩家扩建至少1间房屋后，你可以支付给他1份食物来扩建恰好1间房屋。（照常支付建造费用）"
      ],
      "prerequisite": ""
    }
  }
},
  impl: cardImpl,
})

export const OLD_O07_BuildingTycoon_impl = OLD_O07_BuildingTycoon.impl
