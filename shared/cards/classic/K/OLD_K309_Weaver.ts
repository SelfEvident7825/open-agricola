import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { gainLeaf } from '../../helpers/pay-gain-node'

const CARD_ID = 'OLD_K309_Weaver'
const cardImpl = {
  effect: {
    id: CARD_ID,
    onWorkStart: (_state, player) => player.resources.sheep >= 2 ? gainLeaf(CARD_ID, { food: 1 }) : undefined,
  },
} satisfies CardImpl

export const OLD_K309_Weaver = defineOccupationCard({
  meta: {
    id: 'OLD_K309_Weaver',
    originalId: 'K309_Weaver',
    gameEdition: 'classic',
    name: '纺织工',
    deck: 'K',
    number: 309,
    desc: ['每个工作阶段开始时，如果你有至少2只羊，则你获得1份食物。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '3+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K309.png',
    locales: {
      zh: {
        name: '纺织工',
        desc: ['每个工作阶段开始时，如果你有至少2只羊，则你获得1份食物。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_K309_Weaver_impl = OLD_K309_Weaver.impl
