import { defineMinorCard } from '../../card-source'
import { inactiveWorkersInSupply } from '../../../domain/player'
import { registerHarvestFeedingRequirementModifier } from '../../../actions/helpers/harvest-feeding-requirement'
import type { PlayerState } from '../../../contract/types'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K138_ReedHut'
const hutWorker = (player: PlayerState) => player.workers.find(worker =>
  worker.supplyUse?.sourceCard === CARD_ID && worker.supplyUse.status === 'temporary',
)

registerHarvestFeedingRequirementModifier(CARD_ID, ({ player }) => hutWorker(player) ? 2 : 0)

const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state, player) => {
      const worker = inactiveWorkersInSupply(player)[0]
      if (!worker) return
      worker.supplyUse = {
        sourceCard: CARD_ID,
        disposition: 'return-to-supply',
        status: 'temporary',
        availableFromRound: state.round,
        familyGrowthEligible: true,
      }
      worker.isNewborn = false
    },
    getStatePresentation: player => ({ heldWorkerId: hutWorker(player)?.id }),
  },
} satisfies CardImpl

export const OLD_K138_ReedHut = defineMinorCard({
  meta: {
    id: 'OLD_K138_ReedHut',
    originalId: 'K138_ReedHut',
    gameEdition: 'classic',
    name: '芦苇小屋',
    deck: 'K',
    number: 138,
    desc: [
      '打出此卡时，如果你的个人供应区还有家庭成员，立即将1名个人供应区的家庭成员放在此卡上。可从本回合开始派遣此家庭成员。此家庭成员不算作你的家庭成员，需要喂养，可以通过其他家庭成员的“生娃”行动将其移入你个人农场的其他空间中。',
    ],
    cost: {
      wood: 1,
      reed: 4,
    },
    vp: 1,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K138.png',
  },
  impl: cardImpl,
})
export const OLD_K138_ReedHut_impl = OLD_K138_ReedHut.impl
