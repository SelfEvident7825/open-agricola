import { defineMinorCard } from '../../card-source'
import { createEventQuery } from '../../../events/query'
import type { CardImpl } from '../../registry'
import { countRoomAnimals } from '../../../domain/animals'
import { getLogicalFields, mutateLogicalFields } from '../../helpers/card-field'
import { registerSelectionEffect } from '../../../actions/helpers/selection-effect-registry'
import { extraCropPlacementActionContext } from '../../../actions/helpers/extra-crop-placement-context'
import { positionKey } from '../../../domain/farm'
import type { PlayerState } from '../../../contract/types'

const CARD_ID = 'OLD_K118_LiquidManure'

const cropSlots = (player: PlayerState) => getLogicalFields(player).flatMap(field => (field.kind === 'farmyard' ? field.slots.slice(-1) : field.slots).flatMap(slot => slot.stack ? [
  {
    fieldId: field.id,
    slot: slot.index,
    tile: slot.tile,
    crop: slot.stack.kind,
  },
] : []))
registerSelectionEffect('classic-k118-extra-crop', ({ state, player, positions, eventSink }) => {
  for (const key of positions) {
    const target = cropSlots(player).find(slot => positionKey(slot.tile) === key)
    if (target)
      mutateLogicalFields(state, player, { sourceCard: CARD_ID, eventSink })
        .grow({ fieldId: target.fieldId, slot: target.slot }, 1)
  }
})
const cardImpl = {
  prerequisiteCheck: player => countRoomAnimals(player) + player.pastures.reduce((total, pasture) => total + (pasture.animalCounts ? Object.values(pasture.animalCounts).reduce((sum, count) => sum + (count ?? 0), 0) : pasture.animalCount), 0) +
    Object.values(player.stableAnimals ?? {}).reduce((total, animals) => total + animals.animalCount, 0) >= 4,
  listeners: [
    {
      id: CARD_ID + '-sow',
      cardIds: [CARD_ID],
      actions: ['sow'],
      phases: ['after'],
      handler: context => {
        const fresh = new Map(createEventQuery(context.actionEvents ?? []).filter('farm.sown').flatMap(event => event.sows.flatMap(sow => sow.location.kind === 'field' && sow.location.playerId === context.player.id
          ? [[positionKey(sow.location), sow.crop] as const] : [])))
        const eligible = cropSlots(context.player).filter(slot => fresh.get(positionKey(slot.tile)) === slot.crop)
        if (!eligible.length) return
        return {
          sourceCard: CARD_ID,
          flow: {
            type: 'leaf',
            actionId: 'selection',
            optional: true,
            sourceCard: CARD_ID,
            actionContext: extraCropPlacementActionContext({
              selectionKind: 'farm-position',
              selectableTiles: eligible.map(slot => slot.tile),
              minSelections: 1,
              maxSelections: eligible.length,
              selectionEffect: 'classic-k118-extra-crop',
            }),
          },
        }
      },
    },
  ],
} satisfies CardImpl

export const OLD_K118_LiquidManure = defineMinorCard({
  meta: {
    id: 'OLD_K118_LiquidManure',
    originalId: 'K118_LiquidManure',
    gameEdition: 'classic',
    name: '水肥',
    deck: 'K',
    number: 118,
    desc: [
      '每当你执行"播种"行动时，在此次播种的田地上每列物品可以额外放置1份对应的物品。注：对任意播种资源和卡牌田有效。例：K278护林人、I78木头地、K105一亩田、Ö21葡萄园、WM104芦苇地此卡牌打出条件"动物×4"不包括卡牌动物。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '动物×4',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K118.png',
  },
  impl: cardImpl,
})

export const OLD_K118_LiquidManure_impl = OLD_K118_LiquidManure.impl
