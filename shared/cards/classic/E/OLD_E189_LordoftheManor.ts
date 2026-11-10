import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E189_LordoftheManor'
const cardImpl = {
  effect: {
    id: CARD_ID,
    computeBonusScore: (_state, _player, ctx) => {
      // 1 VP per standard category where score = 4 (max in standard range)
      // The reference whitelist (`computeSpecialScore`): fields, pastures, grains,
      // vegetables, sheeps, pigs, cattles, stables. Card desc explicitly: "The
      // bonus point is also awarded for 4 fenced stables."
      const standardCategories = [
        'fields',
        'pastures',
        'grains',
        'vegetables',
        'sheeps',
        'boars',
        'cattles',
        'stables',
      ]
      return (ctx.categories ?? []).filter(
        (cat) => standardCategories.includes(cat.key) && cat.total >= 4,
      ).length
    },
  },
  reaches: [] as readonly string[],
} satisfies CardImpl
export const OLD_E189_LordoftheManor = defineOccupationCard({
  meta: {
    id: 'OLD_E189_LordoftheManor',
    name: '庄园领主',
    deck: 'E',
    number: 189,
    category: 'POINTS_PROVIDER',
    desc: ['游戏结束时，你每个获得了4分满分的计分项（包括4个被栅栏围住的马厩）都使你额外获得1分。'],
    cost: {},
    players: '3+',
    extraVp: true,
    originalId: 'E189_LordoftheManor',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    implemented: true,
    artUrl: '/assets/classic/E/E189.png',
  },
  impl: cardImpl,
})
export const OLD_E189_LordoftheManor_impl = OLD_E189_LordoftheManor.impl
