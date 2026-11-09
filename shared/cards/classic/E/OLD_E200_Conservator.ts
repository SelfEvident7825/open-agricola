import { defineOccupationCard } from '../../card-source'
import type { CardListenerRegistration } from '../../card-listeners'
import type { ActionHookPhase } from '../../../actions/hooks'
import { buildRenovationPlan, canRenovate } from '../../../actions/effects/renovation'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E200_Conservator'
/**
 * A87 Conservator — Occupation.
 *
 * Effect: when you take a Renovation action, you may renovate your wooden
 * house directly into a stone house, paying the stone-tier cost (1 stone + 1
 * reed per room) and skipping the clay tier entirely. Otherwise the action
 * resolves as a normal renovation.
 *
 * Implementation strategy (engine "computeChoiceCandidates" opt-in flow):
 *
 *  - The renovate-house action declares `getBaseChoiceOptions` so the engine
 *    enumerates renovation targets ({wood→clay} or {clay→stone} by default).
 *  - This card registers a `computeChoiceCandidates` listener that injects an
 *    extra "stone" target when the owner is on a wooden house. The engine
 *    merges base + extra options, filters by per-option affordability, and:
 *      · 1 affordable → auto-resolves silently (no choice presented).
 *      · ≥2 affordable → presents the choice with the wood→stone option
 *        labelled as "Renovate directly to stone (Conservator)".
 *  - The `isDoable` listener rescues entry visibility for the case where a
 *    wood-house owner cannot afford the standard clay tier but CAN afford
 *    the wood→stone direct path; without it the action would be greyed out
 *    by the default cost preview affordability check.
 */
const choiceCandidateListener: CardListenerRegistration = {
  id: 'OLD_E200_Conservator-conservator-add-stone-renovation-target',
  cardIds: [CARD_ID],
  phases: ['computeChoiceCandidates' as ActionHookPhase],
  actions: ['renovate-house'],
  handler: (context) => {
    if (!context.player.occupationPlayed.includes(CARD_ID)) return
    if (context.player.houseType !== 'wood') return
    return {
      extraOptions: [
        {
          value: 'stone',
          labelKey: 'ui.interactionConservatorDirectStone',
          sourceCard: CARD_ID,
        },
      ],
      sourceCard: CARD_ID,
    }
  },
}
const isDoableListener: CardListenerRegistration = {
  id: 'OLD_E200_Conservator-conservator-isDoable-renovate-house',
  cardIds: [CARD_ID],
  phases: ['isDoable' as ActionHookPhase],
  actions: ['renovate-house'],
  handler: (context) => {
    if (!context.player.occupationPlayed.includes(CARD_ID)) return
    if (context.player.houseType !== 'wood') return
    if (context.doable) return
    const stonePlan = buildRenovationPlan(context.player, 'stone')
    if (!canRenovate(context.player, undefined, stonePlan)) return
    return { doable: true }
  },
}
const cardImpl = {
  listeners: [choiceCandidateListener, isDoableListener],
  reaches: [] as readonly string[],
} satisfies CardImpl
export const OLD_E200_Conservator = defineOccupationCard({
  meta: {
    id: 'OLD_E200_Conservator',
    name: '建筑复原师',
    deck: 'E',
    number: 200,
    category: 'FARM_PLANNER',
    desc: ['在翻修房屋时，你可以跳过砖屋，直接将木屋翻修成石屋。'],
    cost: {},
    players: '4+',
    originalId: 'E200_Conservator',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E200.png',
    locales: {
      zh: {
        name: '建筑复原师',
        desc: ['在翻修房屋时，你可以跳过砖屋，直接将木屋翻修成石屋。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E200_Conservator_impl = OLD_E200_Conservator.impl
