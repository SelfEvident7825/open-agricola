// Generated classic import. Remove this line before manually porting a card.
import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { getUnfencedStableCountForCards } from '../../../domain/stables'

const CARD_ID = 'OLD_FL046_StableArchitect'

const cardImpl = {
  effect: {
    id: CARD_ID,
    computeBonusScore: (_state, player) => getUnfencedStableCountForCards(player),
  },
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_FL046_StableArchitect = defineOccupationCard({
  meta: {
    id: 'OLD_FL046_StableArchitect',
    name: '马厩建造师',
    deck: 'FL',
    number: 46,
    category: 'POINTS_PROVIDER',
    desc: ['游戏结束时，你农场上每个未被栅栏围住的马厩都能使你获得1分。'],
    cost: {},
    players: '1+',
    extraVp: true,
    originalId: 'FL046_StableArchitect',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    implemented: true,
    artUrl: '/assets/classic/FL/FL046.png',
    locales: {
      zh: {
        name: '马厩建造师',
        desc: ['游戏结束时，你农场上每个未被栅栏围住的马厩都能使你获得1分。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_FL046_StableArchitect_impl = OLD_FL046_StableArchitect.impl
