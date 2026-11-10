import type {
  ActionDefinition,
  ActionMutationContext,
  ActionExecutionResult,
  GameState,
  PlayerState,
} from '../../contract/types'
import type { EventSink } from '../../contract/events'
import { getExtraRoomCapacity } from '../../cards/card-effects'
import { activateSmallestInactive, familySize, familyGrowthCandidates, hasFamilyGrowthCandidate } from '../../domain/player'
import { addWorkerRef, findActionSpaceById, findActionSpaceByWorker } from '../../domain/space'
import { holdWorkerOnCard } from '../../cards/helpers/card-held-workers'
import { readActionSnapshotExtraData } from '../../cards/helpers/action-snapshot'
import { cardIdentityChoice } from '../helpers/card-choice'

const effectiveRooms = (player: PlayerState) =>
  player.rooms + getExtraRoomCapacity(player)

const actingWorkerId = (player: PlayerState, actionContext?: Record<string, unknown>): string | undefined => {
  if (actionContext?.viaCardJump === true) {
    return typeof actionContext.workerId === 'string' ? actionContext.workerId : undefined
  }
  return typeof actionContext?.placedWorkerId === 'string' ? actionContext.placedWorkerId
    : readActionSnapshotExtraData<string>(player, 'placedWorkerId')
}

const growFamilyChoice = (ctx: ActionMutationContext, choice: string): ActionExecutionResult => {
  const { state, player, space, actionContext, eventSink } = ctx
  if (actionContext?.skipRoomCheck !== true && effectiveRooms(player) <= familySize(player)) {
    return { type: 'fail', errorKey: 'log.familyGrowthFail' }
  }
  const candidates = familyGrowthCandidates(player, actingWorkerId(player, actionContext))
  if (choice === 'newborn') {
    if (!candidates.some(worker => !worker.supplyUse)) return { type: 'fail', errorKey: 'log.familyFull' }
    const holdNewbornOnCard = typeof actionContext?.holdNewbornOnCard === 'string' ? actionContext.holdNewbornOnCard : undefined
    return growFamilyCore(state, player, space.id, eventSink, { holdNewbornOnCard })
  }
  const worker = candidates.find(candidate => choice === `join-family:${candidate.id}` && candidate.supplyUse)
  if (!worker) return { type: 'fail', errorKey: 'log.familyGrowthFail' }
  const sourceCard = worker.supplyUse?.sourceCard
  worker.isActive = true
  worker.isNewborn = false
  delete worker.supplyUse
  // Joining the family neither recalls a placed person nor creates another action.
  eventSink?.emit<'worker.placed'>({
    type: 'worker.placed', workerId: worker.id,
    spaceId: findActionSpaceByWorker(state, player.id, worker.id)?.id ?? `card:${sourceCard ?? ''}`,
  })
  return { type: 'ok' }
}

const growFamilyCore = (
  state: GameState,
  player: PlayerState,
  fgSpaceId: string,
  eventSink?: EventSink,
  options: { holdNewbornOnCard?: string } = {},
): ActionExecutionResult => {
  const newborn = activateSmallestInactive(player)
  if (!newborn) return { type: 'fail', errorKey: 'log.familyFull' }
  const fgSpace = findActionSpaceById(state, fgSpaceId)
  if (options.holdNewbornOnCard) {
    holdWorkerOnCard(player, options.holdNewbornOnCard, newborn.id)
  } else if (fgSpace) {
    // Push newborn WorkerRef onto the FG space.
    // Deliberately NOT calling recordRoundPlacement — newborns don't count as placements.
    addWorkerRef(fgSpace, player.id, newborn.id)
  }
  eventSink?.emit<'worker.placed'>({
    type: 'worker.placed',
    workerId: newborn.id,
    spaceId: options.holdNewbornOnCard ? `card:${options.holdNewbornOnCard}` : fgSpaceId,
  })
  return { type: 'ok' }
}

/**
 * Sprint 6a: unified `family-growth` action. Replaces both
 * `wish-children-growth` (room-required) and `grow-family-without-room`.
 * Pass `actionContext.skipRoomCheck: true` from the calling flow / space to
 * bypass the free-room precondition (urgent wish-children, E22, etc.).
 */
export const familyGrowthAction: ActionDefinition = {
  id: 'family-growth',
  nameKey: 'actions.family-growth.name',
  descriptionKey: 'actions.family-growth.description',
  previewEffect: ({ actionContext }) => ({ kind: 'familyGrowth', roomRequired: actionContext?.skipRoomCheck !== true, heldOnCard: typeof actionContext?.holdNewbornOnCard === 'string' ? actionContext.holdNewbornOnCard : undefined }),
  roundAvailable: 1,
  gainPerRound: {},
  canBeExecutedByPlayer: (_state, player, context) => {
    if (!hasFamilyGrowthCandidate(player, actingWorkerId(player, context?.actionContext))) return false
    const skipRoom =
      (context?.actionContext as { skipRoomCheck?: boolean } | undefined)?.skipRoomCheck === true
    return skipRoom || effectiveRooms(player) > familySize(player)
  },
  execute: (ctx): ActionExecutionResult => {
    const { player, actionContext } = ctx
    const skipRoom =
      (actionContext as { skipRoomCheck?: boolean } | undefined)?.skipRoomCheck === true
    if (!skipRoom && effectiveRooms(player) <= familySize(player)) {
      return { type: 'fail', errorKey: 'log.familyGrowthFail' }
    }
    const candidates = familyGrowthCandidates(player, actingWorkerId(player, actionContext))
    const cardPeople = candidates.filter(worker => worker.supplyUse)
    if (cardPeople.length === 0) return growFamilyChoice(ctx, 'newborn')
    return {
      type: 'request', promptKey: 'ui.interactionChooseFamilyGrowth',
      request: { kind: 'choice', options: [
        ...(candidates.some(worker => !worker.supplyUse)
          ? [{ value: 'newborn', labelKey: 'ui.interactionGrowNewborn' }] : []),
        ...cardPeople.map(worker => cardIdentityChoice(worker.supplyUse!.sourceCard ?? '', 'minor', `join-family:${worker.id}`)),
      ] },
    }
  },
  resolveChoice: growFamilyChoice,
}
