import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { animalKeysForState } from '../../../contract/animals'
import { createEventQuery } from '../../../events/query'
import { gainLeaf } from '../../helpers/pay-gain-node'

const CARD_ID = 'OLD_K299_Slaughterman'
const cardImpl = {
  effect: {
    id: CARD_ID,
    computeHarvestFeedingOrderPriority: () => 1,
  },
  listeners: [{
    id: CARD_ID + '-slaughter',
    cardIds: [CARD_ID],
    actions: ['exchange'],
    phases: ['after'],
    scope: 'opponent',
    handler: context => createEventQuery(context.actionEvents ?? []).filter('resource.exchanged').some(event =>
      (event.gained.food ?? 0) > 0 &&
      animalKeysForState(context.state).some(animal => (event.paid[animal] ?? 0) > 0),
    ) ? { sourceCard: CARD_ID, flow: gainLeaf(CARD_ID, { food: 1 }) } : undefined,
  }],
} satisfies CardImpl

export const OLD_K299_Slaughterman = defineOccupationCard({
  meta: {
    id: 'OLD_K299_Slaughterman',
    originalId: 'K299_Slaughterman',
    gameEdition: 'classic',
    name: '屠宰工',
    deck: 'K',
    number: 299,
    desc: [
      '每次其他玩家将至少1只动物转化为食物时，你获得1份食物。每个丰收时节的喂养阶段，你最后进行结算。K299屠宰工和I97屠宰场的拥有者按照正常(下1回合)顺序结算。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '3+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K299.png',
  },
  impl: cardImpl,
})

export const OLD_K299_Slaughterman_impl = OLD_K299_Slaughterman.impl
