import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import type { BonusScoreLevel } from '../../card-effects'
import { createSingleHarvestExchange } from '../../helpers/stage-effects'

const CARD_ID = 'OLD_K122_Sawmill'

const cardImpl = {
  effect: {
    id: CARD_ID,
    onHarvest: createSingleHarvestExchange(CARD_ID),
    computeCostedBonus: (_state, player): BonusScoreLevel[] => [
      {
        cost: {},
        score: 0,
      },
      ...[2, 4, 5].flatMap((amount, index) => player.resources.wood >= amount
        ? [
          {
            cost: { wood: amount },
            score: index + 1,
          },
        ] : []),
    ],
  },
} satisfies CardImpl

export const OLD_K122_Sawmill = defineMinorCard({
  meta: {
    id: 'OLD_K122_Sawmill',
    originalId: 'K122_Sawmill',
    gameEdition: 'classic',
    name: '大家具工坊',
    deck: 'K',
    number: 122,
    desc: [
      '每个丰收时节，你可以将至多1根木头转化为3份食物。游戏结束时，如果你有2/4/5+根木头，额外获得1/2/3分。(多余的木头不能再用于A7家具工坊的计分)（本卡牌可算作1张次发/1张主发，但只算作1张发展卡。',
    ],
    cost: {},
    vp: 3,
    prerequisite: '退还A7家具工坊',
    passing: false,
    extraVp: true,
    implemented: true,
    returnCards: ['Major_Joinery'],
    alsoCountsAs: ['major'],
    joineryIdentity: true,
    exchanges: [{ from: { wood: 1 }, to: { food: 3 }, triggers: ['harvest'], max: 1 }],
    artUrl: '/assets/classic/K/K122.png',
  },
  impl: cardImpl,
})

export const OLD_K122_Sawmill_impl = OLD_K122_Sawmill.impl
