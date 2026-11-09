import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E165_YeomanFarmer'
const cardImpl = {
  effect: {
    id: CARD_ID,
    computeBonusScore: (_state, _player, ctx) =>
      ctx.categories
        .filter((c) =>
          ['fields', 'pastures', 'grains', 'vegetables', 'sheeps', 'boars', 'cattles'].includes(
            c.key,
          ),
        )
        .reduce((n, c) => n - Math.min(0, c.total), 0),
  },
} satisfies CardImpl
export const OLD_E165_YeomanFarmer = defineOccupationCard({
  meta: {
    id: 'OLD_E165_YeomanFarmer',
    originalId: 'E165_YeomanFarmer',
    gameEdition: 'classic',
    name: '自由农民',
    deck: 'E',
    number: 165,
    desc: ['游戏结束时，你只因为未使用的农场空格和乞讨卡而损失分数。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '3+',
    passing: false,
    extraVp: true,
    implemented: true,
    artUrl: '/assets/classic/E/E165.png',
    locales: {
      zh: {
        name: '自由农民',
        desc: ['游戏结束时，你只因为未使用的农场空格和乞讨卡而损失分数。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E165_YeomanFarmer_impl = OLD_E165_YeomanFarmer.impl
