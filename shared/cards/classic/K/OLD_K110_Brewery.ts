import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { createSingleHarvestExchange } from '../../helpers/stage-effects'
import { getLogicalFields } from '../../helpers/card-field'

const CARD_ID = 'OLD_K110_Brewery'

const cardImpl = {
  effect: {
    id: CARD_ID,
    onHarvestFeedingPhase: createSingleHarvestExchange(CARD_ID),
    computeBonusScore: (_state, player) => player.resources.grain + getLogicalFields(player)
      .flatMap(field => field.stacks).filter(stack => stack.kind === 'grain')
      .reduce((total, stack) => total + stack.remaining, 0) >= 9 ? 1 : 0,
  },
} satisfies CardImpl

export const OLD_K110_Brewery = defineMinorCard({
  meta: {
    id: 'OLD_K110_Brewery',
    originalId: 'K110_Brewery',
    gameEdition: 'classic',
    name: '酿酒厂',
    deck: 'K',
    number: 110,
    desc: [
      '每个丰收时节的喂养阶段，你可以使用此卡将至多1份小麦转化为3份食物。游戏结束时，你的第9份小麦额外获得1分。（田地里的小麦算作在内）',
    ],
    cost: {
      stone: 2,
      grain: 2,
    },
    vp: 2,
    prerequisite: '',
    passing: false,
    extraVp: true,
    implemented: true,
    exchanges: [{ from: { grain: 1 }, to: { food: 3 }, triggers: ['harvest'], max: 1 }],
    artUrl: '/assets/classic/K/K110.png',
    locales: {
      zh: {
        name: '酿酒厂',
        desc: [
          '每个丰收时节的喂养阶段，你可以使用此卡将至多1份小麦转化为3份食物。游戏结束时，你的第9份小麦额外获得1分。（田地里的小麦算作在内）',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_K110_Brewery_impl = OLD_K110_Brewery.impl
