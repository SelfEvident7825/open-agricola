import { defineMinorCard } from '../../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../../card-listeners'
import type { ActionHookPhase, ActionHookResult } from '../../../actions/hooks'
import type { ActionChoiceOption } from '../../../contract/types'
import { OCCUPIED_SPACE_CHOICE_PREFIX } from '../../../actions/effects/place-farmer'
import { getLogicalFields } from '../../helpers/card-field'
import { isSpaceOccupied } from '../../../domain/space'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K139_SleepingCorner'
/**
 * K139 Sleeping Corner — You can use any __Wish for Children__ action space
 * even if it is occupied by one other player's person.
 *
 * Rule: onPlayerComputeArgsPlaceFarmer adds WishChildren spaces that have
 * exactly 1 farmer on them (not a child).
 *
 * Prerequisite: 2 Grain Fields.
 */
const computeArgsListener: CardListenerRegistration = {
  id: 'OLD_K139_SleepingCorner-sleeping-corner-compute-args',
  cardIds: [CARD_ID],
  phases: ['computeArgs' as ActionHookPhase],
  actions: ['place-farmer'],
  handler: (context: CardListenerContext): ActionHookResult | void => {
    if (!context.player.minorPlayed.includes(CARD_ID)) return
    const wishChildrenSpaces = context.state.actionSpaces.filter(
      (s) => s.id === 'wish-children' || s.id === 'urgent-wish-children' || (s.id === 'modest-wish-children-56' && context.state.round >= 5),
    )
    const extraOptions: ActionChoiceOption[] = wishChildrenSpaces
      .filter((space) => {
        if (!isSpaceOccupied(space)) return false
        if (space.takenBy.some((ref) => ref.playerId === context.player.id)) return false
        const otherAdultWorkers = space.takenBy.filter((ref) => {
          if (ref.synthetic) return false
          const owner = context.state.players.find((candidate) => candidate.id === ref.playerId)
          const worker = owner?.workers.find((candidate) => candidate.id === ref.workerId)
          return !!worker && (worker.isActive || worker.supplyUse?.status === 'temporary') && !worker.isNewborn
        })
        return otherAdultWorkers.length === 1
      })
      .map((s) => ({
        value: `${OCCUPIED_SPACE_CHOICE_PREFIX}${s.id}`,
        labelKey: s.nameKey,
        sourceCard: CARD_ID,
      }))
    if (extraOptions.length === 0) return
    return { extraOptions, sourceCard: CARD_ID }
  },
}

const cardImpl = {
  prerequisiteCheck: player => getLogicalFields(player).filter(field => field.stacks.some(stack => stack.kind === 'grain' && stack.remaining > 0)).length >= 2,
  listeners: [computeArgsListener],
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_K139_SleepingCorner = defineMinorCard({
  meta: {
    id: 'OLD_K139_SleepingCorner',
    name: '卧室',
    deck: 'K',
    number: 139,
    category: 'ACTIONS_BOOSTER',
    desc: [
      '即使已有其他1名玩家占据了写有“生娃”行动的行动格，你仍可使用此行动格。（1）你可占据五人局“技能培训/生娃“行动格，只执行”技能培训“行动（从第5回合起）。（2）被多名其他玩家占据，你不可以使用；被自己家庭成员占据，你不可以使用。（3）此卡牌打出条件“麦田×2”包括卡牌田。',
    ],
    cost: {
      wood: 1,
    },
    vp: 1,
    prerequisite: '2 Grain Fields',
    originalId: 'K139_SleepingCorner',
    gameEdition: 'classic',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K139.png',
  },
  impl: cardImpl,
})

export const OLD_K139_SleepingCorner_impl = OLD_K139_SleepingCorner.impl
