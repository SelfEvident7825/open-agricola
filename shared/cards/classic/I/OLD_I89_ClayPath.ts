import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_I89_ClayPath'

const cardImpl = {
  reaches: ['OLD_I83_WoodenPath', 'OLD_I89_ClayPath', 'OLD_I94_PavedRoad'],
  effect: {
    id: CARD_ID,
    computeBonusScore: (state) =>
      state.players.some((p) => p.minorPlayed.some((id) => ['OLD_I94_PavedRoad'].includes(id)))
        ? 0
        : 2,
  },
} satisfies CardImpl
export const OLD_I89_ClayPath = defineMinorCard({
  meta: {
    id: 'OLD_I89_ClayPath',
    originalId: 'I89_ClayPath',
    gameEdition: 'classic',
    name: '砖头路',
    deck: 'I',
    number: 89,
    desc: ['游戏结束时，拥有最有价值道路的玩家获得2分。(I94石板路>I89砖头路>I83木板路)'],
    cost: {
      clay: 3,
    },
    vp: 1,
    prerequisite: '',
    passing: false,
    extraVp: true,
    implemented: true,
    artUrl: '/assets/classic/I/I89.png',
  },
  impl: cardImpl,
})
export const OLD_I89_ClayPath_impl = OLD_I89_ClayPath.impl
