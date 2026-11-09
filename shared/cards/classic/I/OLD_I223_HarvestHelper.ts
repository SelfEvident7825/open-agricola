import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import type { ActionDefinition, GameState, PlayerState } from '../../../contract/types'
import { registerAdHocAction } from '../../../actions/helpers/ad-hoc-action-registry'
import { getLogicalFields, mutateLogicalFields } from '../../helpers/card-field'
import { gainLeaf } from '../../helpers/pay-gain-node'
const CARD_ID = 'OLD_I223_HarvestHelper'
const ACTION = 'card_' + CARD_ID + '_harvest'
const choices = (state: GameState, owner: PlayerState) =>
  state.players
    .filter((p) => p.id !== owner.id)
    .flatMap((p) =>
      getLogicalFields(p).flatMap((field) =>
        field.slots
          .filter((slot) => slot.stack?.kind === 'grain')
          .map((slot) => ({
            player: p,
            field,
            slot,
            key: JSON.stringify([p.id, field.id, slot.index]),
          })),
      ),
    )
const harvest: ActionDefinition = {
  id: ACTION,
  nameKey: 'cards.' + CARD_ID + '.name',
  descriptionKey: 'cards.' + CARD_ID + '.desc',
  roundAvailable: 1,
  gainPerRound: {},
  canBeExecutedByPlayer: (state, player) => choices(state, player).length > 0,
  execute: ({ state, player }) => ({
    type: 'request',
    request: {
      kind: 'choice',
      options: choices(state, player).map((c) => ({
        value: c.key,
        labelKey: 'cards.' + CARD_ID + '.field',
        labelParams: {
          player: c.player.name,
          row: c.slot.tile.row + 1,
          col: c.slot.tile.col + 1,
          card: c.field.sourceCard ?? '',
        },
      })),
    },
  }),
  resolveChoice: ({ state, player, eventSink }, choice) => {
    const selected = choices(state, player).find((c) => c.key === choice)
    if (!selected) return { type: 'fail', errorKey: 'log.action', recoverable: true }
    const removed = mutateLogicalFields(state, selected.player, {
      sourceCard: CARD_ID,
      eventSink,
    }).remove({ fieldId: selected.field.id, slot: selected.slot.index }, 1)
    if (!removed.ok) return { type: 'fail', errorKey: 'log.action', recoverable: true }
    return {
      type: 'flow',
      flow: {
        type: 'seq',
        children: [
          gainLeaf(CARD_ID, { grain: 1 }),
          {
            ...gainLeaf(CARD_ID, { food: 2 }),
            targetPlayerId: selected.player.id,
          },
          ...(removed.ownerCallback
            ? [removed.ownerCallback()].filter(
                (x): x is import('../../../contract/types').ActionFlow => !!x,
              )
            : []),
        ],
      },
    }
  },
}
registerAdHocAction(harvest)

const cardImpl = {
  effect: {
    id: CARD_ID,
    onStartHarvestFeedingPhase: () => ({
      type: 'leaf',
      actionId: ACTION,
      sourceCard: CARD_ID,
      optional: true,
    }),
  },
} satisfies CardImpl
export const OLD_I223_HarvestHelper = defineOccupationCard({
  meta: {
    id: 'OLD_I223_HarvestHelper',
    originalId: 'I223_HarvestHelper',
    gameEdition: 'classic',
    name: '秋收帮工',
    deck: 'I',
    number: 223,
    desc: [
      '每个丰收时节的喂养阶段开始时，你可以从其他玩家的至多1块田上拿走至多1份小麦，该名玩家从游戏供应区获得2份食物。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I223.png',
    locales: {
      zh: {
        name: '秋收帮工',
        desc: [
          '每个丰收时节的喂养阶段开始时，你可以从其他玩家的至多1块田上拿走至多1份小麦，该名玩家从游戏供应区获得2份食物。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_I223_HarvestHelper_impl = OLD_I223_HarvestHelper.impl
