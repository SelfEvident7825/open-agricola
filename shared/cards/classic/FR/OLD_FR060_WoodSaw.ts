// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../../card-listeners'
import type { ActionHookPhase, ActionHookResult } from '../../../actions/hooks'
import { familySize } from '../../../domain/player'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_FR060_WoodSaw'
/**
 * E14 Wood Saw — Each time all other players have more people than you,
 * you can take a __Build Rooms__ action without placing a person.
 *
 * Rule: isListeningTo → all other players have more farmers than this player.
 * onPlayerAtAnytime → construct action (optional).
 *
 * Implementation: anytime listener checks if ALL other players have more
 * farmers. If so, offer the construct action.
 */
const anytimeListener: CardListenerRegistration = {
  id: 'OLD_FR060_WoodSaw-wood-saw-anytime',
  cardIds: [CARD_ID],
  actions: ['anytime'],
  phases: ['anytime' as ActionHookPhase],
  preScoring: true,
  handler: (context: CardListenerContext): ActionHookResult | void => {
    const myFamilySize = familySize(context.player)
    // Check if ALL other players have more farmers than current player
    const otherPlayers = context.state.players.filter((p) => p.id !== context.player.id)
    if (otherPlayers.length === 0) return
    const allOthersHaveMore = otherPlayers.every((p) => familySize(p) > myFamilySize)
    if (!allOthersHaveMore) return
    return {
      flow: {
        type: 'leaf',
        actionId: 'construct',
        optional: true,
        sourceCard: CARD_ID,
        params: { maxRooms: 1 },
      },
      sourceCard: CARD_ID,
    }
  },
}

const cardImpl = {
  listeners: [anytimeListener],
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_FR060_WoodSaw = defineMinorCard({
  meta: {
    id: 'OLD_FR060_WoodSaw',
    name: '木锯',
    deck: 'FR',
    number: 60,
    category: 'FARMYARD_-_HOUSE_BUILDING_OR_RENOVATION',
    desc: ['每当所有其他玩家的家庭成员都比你多时，你可以在任意时刻执行1次“建造房屋”行动'],
    cost: {
      wood: 1,
    },
    originalId: 'FR060_WoodSaw',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/FR/FR060.png',
    locales: {
      zh: {
        name: '木锯',
        desc: ['每当所有其他玩家的家庭成员都比你多时，你可以在任意时刻执行1次“建造房屋”行动'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_FR060_WoodSaw_impl = OLD_FR060_WoodSaw.impl
