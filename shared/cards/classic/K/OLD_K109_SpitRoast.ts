import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { animalKeysForState } from '../../../contract/animals'
import { createEventQuery } from '../../../events/query'
import { readCardExtraData } from '../../helpers/card-state'
import { gainLeaf } from '../../helpers/pay-gain-node'

const CARD_ID = 'OLD_K109_SpitRoast'

const cardImpl = {
  listeners: [
    {
      id: CARD_ID + '-feeding-cook',
      cardIds: [CARD_ID],
      actions: ['exchange'],
      phases: ['after'],
      handler: context => {
        if (context.state.roundPhase !== 'feeding' || readCardExtraData(context.player, CARD_ID, 'feedingPhase') === context.state.completedFeedingPhases) return
        const cooked = createEventQuery(context.actionEvents ?? []).filter('resource.exchanged').some(event => (event.gained.food ?? 0) > 0 && animalKeysForState(context.state).some(animal => (event.paid[animal] ?? 0) > 0))
        if (!cooked) return
        return {
          sourceCard: CARD_ID,
          flow: {
            type: 'seq', children: [
              {
                type: 'leaf',
                actionId: 'special-effect',
                sourceCard: CARD_ID,
                params: {
                  kind: 'set-extra-data',
                  key: 'feedingPhase',
                  value: context.state.completedFeedingPhases,
                },
              },
              gainLeaf(CARD_ID, { food: 1 }),
            ]
          },
        }
      },
    },
  ],
} satisfies CardImpl

export const OLD_K109_SpitRoast = defineMinorCard({
  meta: {
    id: 'OLD_K109_SpitRoast',
    originalId: 'K109_SpitRoast',
    gameEdition: 'classic',
    name: '烧烤叉',
    deck: 'K',
    number: 109,
    desc: ['每个丰收时节的喂养阶段，如果你将至少1只动物转化为食物，则你额外获得1份食物。'],
    cost: {
      wood: 1,
    },
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K109.png',
  },
  impl: cardImpl,
})

export const OLD_K109_SpitRoast_impl = OLD_K109_SpitRoast.impl
