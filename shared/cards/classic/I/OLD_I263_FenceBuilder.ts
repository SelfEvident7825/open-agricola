import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { readCardExtraData, writeCardExtraData } from '../../helpers/card-state'
import { getOwnOrdinaryFenceReserveCount } from '../../../domain/supply-tokens'
import { openRoundForSpace } from '../../../actions/helpers/placement-availability'
const CARD_ID = 'OLD_I263_FenceBuilder'

const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state, player) =>
      getOwnOrdinaryFenceReserveCount(player) > 0
        ? {
            type: 'leaf',
            actionId: 'emit-choice',
            sourceCard: CARD_ID,
            params: {
              options: state.actionSpaces
                .filter(
                  (s) =>
                    openRoundForSpace(state, s) <= state.round ||
                    s.exclusiveUse?.playerId === player.id,
                )
                .map((s) => ({ value: s.id, labelKey: s.nameKey })),
              requiresExplicitChoice: true,
            },
          }
        : undefined,
    resolveChoice: (state, player, choice) => {
      if (
        !state.actionSpaces.some(
          (s) =>
            s.id === choice &&
            (openRoundForSpace(state, s) <= state.round || s.exclusiveUse?.playerId === player.id),
        ) ||
        getOwnOrdinaryFenceReserveCount(player) < 1
      )
        return
      writeCardExtraData(player, CARD_ID, 'space', choice)
    },
    getRuleContributions: (player) => ({
      reservedSupply: {
        fence: readCardExtraData(player, CARD_ID, 'space') ? 1 : 0,
      },
    }),
  },
  listeners: [
    {
      id: CARD_ID + '-fence',
      cardIds: [CARD_ID],
      actionSpaces: 'all',
      phases: ['after'],
      handler: (context) =>
        readCardExtraData(context.player, CARD_ID, 'space') === context.space.id
          ? {
              sourceCard: CARD_ID,
              flow: {
                type: 'leaf',
                actionId: 'fence',
                sourceCard: CARD_ID,
                optional: true,
              },
            }
          : undefined,
    },
  ],
} satisfies CardImpl
export const OLD_I263_FenceBuilder = defineOccupationCard({
  meta: {
    id: 'OLD_I263_FenceBuilder',
    originalId: 'I263_FenceBuilder',
    gameEdition: 'classic',
    name: '栅栏建造工',
    deck: 'I',
    number: 263,
    desc: [
      '打出此卡时，将1根你供应区的栅栏条放到任意1个已翻开的行动格上。之后每次你使用该行动格时，你获得一次额外的“围栅栏”行动。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '3+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I263.png',
  },
  impl: cardImpl,
})
export const OLD_I263_FenceBuilder_impl = OLD_I263_FenceBuilder.impl
