import { defineOccupationCard } from '../../card-source'
import type { CardListenerContext, CardListenerRegistration } from '../../card-listeners'
import type { ActionHookPhase, ActionHookResult } from '../../../actions/hooks'
import { gainLeaf } from '../../helpers/pay-gain-node'
import { getMinorImprovementCard } from '../../catalog'
import { getMajorCard } from '../../major'
import { isMajorCardId } from '../../helpers/card-type'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E182_CharcoalBurner'
/**
 * C137 Charcoal Burner (Occupation, C, 137)
 * Each time any player plays/builds an improvement that has bake capability,
 * card owner gets 1 wood + 1 food.
 *
 * Rule: onPlayerAfterBuildImprovement — checks if the built improvement
 * has baking exchanges (isBaking flag).
 *
 * scope 'any' — fires when any player (including owner) builds a baking improvement.
 * Players 3+.
 */
const hasBakeCapability = (cardId: string): boolean => {
  if (isMajorCardId(cardId)) return getMajorCard(cardId)?.isBaking ?? false
  return getMinorImprovementCard(cardId)?.isBaking ?? false
}
const getBuiltCardId = (choice: string | undefined): string | undefined => {
  if (!choice) return undefined
  return choice.replace(/^major:/, '').replace(/^minor:/, '')
}
const listener: CardListenerRegistration = {
  id: 'OLD_E182_CharcoalBurner-charcoal-burner-any-bake-improvement',
  cardIds: [CARD_ID],
  actions: ['improvement'],
  phases: ['after' as ActionHookPhase],
  scope: 'any',
  handler: (context: CardListenerContext): ActionHookResult | void => {
    const builtCardId = getBuiltCardId(context.choice)
    if (!builtCardId) return
    if (!hasBakeCapability(builtCardId)) return
    return {
      flow: gainLeaf(CARD_ID, {
        wood: 1,
        food: 1,
      }),
      sourceCard: CARD_ID,
    }
  },
}
const cardImpl = {
  listeners: [listener],
  reaches: [] as readonly string[],
} satisfies CardImpl
export const OLD_E182_CharcoalBurner = defineOccupationCard({
  meta: {
    id: 'OLD_E182_CharcoalBurner',
    name: '烧炭工',
    deck: 'E',
    number: 182,
    category: 'GOODS_PROVIDER',
    desc: ['每当任意玩家（包括你自己）打出带有 图标的发展卡时，你便获得1根木头+1份食物。'],
    cost: {},
    players: '3+',
    originalId: 'E182_CharcoalBurner',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E182.png',
  },
  impl: cardImpl,
})
export const OLD_E182_CharcoalBurner_impl = OLD_E182_CharcoalBurner.impl
