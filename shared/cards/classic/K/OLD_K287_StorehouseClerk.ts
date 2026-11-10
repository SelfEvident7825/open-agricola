import { defineOccupationCard } from '../../card-source'
import { gainLeaf } from '../../helpers/pay-gain-node'
import type { Resource } from '../../../contract/types'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K287_StorehouseClerk'
const cardImpl = {
  effect: {
    id: CARD_ID,
    onBeforeStartOfTurn: (_state, player) => {
      const resources: Partial<Resource> = {}
      for (const [resource, minimum] of [['stone', 5], ['reed', 6], ['clay', 7], ['wood', 8]] as const) {
        if (player.resources[resource] >= minimum) resources[resource] = 1
      }
      if (Object.keys(resources).length) return gainLeaf(CARD_ID, resources)
    },
  },
} satisfies CardImpl

export const OLD_K287_StorehouseClerk = defineOccupationCard({
  meta: {
    id: 'OLD_K287_StorehouseClerk',
    originalId: 'K287_StorehouseClerk',
    gameEdition: 'classic',
    name: '仓库簿记',
    deck: 'K',
    number: 287,
    desc: [
      '每回合开始时，如果你有不少于5石头/6芦苇/7砖头/8木头，则你获得1石头/1芦苇/1砖头/1木头。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K287.png',
  },
  impl: cardImpl,
})
