import { defineMinorCard } from '../../card-source'
import { createEventQuery } from '../../../events/query'
import type { CardImpl } from '../../registry'
import type { Resource } from '../../../contract/types'
import { readCardExtraData } from '../../helpers/card-state'

const CARD_ID = 'OLD_K121_Sawhorse'

const cardImpl = {
  listeners: [
    {
      id: CARD_ID + '-stable-price',
      cardIds: [CARD_ID],
      actions: ['stables'],
      phases: ['computeCosts'],
      handler: context => {
        if (readCardExtraData(context.player, CARD_ID, 'stableBuilt')) return
        if (typeof context.params?.stableCount !== 'number' || context.params.stableCount < 1) return
        const unitCost = context.params.stableUnitCost as Partial<Resource> | undefined
        if (!unitCost) return
        const costs = Object.fromEntries(Object.entries(unitCost).map(([resource, amount]) => [resource, -(amount ?? 0)]))
        return {
          costs,
          costAttribution: [
            { sourceCard: CARD_ID, costs },
          ],
        }
      },
    },
    {
      id: CARD_ID + '-stable-used',
      cardIds: [CARD_ID],
      actions: ['stables'],
      phases: ['after'],
      handler: context => !readCardExtraData(context.player, CARD_ID, 'stableBuilt') &&
        createEventQuery(context.actionEvents ?? []).filter('farm.stableBuilt').some(event => event.stables.length > 0)
        ? {
          sourceCard: CARD_ID,
          flow: {
            type: 'leaf',
            actionId: 'special-effect',
            sourceCard: CARD_ID,
            params: {
              kind: 'set-extra-data',
              key: 'stableBuilt',
              value: true,
            },
          },
        } : undefined,
    },
    {
      id: CARD_ID + '-fence-price',
      cardIds: [CARD_ID],
      actions: ['fence'],
      phases: ['computeCosts'],
      handler: context => {
        const edges = context.params?.newFenceEdges
        if (!Array.isArray(edges)) return
        const before = context.player.fenceSegments.filter(segment => segment.type !== 'palisade').length
        const free = Math.floor(Math.min(15, before + edges.length) / 3) - Math.floor(Math.min(15, before) / 3)
        if (free <= 0) return
        const costs = { wood: -free }
        return {
          costs,
          costAttribution: [
            { sourceCard: CARD_ID, costs },
          ],
        }
      },
    },
  ],
} satisfies CardImpl

export const OLD_K121_Sawhorse = defineMinorCard({
  meta: {
    id: 'OLD_K121_Sawhorse',
    originalId: 'K121_Sawhorse',
    gameEdition: 'classic',
    name: '锯木架',
    deck: 'K',
    number: 121,
    desc: ['你的下1个马厩和第3、6、9、12、15根栅栏可以免费建造。（需满足围建栅栏的一般规则）'],
    cost: {
      wood: 2,
    },
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K121.png',
  },
  impl: cardImpl,
})

export const OLD_K121_Sawhorse_impl = OLD_K121_Sawhorse.impl
