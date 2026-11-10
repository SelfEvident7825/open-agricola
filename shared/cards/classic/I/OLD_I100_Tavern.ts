import { definePlayerActionCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import {
  registerPlayerActionSpace,
  createPlayerActionSpaces,
  definePlayerActionSpaceFlow,
} from '../../player-action-space'
import { gainLeaf, bonusVpLeaf } from '../../helpers/pay-gain-node'
const CARD_ID = 'OLD_I100_Tavern'

const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state) => {
      for (const space of createPlayerActionSpaces(state)) {
        if (!state.actionSpaces.some((s) => s.id === space.id)) {
          state.actionSpaces.push(space)
        }
      }
    },
  },
} satisfies CardImpl
export const OLD_I100_Tavern = definePlayerActionCard({
  meta: {
    id: 'OLD_I100_Tavern',
    originalId: 'I100_Tavern',
    gameEdition: 'classic',
    name: '酒馆',
    deck: 'I',
    number: 100,
    desc: [
      '+（+ ）此卡是所有玩家都能使用的额外行动格。其他玩家使用时获得3份食物，你使用时获得3份食物/2分。',
    ],
    cost: {
      wood: 2,
      stone: 2,
    },
    vp: 2,
    prerequisite: '',
    passing: false,
    extraVp: true,
    implemented: true,
    artUrl: '/assets/classic/I/I100.png',
    playerActionCardType: 'minor',
  },
  impl: cardImpl,
})
export const OLD_I100_Tavern_impl = OLD_I100_Tavern.impl
registerPlayerActionSpace({
  cardId: CARD_ID,
  access: 'all',
  createDefinition: (ownerId) =>
    definePlayerActionSpaceFlow({
      id: CARD_ID,
      nameKey: 'cards.' + CARD_ID + '.name',
      descriptionKey: 'cards.' + CARD_ID + '.desc',
      canBeExecutedByPlayer: (_state, player) =>
        player.id === ownerId || player.resources.food >= 0,
      flowFactory: ({ player }) =>
        player.id === ownerId
          ? {
              type: 'or' as const,
              children: [gainLeaf(CARD_ID, { food: 3 }), bonusVpLeaf(CARD_ID, 2)],
            }
          : { type: 'seq', children: [gainLeaf(CARD_ID, { food: 3 })] },
    }),
})
