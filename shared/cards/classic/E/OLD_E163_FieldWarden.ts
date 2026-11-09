import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { isSpaceOccupied, spaceHasPlayer } from '../../../domain/space'
import { OCCUPIED_SPACE_CHOICE_PREFIX } from '../../../actions/helpers/placement-constants'
const CARD_ID = 'OLD_E163_FieldWarden'
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
              ['vegetable-seeds', 'farmland', 'cultivation'].includes(s.id) &&
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
export const OLD_E163_FieldWarden = defineOccupationCard({
  meta: {
    id: 'OLD_E163_FieldWarden',
    originalId: 'E163_FieldWarden',
    gameEdition: 'classic',
    name: '护田人',
    deck: 'E',
    number: 163,
    desc: ['即使已有其他玩家占据了蔬菜种子/犁田/粮食耕种[犁播]行动格，你仍可使用它们。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E163.png',
    locales: {
      zh: {
        name: '护田人',
        desc: ['即使已有其他玩家占据了蔬菜种子/犁田/粮食耕种[犁播]行动格，你仍可使用它们。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E163_FieldWarden_impl = OLD_E163_FieldWarden.impl
