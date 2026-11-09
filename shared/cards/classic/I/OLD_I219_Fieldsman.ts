import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { createEventQuery } from '../../../events/query'
import { getLogicalFields } from '../../helpers/card-field'
const CARD_ID = 'OLD_I219_Fieldsman'

const cardImpl = {
  listeners: [
    {
      id: CARD_ID + '-sow',
      cardIds: [CARD_ID],
      actions: ['sow'],
      phases: ['after'],
      handler: (context) => {
        const sows = createEventQuery(context.actionEvents ?? [])
          .filter('farm.sown')
          .flatMap((e) => e.sows)
        const fields = getLogicalFields(context.player)
        const ids = new Set(
          sows
            .map((s) => {
              const location = s.location
              return location.kind === 'field'
                ? fields.find((f) =>
                    f.slots.some(
                      (slot) => slot.tile.row === location.row && slot.tile.col === location.col,
                    ),
                  )?.id
                : location.kind === 'card'
                  ? 'card:' + location.cardId
                  : undefined
            })
            .filter(Boolean),
        )
        const extra = ids.size === 1 ? 2 : ids.size === 2 ? 1 : 0
        const locations = sows.flatMap((s) => {
          const location = s.location
          return location.kind === 'field'
            ? Array.from({ length: extra }, () => ({
                kind: 'field' as const,
                row: location.row,
                col: location.col,
              }))
            : []
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
export const OLD_I219_Fieldsman = defineOccupationCard({
  meta: {
    id: 'OLD_I219_Fieldsman',
    originalId: 'I219_Fieldsman',
    gameEdition: 'classic',
    name: '田地主人',
    deck: 'I',
    number: 219,
    desc: [
      '每当你播种恰好1块田地时，额外放置2个物品在其上。每当你播种恰好2块田地时，额外放置1个物品在其上。注：对任意播种物品和田地有效。例：K278护林人、I78木头地、K105一亩田、Ö21葡萄园、WM104芦苇地',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I219.png',
    locales: {
      zh: {
        name: '田地主人',
        desc: [
          '每当你播种恰好1块田地时，额外放置2个物品在其上。每当你播种恰好2块田地时，额外放置1个物品在其上。注：对任意播种物品和田地有效。例：K278护林人、I78木头地、K105一亩田、Ö21葡萄园、WM104芦苇地',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_I219_Fieldsman_impl = OLD_I219_Fieldsman.impl
