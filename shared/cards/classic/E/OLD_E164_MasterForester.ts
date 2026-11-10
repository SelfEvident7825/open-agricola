import { definePlayerActionCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import {
  registerPlayerActionSpace,
  createPlayerActionSpaces,
  definePlayerActionSpaceFlow,
} from '../../player-action-space'
const CARD_ID = 'OLD_E164_MasterForester'
const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state) => {
      for (const space of createPlayerActionSpaces(state))
        if (!state.actionSpaces.some((s) => s.id === space.id)) state.actionSpaces.push(space)
    },
  },
} satisfies CardImpl
export const OLD_E164_MasterForester = definePlayerActionCard({
  meta: {
    id: 'OLD_E164_MasterForester',
    originalId: 'E164_MasterForester',
    gameEdition: 'classic',
    name: '林场主',
    deck: 'E',
    number: 164,
    desc: [
      '本卡将作为额外的树林行动格3人游戏中[2木积累行动格]。从下回合开始，每回合将积累2个木头放在此卡上。其他玩家使用此行动格前，必须先付给你2份食物。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E164.png',
    playerActionCardType: 'occupation',
  },
  impl: cardImpl,
})
export const OLD_E164_MasterForester_impl = OLD_E164_MasterForester.impl
registerPlayerActionSpace({
  cardId: CARD_ID,
  access: 'all',
  gainPerRound: { wood: 2 },
  createDefinition: (ownerId) =>
    definePlayerActionSpaceFlow({
      id: CARD_ID,
      nameKey: 'cards.' + CARD_ID + '.name',
      descriptionKey: 'cards.' + CARD_ID + '.desc',
      canBeExecutedByPlayer: (_state, player) =>
        player.id === ownerId || player.resources.food >= 2,
      flowFactory: ({ player }) => ({
        type: 'seq',
        children: [
          ...(player.id === ownerId
            ? []
            : [
                {
                  type: 'leaf' as const,
                  actionId: 'gain',
                  sourceCard: CARD_ID,
                  params: {
                    food: 2,
                    payerId: player.id,
                    recipientPlayerId: ownerId,
                  },
                },
              ]),
          {
            type: 'leaf',
            actionId: 'collect',
          },
        ],
      }),
    }),
})
