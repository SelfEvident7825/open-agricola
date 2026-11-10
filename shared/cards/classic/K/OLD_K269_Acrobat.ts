import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { readCardExtraData } from '../../helpers/card-state'
import { jumpLeaf } from '../../helpers/jump-leaf'
import { computeAllowedPlacementSpaces } from '../../../actions/helpers/placement-availability'
import type { ActionFlow } from '../../../contract/types'

const CARD_ID = 'OLD_K269_Acrobat'
type Visits = { round: number; workers: string[] }
const cardImpl = {
  listeners: [{
    id: CARD_ID + '-record-acrobat',
    cardIds: [CARD_ID],
    actionSpaces: ['traveling-players'],
    phases: ['after'],
    handler: (context) => {
      const workerId = typeof context.actionContext?.placedWorkerId === 'string'
        ? context.actionContext.placedWorkerId
        : [...(context.space?.takenBy ?? [])].reverse()
          .find(worker => worker.playerId === context.player.id)?.workerId
      if (!workerId) return
      const previous = readCardExtraData<Visits>(context.player, CARD_ID, 'visits')
      const workers = previous?.round === context.state.round ? previous.workers : []
      return {
        sourceCard: CARD_ID,
        flow: {
          type: 'leaf',
          actionId: 'special-effect',
          sourceCard: CARD_ID,
          params: {
            kind: 'set-extra-data',
            key: 'visits',
            value: { round: context.state.round, workers: [...new Set([...workers, workerId])] },
          },
        },
      }
    },
  }],
  effect: {
    id: CARD_ID,
    onAllWorkersPlaced: (state, player, context) => {
      const visits = readCardExtraData<Visits>(player, CARD_ID, 'visits')
      if (visits?.round !== state.round) return
      const allowed = computeAllowedPlacementSpaces(state, player, {
        actionHooks: context?.actionHooks,
        ignoreWorkerAvailability: true,
        actionSpaceUse: { newPlacement: false },
      })
      const targets = ['grain-seeds', 'farmland', 'cultivation']
        .filter(id => allowed.some(space => space.spaceId === id))
      const workers = visits.workers.filter(id => state.actionSpaces.some(space =>
        space.id === 'traveling-players'
        && space.takenBy.some(worker => worker.playerId === player.id && worker.workerId === id),
      ))
      if (!targets.length || !workers.length) return
      return {
        type: 'seq',
        children: workers.map(workerId => ({
          type: 'xor',
          optional: true,
          children: targets.map(targetSpaceId => jumpLeaf({ sourceCard: CARD_ID, workerId, targetSpaceId })),
        } as ActionFlow)),
      }
    },
  },
} satisfies CardImpl

export const OLD_K269_Acrobat = defineOccupationCard({
  meta: {
    id: 'OLD_K269_Acrobat',
    originalId: 'K269_Acrobat',
    gameEdition: 'classic',
    name: '空中飞人',
    deck: 'K',
    number: 269,
    desc: [
      '打出此卡后，每当你使用卖艺积累行动格后，在本回合工作阶段结束时，你可以将此家庭成员移动到未被占用（或者你通过其他卡牌效果能够使用）的小麦种子/犁田/粮食耕种[犁播]行动格并使用该格。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K269.png',
    locales: {
      zh: {
        name: '空中飞人',
        desc: [
          '打出此卡后，每当你使用卖艺积累行动格后，在本回合工作阶段结束时，你可以将此家庭成员移动到未被占用（或者你通过其他卡牌效果能够使用）的小麦种子/犁田/粮食耕种[犁播]行动格并使用该格。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
