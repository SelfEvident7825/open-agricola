import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { queueFutureMeeplesFlow } from '../../../actions/effects/internal/future-meeples'
const CARD_ID = 'OLD_I66_VillageWell'

const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state, player) =>
      queueFutureMeeplesFlow(state, {
        cardId: CARD_ID,
        playerId: player.id,
        startRound: state.round + 1,
        count: 3,
        resources: { food: 1 },
      }),
  },
} satisfies CardImpl
export const OLD_I66_VillageWell = defineMinorCard({
  meta: {
    id: 'OLD_I66_VillageWell',
    originalId: 'I66_VillageWell',
    gameEdition: 'classic',
    name: '村中水井',
    deck: 'I',
    number: 66,
    desc: [
      '打出此卡时，在之后的3个回合行动格上各放1份食物。这些回合开始时，你获得对应的食物。井：A10水井、I66村中水井、WM062后院水井、WA019绵羊井、WA020人工水井、NL042提水井。（本卡牌可算作1张次发/1张主发，但只算作1张发展卡。例：FR014巧克力、G004学徒工）草莓园',
    ],
    cost: {
      stone: 2,
      wood: 1,
    },
    vp: 5,
    prerequisite: '退还1个井',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I66.png',
    locales: {
      zh: {
        name: '村中水井',
        desc: [
          '打出此卡时，在之后的3个回合行动格上各放1份食物。这些回合开始时，你获得对应的食物。井：A10水井、I66村中水井、WM062后院水井、WA019绵羊井、WA020人工水井、NL042提水井。（本卡牌可算作1张次发/1张主发，但只算作1张发展卡。例：FR014巧克力、G004学徒工）草莓园',
        ],
        prerequisite: '退还1个井',
      },
    },
    returnCards: [
      'Major_Well',
      'OLD_WM062_BackyardWell',
      'OLD_WA019_LaGraceFountain',
      'OLD_WA020_MarketFountain',
      'OLD_NL042_DrawWell',
    ],
    alsoCountsAs: ['major'],
  },
  impl: cardImpl,
})
export const OLD_I66_VillageWell_impl = OLD_I66_VillageWell.impl
