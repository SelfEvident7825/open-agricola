import { defineOccupationCard } from '../../card-source'
import type { CardListenerContext, CardListenerRegistration } from '../../card-listeners'
import type { ActionHookPhase, ActionHookResult } from '../../../actions/hooks'
import type { ActionFlow, GameState, PlayerState } from '../../../contract/types'
import { isCardFlagged } from '../../helpers/card-state'
import { gainLeaf } from '../../helpers/pay-gain-node'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E193_Pastor'
/** Shared predicate + flow used by both `effect.onBuy` and the after-construct
 *  listener — mirrors the reference's `onBuy($p) { return $this->onAfterConstruct(...) }`. */
const evaluatePastorTrigger = (state: GameState, ownerPlayer: PlayerState): ActionFlow | null => {
  if (isCardFlagged(ownerPlayer, CARD_ID)) return null
  if (ownerPlayer.rooms !== 2) return null
  const othersWith2Rooms = (state.players ?? []).filter(
    (p) => p.id !== ownerPlayer.id && p.rooms === 2,
  )
  if (othersWith2Rooms.length > 0) return null
  return {
    type: 'seq',
    children: [
      gainLeaf(CARD_ID, {
        wood: 3,
        clay: 2,
        reed: 1,
        stone: 1,
      }),
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
  }
}
/**
 * B163 Pastor — One-time trigger: after any player constructs a room,
 * if the card owner is the only player with exactly 2 rooms, the owner
 * gets 3 wood + 2 clay + 1 reed + 1 stone.
 *
 * Scope: 'any' — we check all construction events (owner or opponents).
 * Uses flag-card to ensure one-time effect.
 */
const listener: CardListenerRegistration = {
  id: 'OLD_E193_Pastor-pastor-after-construct',
  cardIds: [CARD_ID],
  actions: ['construct'],
  phases: ['after' as ActionHookPhase],
  scope: 'any',
  handler: (context: CardListenerContext): ActionHookResult | void => {
    const ownerPlayer = context.ownerPlayer
    if (!ownerPlayer) return
    const flow = evaluatePastorTrigger(context.state, ownerPlayer)
    if (!flow) return
    return {
      flow,
      sourceCard: CARD_ID,
    }
  },
}
const cardImpl = {
  listeners: [listener],
  effect: {
    id: CARD_ID,
    // Rule: `onBuy($p) { return $this->onAfterConstruct($p, []) }` — purchasing
    // the card triggers the same evaluation as a construct event, so a player
    // who is already alone at 2 rooms when buying gets the bonus immediately.
    onBuy: (state, player) => evaluatePastorTrigger(state, player) ?? undefined,
  },
  reaches: [] as readonly string[],
} satisfies CardImpl
export const OLD_E193_Pastor = defineOccupationCard({
  meta: {
    id: 'OLD_E193_Pastor',
    name: '牧师',
    deck: 'E',
    number: 193,
    category: 'BUILDING_RESOURCE_PROVIDER',
    desc: [
      '限1次：打出此卡时，或在之后的游戏中，一旦你是场上唯一1名仅有2间房屋的玩家，你立即获得3根木头+2块砖头+1捆芦苇+1块石头。WM075移除木屋板块可立即获得资源，然后可使用此卡的资源围建WM075栅栏',
    ],
    cost: {},
    players: '3+',
    originalId: 'E193_Pastor',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E193.png',
    locales: {
      zh: {
        name: '牧师',
        desc: [
          '限1次：打出此卡时，或在之后的游戏中，一旦你是场上唯一1名仅有2间房屋的玩家，你立即获得3根木头+2块砖头+1捆芦苇+1块石头。WM075移除木屋板块可立即获得资源，然后可使用此卡的资源围建WM075栅栏',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E193_Pastor_impl = OLD_E193_Pastor.impl
