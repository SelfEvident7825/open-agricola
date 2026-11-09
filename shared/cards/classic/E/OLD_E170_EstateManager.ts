import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E170_EstateManager'
const cardImpl = {
  effect: {
    id: CARD_ID,
    computeBonusScore: (state, player, _ctx) =>
      ['sheep', 'boar', 'cattle'].every((type) =>
        state.players.every(
          (p) => p.resources[type as 'sheep'] <= player.resources[type as 'sheep'],
        ),
      )
        ? Math.min(4, state.players.length - 1)
        : 0,
  },
} satisfies CardImpl
export const OLD_E170_EstateManager = defineOccupationCard({
  meta: {
    id: 'OLD_E170_EstateManager',
    originalId: 'E170_EstateManager',
    gameEdition: 'classic',
    name: '地产管理人',
    deck: 'E',
    number: 170,
    desc: [
      '游戏结束时，如果你三种动物都是数量最多（或者同时最多）的，在3/4/5+人游戏中额外获得2/3/4分。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: true,
    implemented: true,
    artUrl: '/assets/classic/E/E170.png',
    locales: {
      zh: {
        name: '地产管理人',
        desc: [
          '游戏结束时，如果你三种动物都是数量最多（或者同时最多）的，在3/4/5+人游戏中额外获得2/3/4分。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E170_EstateManager_impl = OLD_E170_EstateManager.impl
