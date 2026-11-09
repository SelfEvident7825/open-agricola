import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { gainLeaf } from '../../helpers/pay-gain-node'
import { sumResourceMovedFromActionSpace } from '../../helpers/event-provenance'
const CARD_ID = 'OLD_I237_Juggler'
const cardImpl = {
  reaches: [
    'OLD_E167_Conjurer',
    'OLD_E169_Storyteller',
    'OLD_E212_Dancer',
    'OLD_I249_Puppeteer',
    'OLD_I257_StreetMusician',
    'OLD_K269_Acrobat',
    'OLD_K311_Magician',
    'OLD_K342_AnimalTrainer',
  ] as readonly string[],
  listeners: [
    {
      id: CARD_ID + '-double',
      cardIds: [CARD_ID],
      actionSpaces: 'all',
      phases: ['immediatelyAfter'],
      handler: (context) => {
        if (context.space?.id !== 'traveling-players') return
        const food = sumResourceMovedFromActionSpace(
          context.actionEvents,
          'food',
          (e) =>
            e.from.kind === 'actionSpace' &&
            e.from.spaceId === 'traveling-players' &&
            e.to.kind === 'player' &&
            e.to.playerId === context.player.id,
        )
        if (food <= 0) return
        const recipients = context.state.players.filter(
          (p) =>
            p.id !== context.player.id &&
            p.occupationPlayed.some((id) =>
              [
                'OLD_E167_Conjurer',
                'OLD_E169_Storyteller',
                'OLD_E212_Dancer',
                'OLD_I249_Puppeteer',
                'OLD_I257_StreetMusician',
                'OLD_K269_Acrobat',
                'OLD_K311_Magician',
                'OLD_K342_AnimalTrainer',
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
export const OLD_I237_Juggler = defineOccupationCard({
  meta: {
    id: 'OLD_I237_Juggler',
    originalId: 'I237_Juggler',
    gameEdition: 'classic',
    name: '杂技演员',
    deck: 'I',
    number: 237,
    desc: [
      '每当你使用卖艺积累行动格时，你可以获得等于该行动格两倍数量的食物。然后你要付给E167杂耍艺人、E169说书人、E212舞者、I249木偶艺人、I257街头乐手、K269空中飞人、K311魔术师、K342马戏驯兽师的玩家各1份食物。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '4+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I237.png',
    locales: {
      zh: {
        name: '杂技演员',
        desc: [
          '每当你使用卖艺积累行动格时，你可以获得等于该行动格两倍数量的食物。然后你要付给E167杂耍艺人、E169说书人、E212舞者、I249木偶艺人、I257街头乐手、K269空中飞人、K311魔术师、K342马戏驯兽师的玩家各1份食物。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_I237_Juggler_impl = OLD_I237_Juggler.impl
