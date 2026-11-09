// Generated classic import. Remove this line before manually porting a card.
import { defineOccupationCard } from '../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../card-listeners'
import type { ActionHookPhase, ActionHookResult } from '../../actions/hooks'
import type { ActionFlow, GameState, PlayerState } from '../../contract/types'
import { futureMeeplesNode } from '../../actions/effects/internal/future-meeples'
import { isCardFlagged } from '../helpers/card-state'
import type { CardImpl } from '../registry'

const CARD_ID = 'OLD_I242_ClayHutBuilder'
/**
 * A120 Clay Hut Builder
 * Once you no longer live in a wooden house, place 2 clay on each of the
 * next 5 round spaces. At the start of these rounds, you get the clay.
 *
 * Rule: onBuy returns the same flow as the after-renovation listener. The
 * flow flags the card first, so the clay is scheduled only once.
 */

const placeClay = (
  state: GameState,
  player: PlayerState,
): ActionFlow | undefined => {
  if (player.houseType === 'wood') return
  if (isCardFlagged(player, CARD_ID)) return

  return {
    type: 'seq',
    children: [
      {
        type: 'leaf',
        actionId: 'special-effect',
        sourceCard: CARD_ID,
        params: { kind: 'set-flag', flag: true },
      },
      futureMeeplesNode({
        cardId: CARD_ID,
        playerId: player.id,
        startRound: state.round + 1,
        count: 5,
        resources: { clay: 2 },
      }),
    ],
  }
}

const listener: CardListenerRegistration = {
  id: 'OLD_I242_ClayHutBuilder-clay-hut-builder-after-renovation',
  cardIds: [CARD_ID],
  actions: ['renovate-house'],
  phases: ['after' as ActionHookPhase],
  handler: (context: CardListenerContext): ActionHookResult | void => {
    const flow = placeClay(context.state, context.player)
    if (!flow) return
    return { flow, sourceCard: CARD_ID }
  },
}

const cardImpl = {
  listeners: [listener],
  effect: {
  id: CARD_ID,
  onBuy: (state, player) => placeClay(state, player),
},
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_I242_ClayHutBuilder = defineOccupationCard({
  meta: {
  "id": "OLD_I242_ClayHutBuilder",
  "name": "砖屋建筑工",
  "deck": "I",
  "number": 242,
  "category": "BUILDING_RESOURCE_PROVIDER",
  "desc": [
    "限一次：一旦你的房屋等级是砖屋/石屋，在之后5个回合的行动格上各放2块砖头。这些回合开始时，你获得对应的砖头。"
  ],
  "cost": {},
  "players": "1+",
  "originalId": "I242_ClayHutBuilder",
  "gameEdition": "classic",
  "vp": 0,
  "prerequisite": "",
  "passing": false,
  "extraVp": false,
  "implemented": true,
  "artUrl": "/card-art/classic/I242.png",
  "locales": {
    "zh": {
      "name": "砖屋建筑工",
      "desc": [
        "限一次：一旦你的房屋等级是砖屋/石屋，在之后5个回合的行动格上各放2块砖头。这些回合开始时，你获得对应的砖头。"
      ],
      "prerequisite": ""
    }
  }
},
  impl: cardImpl,
})

export const OLD_I242_ClayHutBuilder_impl = OLD_I242_ClayHutBuilder.impl
