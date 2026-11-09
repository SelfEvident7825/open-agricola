// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../../card-listeners'
import type { ActionHookPhase, ActionHookResult } from '../../../actions/hooks'
import { isActionDoableInFlowContext } from '../../../actions/flow'
import { getActionDefinition } from '../../../actions/index'
import { isCardFlagged } from '../../helpers/card-state'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_FR045_StoneHouseReconstruction'
/**
 * E13 Stone House Reconstruction — At any time, you can renovate your clay house
 * to a stone house without placing a person. (You must pay the normal renovation cost.)
 *
 * Rule: isListeningTo → player has clay house and card not flagged.
 * Once flagged (used), stays flagged (once per game implicitly via room type).
 *
 * Implementation: anytime listener checks for clay house type, not flagged.
 * Triggers renovation action (which handles the cost and house type change).
 */
const anytimeListener: CardListenerRegistration = {
  id: 'OLD_FR045_StoneHouseReconstruction-stone-house-reconstruction-anytime',
  cardIds: [CARD_ID],
  actions: ['anytime'],
  phases: ['anytime' as ActionHookPhase],
  preScoring: true,
  handler: (context: CardListenerContext): ActionHookResult | void => {
    if (isCardFlagged(context.player, CARD_ID)) return
    if (context.player.houseType !== 'clay') return
    const renovation = getActionDefinition('renovate-house')
    if (
      !renovation ||
      !isActionDoableInFlowContext({
        actionHooks: context?.actionHooks,
        actionId: renovation.id,
        action: renovation,
        state: context.state,
        player: context.player,
        space: context.space,
        sourceCard: CARD_ID,
        resolveAction: getActionDefinition,
      })
    )
      return
    return {
      flow: {
        type: 'seq',
        children: [
          {
            type: 'leaf',
            actionId: 'special-effect',
            sourceCard: CARD_ID,
            params: { kind: 'set-flag', flag: true },
          },
          { type: 'leaf', actionId: 'renovate-house', sourceCard: CARD_ID },
          {
            type: 'leaf',
            actionId: 'special-effect',
            sourceCard: CARD_ID,
            params: { kind: 'set-flag', flag: false },
          },
        ],
      },
      sourceCard: CARD_ID,
    }
  },
}

const cardImpl = {
  listeners: [anytimeListener],
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_FR045_StoneHouseReconstruction = defineMinorCard({
  meta: {
    id: 'OLD_FR045_StoneHouseReconstruction',
    name: '重建石屋',
    deck: 'FR',
    number: 45,
    category: 'FARMYARD_-_HOUSE_BUILDING_OR_RENOVATION',
    desc: ['你可以在任意时刻将你的砖屋翻修成石屋(正常支付)'],
    cost: {
      stone: 1,
    },
    vp: 1,
    originalId: 'FR045_StoneHouseReconstruction',
    gameEdition: 'classic',
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/FR/FR045.png',
    locales: {
      zh: {
        name: '重建石屋',
        desc: ['你可以在任意时刻将你的砖屋翻修成石屋(正常支付)'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_FR045_StoneHouseReconstruction_impl = OLD_FR045_StoneHouseReconstruction.impl
