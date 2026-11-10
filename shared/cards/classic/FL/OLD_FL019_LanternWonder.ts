// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_FL019_LanternWonder'

const cardImpl = {
  effect: {
    id: CARD_ID,
    computeBonusScore: (_state, player) => {
      return -(player.minorHand.length + player.occupationHand.length)
    },
  },
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_FL019_LanternWonder = defineMinorCard({
  meta: {
    id: 'OLD_FL019_LanternWonder',
    name: '灯笼奇观',
    deck: 'FL',
    number: 19,
    category: 'POINTS_PROVIDER',
    desc: [
      '游戏结束时，你手中每剩1张卡牌便扣1分。无论如何，你都不能弃除手中的卡牌了。若你已通过某种方式弃除过卡牌，则不能打出此卡。',
    ],
    cost: {},
    vp: 8,
    prerequisite: '职业=0',
    occupationPrerequisites: {
      max: 0,
    },
    extraVp: false,
    preventsHandDiscard: true,
    originalId: 'FL019_LanternWonder',
    gameEdition: 'classic',
    passing: false,
    implemented: true,
    artUrl: '/assets/classic/FL/FL019.png',
  },
  impl: cardImpl,
})

export const OLD_FL019_LanternWonder_impl = OLD_FL019_LanternWonder.impl
