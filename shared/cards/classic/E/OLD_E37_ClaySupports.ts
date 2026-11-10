import { defineMinorCard } from '../../card-source'
import type { TradeModifier } from '../../../contract/types'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E37_ClaySupports'
/**
 * Reference: `onPlayerComputeCostsConstruct` pushes
 * an alternative trade `{clay:2, wood:1, reed:1}` when `args.type === 'roomClay'`.
 * Our equivalent: a static TradeModifier on the `construct` cost type with a
 * `roomMaterialClay` condition — the construct path builds `ComplexCost`
 * via `buildConstructCost` and routes through `computeAllBuyableCombinations`
 * with `costType:'construct'`. `applyCostModifiers` reads
 * `player.activeModifiers` (populated from this field via
 * `syncModifiersFromCatalog`) and merges trades into the cost; the enumerator
 * then enumerates all decompositions.
 * Static modifiers keep this always-on room alternative in the player's
 * active construct cost modifiers.
 */
export const OLD_E37_ClaySupports = defineMinorCard({
  meta: {
    id: 'OLD_E37_ClaySupports',
    name: '砖造支柱',
    deck: 'E',
    number: 37,
    category: 'FARM_PLANNER',
    desc: ['每当你扩建砖屋时，你的每间砖屋可改用2块砖头+1根木头+1捆芦苇进行建造。'],
    cost: {
      wood: 2,
    },
    originalId: 'E37_ClaySupports',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E37.png',
  },
  impl: {
    modifiers: [
      {
        type: 'trade',
        cardId: CARD_ID,
        appliesTo: ['construct'],
        // scope:'unit' applies this replacement to each clay-room cost row,
        // matching the reference's per-room `addCost`.
        scope: 'unit',
        groupId: 'classic-room-base',
        groupMax: 1,
        groupScope: 'unit',
        from: { wood: 1 },
        to: {
          clay: 3,
          reed: 1,
        },
        conditions: { roomMaterialClay: 1 },
        unitPrice: { clay: 2, wood: 1, reed: 1 },
      } as TradeModifier,
    ],
  } satisfies CardImpl,
})
export const OLD_E37_ClaySupports_impl = OLD_E37_ClaySupports.impl
