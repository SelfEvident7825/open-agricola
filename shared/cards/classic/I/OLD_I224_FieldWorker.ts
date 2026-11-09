import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { createEventQuery } from '../../../events/query'
import { gainLeaf } from '../../helpers/pay-gain-node'
const CARD_ID = 'OLD_I224_FieldWorker'

const cardImpl = {
  listeners: [
    {
      id: CARD_ID + '-sow',
      cardIds: [CARD_ID],
      actions: ['sow'],
      phases: ['after'],
      scope: 'opponent',
      handler: (context) =>
        createEventQuery(context.actionEvents ?? [])
          .filter('farm.sown')
          .some((e) => e.sows.length > 0)
          ? {
              sourceCard: CARD_ID,
              flow: gainLeaf(
                CARD_ID,
                context.state.players.length === 3 ? { grain: 1 } : { food: 1 },
              ),
            }
          : undefined,
    },
  ],
} satisfies CardImpl
export const OLD_I224_FieldWorker = defineOccupationCard({
  meta: {
    id: 'OLD_I224_FieldWorker',
    originalId: 'I224_FieldWorker',
    gameEdition: 'classic',
    name: '种田工',
    deck: 'I',
    number: 224,
    desc: ['在3/4+人游戏中，每当其他玩家播种了至少1块田时，你获得1份小麦/食物。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '3+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I224.png',
    locales: {
      zh: {
        name: '种田工',
        desc: ['在3/4+人游戏中，每当其他玩家播种了至少1块田时，你获得1份小麦/食物。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_I224_FieldWorker_impl = OLD_I224_FieldWorker.impl
