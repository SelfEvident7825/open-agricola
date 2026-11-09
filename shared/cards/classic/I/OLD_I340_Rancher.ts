import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { gainLeaf } from '../../helpers/pay-gain-node'
import { getUsedFarmyardTileKeys } from '../../../domain/farm'
const CARD_ID = 'OLD_I340_Rancher'

const cardImpl = {
  effect: {
    id: CARD_ID,
    onRoundStart: (state, player) =>
      state.players.every(
        (other) =>
          other.id === player.id ||
          getUsedFarmyardTileKeys(player).size > getUsedFarmyardTileKeys(other).size,
      )
        ? gainLeaf(CARD_ID, { wood: 1 })
        : undefined,
  },
} satisfies CardImpl
export const OLD_I340_Rancher = defineOccupationCard({
  meta: {
    id: 'OLD_I340_Rancher',
    originalId: 'I340_Rancher',
    gameEdition: 'classic',
    name: '农场工人',
    deck: 'I',
    number: 340,
    desc: [
      '每回合开始时，如果你农场中已使用的农场格子数量比所有人都多(一样多不算)，你获得1根木头。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '4+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I340.png',
    locales: {
      zh: {
        name: '农场工人',
        desc: [
          '每回合开始时，如果你农场中已使用的农场格子数量比所有人都多(一样多不算)，你获得1根木头。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_I340_Rancher_impl = OLD_I340_Rancher.impl
