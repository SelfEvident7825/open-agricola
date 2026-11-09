import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { isSpaceOccupied, spaceHasPlayer } from '../../../domain/space'
import { OCCUPIED_SPACE_CHOICE_PREFIX } from '../../../actions/helpers/placement-constants'
const CARD_ID = 'OLD_E159_HeadoftheFamily'
const cardImpl = {
  listeners: [
    {
      id: CARD_ID + '-occupied',
      cardIds: [CARD_ID],
      actions: ['place-farmer'],
      phases: ['computeArgs'],
      handler: ({ state, player }) => ({
        sourceCard: CARD_ID,
        extraOptions: state.actionSpaces
          .filter(
            (s) =>
              ['farm-expansion', 'wish-children', 'urgent-wish-children'].includes(s.id) &&
              isSpaceOccupied(s) &&
              !spaceHasPlayer(s, player.id),
          )
          .map((s) => ({
            value: OCCUPIED_SPACE_CHOICE_PREFIX + s.id,
            labelKey: s.nameKey,
            sourceCard: CARD_ID,
          })),
      }),
    },
  ],
} satisfies CardImpl
export const OLD_E159_HeadoftheFamily = defineOccupationCard({
  meta: {
    id: 'OLD_E159_HeadoftheFamily',
    originalId: 'E159_HeadoftheFamily',
    gameEdition: 'classic',
    name: '一家之主',
    deck: 'E',
    number: 159,
    desc: [
      '即使已有其他玩家占据了能够提供“扩建房屋”和“增加家庭成员”行动的行动格，你仍可使用这些行动格。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E159.png',
    locales: {
      zh: {
        name: '一家之主',
        desc: [
          '即使已有其他玩家占据了能够提供“扩建房屋”和“增加家庭成员”行动的行动格，你仍可使用这些行动格。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E159_HeadoftheFamily_impl = OLD_E159_HeadoftheFamily.impl
