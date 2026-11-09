import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { gainLeaf } from '../../helpers/pay-gain-node'
import { sumResourceMovedFromActionSpace } from '../../helpers/event-provenance'
const CARD_ID = 'OLD_E161_Fisherman'
const cardImpl = {
  reaches: [
    'OLD_E12_FishingRod',
    'OLD_E22_Raft',
    'OLD_E30_Canoe',
    'OLD_I95_FishTrap',
    'OLD_K126_LandingNet',
  ] as readonly string[],
  listeners: [
    {
      id: CARD_ID + '-double',
      cardIds: [CARD_ID],
      actionSpaces: 'all',
      phases: ['immediatelyAfter'],
      handler: (context) => {
        if (context.space?.id !== 'fishing') return
        const food = sumResourceMovedFromActionSpace(
          context.actionEvents,
          'food',
          (e) =>
            e.from.kind === 'actionSpace' &&
            e.from.spaceId === 'fishing' &&
            e.to.kind === 'player' &&
            e.to.playerId === context.player.id,
        )
        if (food <= 0) return
        const recipients = context.state.players.filter(
          (p) =>
            p.id !== context.player.id &&
            p.minorPlayed.some((id) =>
              [
                'OLD_E12_FishingRod',
                'OLD_E22_Raft',
                'OLD_E30_Canoe',
                'OLD_I95_FishTrap',
                'OLD_K126_LandingNet',
              ].includes(id),
            ),
        )
        if (context.player.resources.food + food < recipients.length) return
        return {
          sourceCard: CARD_ID,
          flow: {
            type: 'seq',
            optional: true,
            children: [
              gainLeaf(CARD_ID, { food }),
              ...recipients.map((p) => ({
                type: 'leaf' as const,
                actionId: 'gain',
                sourceCard: CARD_ID,
                params: {
                  food: 1,
                  payerId: context.player.id,
                  recipientPlayerId: p.id,
                },
              })),
            ],
          },
        }
      },
    },
  ],
} satisfies CardImpl
export const OLD_E161_Fisherman = defineOccupationCard({
  meta: {
    id: 'OLD_E161_Fisherman',
    originalId: 'E161_Fisherman',
    gameEdition: 'classic',
    name: '渔夫',
    deck: 'E',
    number: 161,
    desc: [
      '每当你使用钓鱼积累行动格时，你可以获得等于该行动格两倍数量的食物。然后你要付给E12鱼竿、E22木筏、E30独木舟 、I95鱼篓、K126渔网的玩家各1份食物。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '3+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E161.png',
    locales: {
      zh: {
        name: '渔夫',
        desc: [
          '每当你使用钓鱼积累行动格时，你可以获得等于该行动格两倍数量的食物。然后你要付给E12鱼竿、E22木筏、E30独木舟 、I95鱼篓、K126渔网的玩家各1份食物。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E161_Fisherman_impl = OLD_E161_Fisherman.impl
