import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { createEventQuery } from '../../../events/query'
import { readCardExtraData, writeCardExtraData } from '../../helpers/card-state'
import type { GameState, PlayerState } from '../../../contract/types'
import {
  queueFutureMeeplesFlow,
  futureMeeplesNode,
} from '../../../actions/effects/internal/future-meeples'
const CARD_ID = 'OLD_I262_WaterCarrier'
const schedule = (state: GameState, player: PlayerState) => {
  writeCardExtraData(player, CARD_ID, 'scheduled', true)
  return queueFutureMeeplesFlow(state, {
    cardId: CARD_ID,
    playerId: player.id,
    startRound: state.round + 1,
    count: 14 - state.round,
    resources: { food: 1 },
  })
}
const cardImpl = {
  reaches: ['Major_Well'],
  effect: {
    id: CARD_ID,
    onBuy: (state, player) =>
      state.players.some((p) => p.improvements.includes('Major_Well'))
        ? schedule(state, player)
        : undefined,
  },
  listeners: [
    {
      id: CARD_ID + '-well',
      cardIds: [CARD_ID],
      actions: ['improvement'],
      phases: ['after'],
      scope: 'any',
      handler: (context) => {
        const owner = context.ownerPlayer ?? context.player
        if (
          readCardExtraData<boolean>(owner, CARD_ID, 'scheduled') ||
          !createEventQuery(context.actionEvents ?? [])
            .filter('card.played')
            .some((e) => e.cardId === 'Major_Well')
        )
          return
        return {
          sourceCard: CARD_ID,
          flow: {
            type: 'seq',
            children: [
              {
                type: 'leaf',
                actionId: 'special-effect',
                sourceCard: CARD_ID,
                params: {
                  kind: 'set-extra-data',
                  key: 'scheduled',
                  value: true,
                },
              },
              futureMeeplesNode({
                cardId: CARD_ID,
                playerId: owner.id,
                startRound: context.state.round + 1,
                count: 14 - context.state.round,
                resources: { food: 1 },
              }),
            ],
          },
        }
      },
    },
  ],
} satisfies CardImpl
export const OLD_I262_WaterCarrier = defineOccupationCard({
  meta: {
    id: 'OLD_I262_WaterCarrier',
    originalId: 'I262_WaterCarrier',
    gameEdition: 'classic',
    name: '运水工',
    deck: 'I',
    number: 262,
    desc: [
      '一旦任意玩家打出了主发A10水井，在之后回合的行动格上各放置1份食物。这些回合开始时，你获得对应的食物。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '3+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I262.png',
  },
  impl: cardImpl,
})
export const OLD_I262_WaterCarrier_impl = OLD_I262_WaterCarrier.impl
