import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { gainLeaf } from '../../helpers/pay-gain-node'
import { createEventQuery } from '../../../events/query'
const guildReward = (id: string): ['wood' | 'clay' | 'reed', number] | undefined => {
  if (['Major_Joinery', 'Major_Joinery2', 'OLD_I258_Cabinetmaker'].includes(id)) return ['wood', 4]
  if (['Major_Pottery', 'Major_Pottery2', 'OLD_E214_Potter'].includes(id)) return ['clay', 4]
  if (['Major_Basket', 'Major_Basket2', 'OLD_E183_Basketmaker'].includes(id)) return ['reed', 3]
}
const CARD_ID = 'OLD_E341_Guildmaster'
const cardImpl = {
  reaches: [
    'OLD_E183_Basketmaker',
    'OLD_E214_Potter',
    'OLD_I258_Cabinetmaker',
  ] as readonly string[],
  effect: {
    id: CARD_ID,
    onBuy: (_state, player) => {
      const owned = [...player.improvements, ...player.minorPlayed, ...player.occupationPlayed]
      return {
        type: 'seq',
        children: owned.flatMap((id) => {
          const reward = guildReward(id)
          return reward ? [gainLeaf(CARD_ID, { [reward[0]]: 2 })] : []
        }),
      }
    },
  },
  listeners: [
    {
      id: CARD_ID + '-craft',
      cardIds: [CARD_ID],
      actions: ['improvement', 'occupation'],
      phases: ['after'],
      handler: (context) => {
        const events = createEventQuery(context.actionEvents ?? []).filter('card.played')
        const children = events.flatMap((e) => {
          const reward = guildReward(e.cardId)
          return reward ? [gainLeaf(CARD_ID, { [reward[0]]: reward[1] })] : []
        })
        if (children.length)
          return {
            sourceCard: CARD_ID,
            flow: {
              type: 'seq',
              children,
            },
          }
      },
    },
  ],
} satisfies CardImpl
export const OLD_E341_Guildmaster = defineOccupationCard({
  meta: {
    id: 'OLD_E341_Guildmaster',
    originalId: 'E341_Guildmaster',
    gameEdition: 'classic',
    name: '公会主席',
    deck: 'E',
    number: 341,
    desc: [
      '打出此卡后，每当你打出I258家具匠/A7家具工坊、E214制陶工/A8陶艺工坊、E183编筐工/A9编筐工坊时，你对应获得4木、4砖、3芦苇。若打出此卡时，你已拥有上述某卡，对于每张卡，你获得对应的2个资源。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '3+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E341.png',
    locales: {
      zh: {
        name: '公会主席',
        desc: [
          '打出此卡后，每当你打出I258家具匠/A7家具工坊、E214制陶工/A8陶艺工坊、E183编筐工/A9编筐工坊时，你对应获得4木、4砖、3芦苇。若打出此卡时，你已拥有上述某卡，对于每张卡，你获得对应的2个资源。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E341_Guildmaster_impl = OLD_E341_Guildmaster.impl
