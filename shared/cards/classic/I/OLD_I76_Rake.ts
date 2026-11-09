import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { getFarmyardFields } from '../../helpers/card-field'
import { getCardDefinition } from '../../catalog'
const CARD_ID = 'OLD_I76_Rake'

const cardImpl = {
  effect: {
    id: CARD_ID,
    computeBonusScore: (_state, player) =>
      getFarmyardFields(player).length >=
      (player.minorPlayed.some(
        (id) =>
          getCardDefinition(id)?.plowEffect || ['OLD_I70_Punner', 'OLD_K124_Yoke'].includes(id),
      )
        ? 6
        : 5)
        ? 2
        : 0,
  },
  reaches: ['OLD_I70_Punner', 'OLD_K124_Yoke'],
} satisfies CardImpl
export const OLD_I76_Rake = defineMinorCard({
  meta: {
    id: 'OLD_I76_Rake',
    originalId: 'I76_Rake',
    gameEdition: 'classic',
    name: '钉耙',
    deck: 'I',
    number: 76,
    desc: [
      '游戏结束时，如果你有至少5个田地板块，则你获得2分。如果你有I68耙、I70夯具、K124轭具或犁，则需要至少6个田地板块。',
    ],
    cost: {
      wood: 1,
    },
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I76.png',
    locales: {
      zh: {
        name: '钉耙',
        desc: [
          '游戏结束时，如果你有至少5个田地板块，则你获得2分。如果你有I68耙、I70夯具、K124轭具或犁，则需要至少6个田地板块。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_I76_Rake_impl = OLD_I76_Rake.impl
