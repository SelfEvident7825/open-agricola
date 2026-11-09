import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { holdWorkerOnCard, releaseWorkerFromCard } from '../../helpers/card-held-workers'
import { availableWorkers } from '../../../domain/player'
const CARD_ID = 'OLD_E198_Ratcatcher'
const cardImpl = {
  effect: {
    id: CARD_ID,
    onWorkStart: (state, owner) => {
      if (![10, 12].includes(state.round)) return
      for (const player of state.players) {
        if (player.id === owner.id) continue
        const child = player.workers
          .filter((w) => w.isActive)
          .slice(2)
          .find((w) => !w.isNewborn && availableWorkers(state, player).some((a) => a.id === w.id))
        if (child) holdWorkerOnCard(player, CARD_ID, child.id)
      }
    },
    onReturnHome: (state) => {
      for (const player of state.players) releaseWorkerFromCard(player, CARD_ID)
    },
  },
} satisfies CardImpl
export const OLD_E198_Ratcatcher = defineOccupationCard({
  meta: {
    id: 'OLD_E198_Ratcatcher',
    originalId: 'E198_Ratcatcher',
    gameEdition: 'classic',
    name: '捕鼠人',
    deck: 'E',
    number: 198,
    desc: [
      '此卡只能在第九回合结束前打出。在第10和第12回合，所有其他玩家必须少派遣1名家庭成员的后代。(指第3、4、5名家庭成员)',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '4+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E198.png',
    locales: {
      zh: {
        name: '捕鼠人',
        desc: [
          '此卡只能在第九回合结束前打出。在第10和第12回合，所有其他玩家必须少派遣1名家庭成员的后代。(指第3、4、5名家庭成员)',
        ],
        prerequisite: '',
      },
    },
    maxRound: 9,
  },
  presentation: { heldWorker: true },
  impl: cardImpl,
})
export const OLD_E198_Ratcatcher_impl = OLD_E198_Ratcatcher.impl
