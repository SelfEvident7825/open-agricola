import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { createEventQuery } from '../../../events/query'
const CARD_ID = 'OLD_I90_PlanterBox'

const cardImpl = {
  listeners: [
    {
      id: CARD_ID + '-sow',
      cardIds: [CARD_ID],
      actions: ['sow'],
      phases: ['after'],
      handler: (context) => {
        const locations = createEventQuery(context.actionEvents ?? [])
          .filter('farm.sown')
          .flatMap((e) => e.sows)
          .flatMap((s) => {
            const l = s.location
            if (
              l.kind !== 'field' ||
              l.row < 0 ||
              !context.player.roomTiles.some(
                (r) => Math.abs(r.row - l.row) + Math.abs(r.col - l.col) === 1,
              )
            )
              return []
            return Array.from(
              {
                length: s.crop === 'grain' ? 2 : s.crop === 'vegetable' ? 1 : 0,
              },
              () => ({ kind: 'field' as const, row: l.row, col: l.col }),
            )
          })
        return locations.length
          ? {
              sourceCard: CARD_ID,
              flow: {
                type: 'leaf',
                actionId: 'special-effect',
                sourceCard: CARD_ID,
                params: { kind: 'plant-additional-good', locations },
              },
            }
          : undefined
      },
    },
  ],
} satisfies CardImpl
export const OLD_I90_PlanterBox = defineMinorCard({
  meta: {
    id: 'OLD_I90_PlanterBox',
    originalId: 'I90_PlanterBox',
    gameEdition: 'classic',
    name: '播种筒',
    deck: 'I',
    number: 90,
    desc: [
      '每当你播种时，如果播种的田地板块与你的房屋板块正交相邻，每列小麦必须额外放置2份小麦，每列蔬菜必须额外放置1份蔬菜。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '2 Occupations',
    occupationPrerequisites: {
      min: 2,
    },
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I90.png',
    locales: {
      zh: {
        name: '播种筒',
        desc: [
          '每当你播种时，如果播种的田地板块与你的房屋板块正交相邻，每列小麦必须额外放置2份小麦，每列蔬菜必须额外放置1份蔬菜。',
        ],
        prerequisite: '职业×2',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_I90_PlanterBox_impl = OLD_I90_PlanterBox.impl
