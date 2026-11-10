import { createEventQuery } from '../../../events/query'
import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { registerSelectionEffect } from '../../../actions/helpers/selection-effect-registry'
import { extraCropPlacementActionContext } from '../../../actions/helpers/extra-crop-placement-context'
import { getLogicalFields, mutateLogicalFields } from '../../helpers/card-field'
import { parseFarmPositionKey } from '../../../domain/farm-position-selection'
const CARD_ID = 'OLD_K286_Smallholder'
const EFFECT = CARD_ID + '-extra-crop'
registerSelectionEffect(EFFECT, ({ state, player, positions, sourceCard, eventSink }) => {
  const fields = mutateLogicalFields(state, player, { sourceCard, eventSink })
  for (const position of positions) {
    const tile = parseFarmPositionKey(position)
    if (tile) fields.grow(tile)
  }
})
const cardImpl = {
  effect: {
    id: CARD_ID,
    onComputeAnimalZones: (_player, zones) => {
      for (const zone of zones) {
        if (zone.zoneType === 'pasture' && zone.capacity === 2) zone.capacity = 3
      }
    },
  },
  listeners: [{
    id: CARD_ID + '-sow',
    cardIds: [CARD_ID],
    actions: ['sow'],
    phases: ['after'],
    handler: context => {
      const fields = getLogicalFields(context.player)
      if (fields.length > 2) return
      const sown = createEventQuery(context.actionEvents ?? context.transactionEvents)
        .filter('farm.sown')
        .flatMap(event => event.sows)
        .filter(sow => sow.crop === 'grain' || sow.crop === 'vegetable')
      const fresh = fields.flatMap(field => field.slots.filter(slot => sown.some(sow =>
        sow.location.kind === 'field'
        && sow.location.playerId === context.player.id
        && sow.location.row === slot.tile.row
        && sow.location.col === slot.tile.col,
      )).map(slot => ({ field, slot })))
      if (!fresh.length) return
      return {
        sourceCard: CARD_ID,
        flow: {
          type: 'leaf',
          actionId: 'selection',
          optional: true,
          sourceCard: CARD_ID,
          actionContext: extraCropPlacementActionContext({
            selectionKind: 'farm-position',
            minSelections: 1,
            maxSelections: fresh.length,
            selectionEffect: EFFECT,
            selectableTiles: fresh.map(({ field, slot }) => field.kind === 'farmyard'
              ? { row: field.row, col: field.col }
              : { ...slot.tile, sourceCard: field.sourceCard, groupKey: field.groupKey, cardFieldSlot: slot.index }),
          }),
        },
      }
    },
  }],
} satisfies CardImpl

export const OLD_K286_Smallholder = defineOccupationCard({
  meta: {
    id: 'OLD_K286_Smallholder',
    originalId: 'K286_Smallholder',
    gameEdition: 'classic',
    name: '小农',
    deck: 'K',
    number: 286,
    desc: [
      '你原本能容纳恰好2只动物的圈地变成能容纳3只动物。如果你有至多2块田地，则你执行"播种"行动时，可以在每个新播种的田上额外放置1份对应小麦/蔬菜。（卡牌麦田、菜田也算）',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K286.png',
  },
  impl: cardImpl,
})
