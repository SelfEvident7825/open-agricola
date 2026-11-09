import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { gainLeaf } from '../../helpers/pay-gain-node'
import { familySize } from '../../../domain/player'
const CARD_ID = 'OLD_I232_Midwife'

const cardImpl = {
  listeners: [
    {
      id: CARD_ID + '-growth',
      cardIds: [CARD_ID],
      actions: ['family-growth'],
      phases: ['after'],
      scope: 'opponent',
      handler: (context) => {
        const owner = context.ownerPlayer
        if (!owner || !context.actionEvents?.some((e) => e.type === 'worker.placed')) return
        const diff = familySize(context.player) - familySize(owner)
        return diff > 0
          ? {
              sourceCard: CARD_ID,
              flow: gainLeaf(CARD_ID, { food: Math.min(2, diff) }),
            }
          : undefined
      },
    },
  ],
} satisfies CardImpl
export const OLD_I232_Midwife = defineOccupationCard({
  meta: {
    id: 'OLD_I232_Midwife',
    originalId: 'I232_Midwife',
    gameEdition: 'classic',
    name: '助产士',
    deck: 'I',
    number: 232,
    desc: ['每当其他玩家执行“生娃”行动后，如果他的家庭成员比你多1/2+个，则你获得1/2份食物。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I232.png',
    locales: {
      zh: {
        name: '助产士',
        desc: ['每当其他玩家执行“生娃”行动后，如果他的家庭成员比你多1/2+个，则你获得1/2份食物。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_I232_Midwife_impl = OLD_I232_Midwife.impl
