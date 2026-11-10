import { defineMinorCard } from '../../card-source'
import { registerSelectionEffect, registerSelectionValidator } from '../../../actions/helpers/selection-effect-registry'
import { readCardExtraData, writeCardExtraData } from '../../helpers/card-state'
import { payLeaf } from '../../helpers/pay-gain-node'
import { createEventQuery } from '../../../events/query'
import { positionKey } from '../../../domain/farm'
import type { PlayerState } from '../../../contract/types'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K339_Pelts'
const MARK = `${CARD_ID}-mark-rooms`
const marked = (player: PlayerState) => readCardExtraData<string[]>(player, CARD_ID, 'peltRooms') ?? []
const availableRooms = (player: PlayerState) =>
  player.roomTiles.filter(room => !marked(player).includes(positionKey(room)))

registerSelectionValidator(MARK, ({ player, positions }) => {
  const available = new Set(availableRooms(player).map(positionKey))
  if (
    positions.length > player.resources.food
    || new Set(positions).size !== positions.length
    || positions.some(key => !available.has(key))
  ) return 'log.actionNotAvailable'
})

registerSelectionEffect(MARK, ({ player, positions }) => {
  if (!positions.length) return
  writeCardExtraData(player, CARD_ID, 'peltRooms', [...marked(player), ...positions])
  return payLeaf({ cardId: CARD_ID, cost: { food: positions.length } })
})

const cardImpl = {
  listeners: [
    {
      id: `${CARD_ID}-cook`,
      cardIds: [CARD_ID],
      actions: ['exchange'],
      phases: ['after'],
      handler: context => {
        const count = createEventQuery(context.actionEvents ?? [])
          .filter('resource.exchanged', event =>
            event.paidFrom.kind === 'player'
            && event.paidFrom.playerId === context.player.id
            && (event.gained.food ?? 0) > 0,
          )
          .reduce((sum, event) => sum
            + (event.paid.sheep ?? 0)
            + (event.paid.boar ?? 0)
            + (event.paid.cattle ?? 0)
            + (event.paid.horse ?? 0), 0)
        const selectableTiles = availableRooms(context.player).map(room => ({ ...room }))
        const maxSelections = Math.min(count, selectableTiles.length, context.player.resources.food)
        if (maxSelections <= 0) return
        return {
          sourceCard: CARD_ID,
          flow: {
            type: 'leaf',
            actionId: 'selection',
            sourceCard: CARD_ID,
            optional: true,
            actionContext: {
              selectionKind: 'farm-position',
              selectionEffect: MARK,
              minSelections: 0,
              maxSelections,
              selectableTiles,
            },
          },
        }
      },
    }
  ],
  effect: {
    id: CARD_ID,
    computeBonusScore: (_state, player) => marked(player)
      .filter(key => player.roomTiles.some(room => positionKey(room) === key)).length,
    getStatePresentation: player => ({
      farmTerrainMarkers: marked(player).map(key => {
        const [row, col] = key.split('-').map(Number)
        return { row: row!, col: col!, kind: 'pelt' }
      }),
      counters: { pelts: marked(player).length },
    }),
  },
} satisfies CardImpl

export const OLD_K339_Pelts = defineMinorCard({
  meta: {
    id: 'OLD_K339_Pelts',
    originalId: 'K339_Pelts',
    gameEdition: 'classic',
    name: '毛皮',
    deck: 'K',
    number: 339,
    desc: [
      '每当你将动物转化成食物时，对于每只被转化的动物，你可支付1份食物（从个人供应区拿取）放置到你的1个房间板块上。每个房间板块至多放置1份这样的食物，食物不可再次被使用。游戏结束时，每有1个这样的食物你便额外获得1分。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '3 Occupations',
    occupationPrerequisites: {
      min: 3,
    },
    passing: false,
    extraVp: true,
    implemented: true,
    artUrl: '/assets/classic/K/K339.png',
  },
  impl: cardImpl,
})
export const OLD_K339_Pelts_impl = OLD_K339_Pelts.impl
