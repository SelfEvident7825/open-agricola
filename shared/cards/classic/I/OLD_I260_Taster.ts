import { isWorkerPlacementBlocked } from '../../card-effects'
import { availableWorkers } from '../../../domain/player'
import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_I260_Taster'

const cardImpl = {
  effect: {
    id: CARD_ID,
    onBeforeWork: (state, player) => {
      const first = state.players.find((p) => p.startPlayer)
      if (
        !first ||
        first.id === player.id ||
        player.resources.food < 1 ||
        isWorkerPlacementBlocked(state, player) ||
        availableWorkers(state, player).length === 0
      )
        return
      return {
        type: 'seq',
        optional: true,
        children: [
          {
            type: 'leaf',
            actionId: 'gain',
            sourceCard: CARD_ID,
            params: {
              food: 1,
              payerId: player.id,
              recipientPlayerId: first.id,
            },
          },
          { type: 'leaf', actionId: 'place-farmer', sourceCard: CARD_ID },
        ],
      }
    },
  },
} satisfies CardImpl
export const OLD_I260_Taster = defineOccupationCard({
  meta: {
    id: 'OLD_I260_Taster',
    originalId: 'I260_Taster',
    gameEdition: 'classic',
    name: '试味员',
    deck: 'I',
    number: 260,
    desc: ['每回合开始时，如果你不是起始玩家，你可以支付起始玩家1份食物并先于他派遣一名家庭成员。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '3+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I260.png',
  },
  impl: cardImpl,
})
export const OLD_I260_Taster_impl = OLD_I260_Taster.impl
