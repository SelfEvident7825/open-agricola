import { defineMinorCard } from '../../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../../card-listeners'
import type { ActionHookResult } from '../../../actions/hooks'
import type { CardImpl } from '../../registry'
import { createEventQuery } from '../../../events/query'
import { isLessonsSpaceId } from '../../helpers/lessons-spaces'
const CARD_ID = 'OLD_E49_WritingDesk'
const listener: CardListenerRegistration = {
  id: 'OLD_E49_WritingDesk-writing-desk-before-place-farmer',
  cardIds: [CARD_ID],
  phases: ['after'],
  actionSpaces: 'all',
  handler: (context: CardListenerContext): ActionHookResult | void => {
    const spaceId = context.space?.id
    if (
      !isLessonsSpaceId(spaceId) ||
      !createEventQuery(context.actionEvents ?? []).filter(
        'card.played',
        (e) => e.cardType === 'occupation',
      ).length
    )
      return
    // Resolve the extra occupation after the normal Lessons occupation.
    if ((context.player.occupationHand?.length ?? 0) < 1) return
    return {
      flow: {
        type: 'leaf',
        actionId: 'occupation',
        optional: true,
        sourceCard: CARD_ID,
        params: { exactCost: { food: 2 } },
      },
      sourceCard: CARD_ID,
    }
  },
}
const cardImpl = {
  listeners: [listener],
  reaches: [] as readonly string[],
} satisfies CardImpl
export const OLD_E49_WritingDesk = defineMinorCard({
  meta: {
    id: 'OLD_E49_WritingDesk',
    name: '写字台',
    deck: 'E',
    number: 49,
    category: 'ACTIONS_BOOSTER',
    desc: [
      '每当你使用技能培训行动格打出1张职业卡时，你可以额外支付2份食物作为技能培训费再打出1张职业卡。',
    ],
    cost: {
      wood: 1,
    },
    vp: 1,
    prerequisite: '2 Occupations',
    occupationPrerequisites: {
      min: 2,
    },
    originalId: 'E49_WritingDesk',
    gameEdition: 'classic',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E49.png',
  },
  impl: cardImpl,
})
export const OLD_E49_WritingDesk_impl = OLD_E49_WritingDesk.impl
