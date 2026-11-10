import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { getActionStableConstructions } from '../../helpers/construction-events'
import { readCardExtraData } from '../../helpers/card-state'
import { payLeaf } from '../../helpers/pay-gain-node'
import { quoteFenceSelection } from '../../../actions/effects/fencing'
import type { ActionFlow } from '../../../contract/types'

const CARD_ID = 'OLD_K312_FenceOverseer'
const cardImpl = {
  listeners: [{
    id: CARD_ID + '-enclose-stable',
    cardIds: [CARD_ID],
    actions: ['stables'],
    phases: ['after'],
    handler: context => {
      if (readCardExtraData(context.player, CARD_ID, 'usedRound') === context.state.round) return
      const stables = getActionStableConstructions(context, context.player.id).filter(stable =>
        !context.player.pastures.some(pasture => pasture.tiles?.some(tile =>
          tile.row === stable.row && tile.col === stable.col,
        )),
      )
      const children: ActionFlow[] = stables.flatMap(stable => {
        const actionContext = {
          fencePolicy: {
            allowedSegmentTypes: ['fence' as const],
            allowedNewRegionTiles: [{ row: stable.row, col: stable.col }],
            newRegionBounds: { count: { min: 1, max: 1 }, totalSize: { min: 1, max: 1 } },
            costPolicy: { fence: { wood: 0 } },
            cancelPolicy: 'forbidCancel' as const,
          },
        }
        const { row, col } = stable
        const edges = [`H-${row}-${col}`, `H-${row + 1}-${col}`, `V-${row}-${col}`, `V-${row}-${col + 1}`]
        const quote = quoteFenceSelection({ ...context, sourceCard: CARD_ID, actionContext }, CARD_ID, { edges })
        if (!quote.valid) return []
        return [{
          type: 'seq',
          children: [
            payLeaf({ cardId: CARD_ID, cost: { food: 1 } }),
            // Mark the use before fencing can trigger another stable construction.
            {
              type: 'leaf',
              actionId: 'special-effect',
              sourceCard: CARD_ID,
              params: { kind: 'set-extra-data', key: 'usedRound', value: context.state.round },
            },
            { type: 'leaf', actionId: 'fence', sourceCard: CARD_ID, actionContext },
          ],
        }]
      })
      return children.length ? { sourceCard: CARD_ID, flow: { type: 'xor', optional: true, children } } : undefined
    },
  }],
} satisfies CardImpl

export const OLD_K312_FenceOverseer = defineOccupationCard({
  meta: {
    id: 'OLD_K312_FenceOverseer',
    originalId: 'K312_FenceOverseer',
    gameEdition: 'classic',
    name: '栅栏监管员',
    deck: 'K',
    number: 312,
    desc: [
      '每回合限一次：你可以支付1份食物免费将刚建成的马厩所在的格子围成1格圈地。(必须遵循圈地规则)',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K312.png',
    locales: {
      zh: {
        name: '栅栏监管员',
        desc: [
          '每回合限一次：你可以支付1份食物免费将刚建成的马厩所在的格子围成1格圈地。(必须遵循圈地规则)',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_K312_FenceOverseer_impl = OLD_K312_FenceOverseer.impl
