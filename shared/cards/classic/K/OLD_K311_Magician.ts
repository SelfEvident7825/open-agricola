import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { gainLeaf } from '../../helpers/pay-gain-node'
import { isTravelingPlayersSpaceId } from '../../helpers/action-space-categories'
import { workersAvailable } from '../../../domain/player'

const CARD_ID = 'OLD_K311_Magician'
const cardImpl = {
  listeners: [{
    id: CARD_ID + '-last-worker',
    cardIds: [CARD_ID],
    actionSpaces: 'all',
    phases: ['before'],
    handler: context =>
      isTravelingPlayersSpaceId(context.space.id) && workersAvailable(context.state, context.player) === 0
        ? { sourceCard: CARD_ID, flow: gainLeaf(CARD_ID, { grain: 1, food: 1 }) }
        : undefined,
  }],
} satisfies CardImpl

export const OLD_K311_Magician = defineOccupationCard({
  meta: {
    id: 'OLD_K311_Magician',
    originalId: 'K311_Magician',
    gameEdition: 'classic',
    name: '魔术师',
    deck: 'K',
    number: 311,
    desc: ['每当你的最后一名家庭成员使用卖艺积累行动格时，额外获得1份小麦+1份食物。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '3+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K311.png',
  },
  impl: cardImpl,
})

export const OLD_K311_Magician_impl = OLD_K311_Magician.impl
