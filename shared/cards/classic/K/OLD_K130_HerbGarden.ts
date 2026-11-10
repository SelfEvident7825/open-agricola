import { defineMinorCard } from '../../card-source'
import { futureMeeplesNode } from '../../../actions/effects/internal/future-meeples'
import { getLogicalFields } from '../../helpers/card-field'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K130_HerbGarden'
const cardImpl = {
  prerequisiteCheck: player => getLogicalFields(player).some(field =>
    field.stacks.some(stack => stack.kind === 'vegetable' && stack.remaining > 0),
  ),
  effect: {
    id: CARD_ID,
    onBuy: (state, player) => futureMeeplesNode({
      cardId: CARD_ID,
      playerId: player.id,
      resources: { food: 1 },
      startRound: state.round + 1,
      count: 5,
    }),
  },
} satisfies CardImpl

export const OLD_K130_HerbGarden = defineMinorCard({
  meta: {
    id: 'OLD_K130_HerbGarden',
    originalId: 'K130_HerbGarden',
    gameEdition: 'classic',
    name: '药草园',
    deck: 'K',
    number: 130,
    desc: [
      '打出此卡时，在之后的5个回合行动格上各放1份食物。这些回合开始时，你获得对应的食物。此卡牌打出条件“菜田×1”包括卡牌田。',
    ],
    cost: {},
    vp: 1,
    prerequisite: '菜田×1',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K130.png',
    locales: {
      zh: {
        name: '药草园',
        desc: [
          '打出此卡时，在之后的5个回合行动格上各放1份食物。这些回合开始时，你获得对应的食物。此卡牌打出条件“菜田×1”包括卡牌田。',
        ],
        prerequisite: '菜田×1',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_K130_HerbGarden_impl = OLD_K130_HerbGarden.impl
