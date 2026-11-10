import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { jumpLeaf } from '../../helpers/jump-leaf'
import { computeAllowedPlacementSpaces } from '../../../actions/helpers/placement-availability'
import type { ActionFlow } from '../../../contract/types'

const CARD_ID = 'OLD_K289_Countryman'
const cardImpl = {
  effect: {
    id: CARD_ID,
    onBeforeReturnHome: (state, player, context) => {
      const workers = state.actionSpaces
        .filter(space => ['grain-seeds', 'vegetable-seeds'].includes(space.id))
        .flatMap(space => space.takenBy.filter(worker => worker.playerId === player.id))
      if (!workers.length) return
      const allowed = computeAllowedPlacementSpaces(state, player, {
        actionHooks: context?.actionHooks,
        sourceCard: CARD_ID,
        actionSpaceUse: { newPlacement: false },
        ignoreWorkerAvailability: true,
      })
      const targets = allowed.filter(target =>
        ['grain-utilization', 'cultivation'].includes(target.spaceId) &&
        !state.actionSpaces.find(space => space.id === target.spaceId)?.takenBy.length,
      )
      const children: ActionFlow[] = workers.flatMap(worker => targets.map(target => ({
        ...jumpLeaf({ sourceCard: CARD_ID, workerId: worker.workerId, targetSpaceId: target.spaceId }),
        choiceLabelKey: `actions.${target.spaceId}.name`,
      })))
      return children.length ? { type: 'xor', optional: true, children } : undefined
    },
  },
} satisfies CardImpl

export const OLD_K289_Countryman = defineOccupationCard({
  meta: {
    id: 'OLD_K289_Countryman',
    originalId: 'K289_Countryman',
    gameEdition: 'classic',
    name: '乡下人',
    deck: 'K',
    number: 289,
    desc: [
      '每回合所有玩家派遣完家庭成员后，你可以将1个你在小麦种子或蔬菜种子行动格上的家庭成员移动到一个未被占用的（）可以提供"播种"行动的行动格并使用该格。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '4+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K289.png',
  },
  impl: cardImpl,
})

export const OLD_K289_Countryman_impl = OLD_K289_Countryman.impl
