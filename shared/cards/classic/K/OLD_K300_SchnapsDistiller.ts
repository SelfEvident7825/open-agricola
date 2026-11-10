import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K300_SchnapsDistiller'
const cardImpl = {} satisfies CardImpl

export const OLD_K300_SchnapsDistiller = defineOccupationCard({
  meta: {
    id: CARD_ID,
    originalId: 'K300_SchnapsDistiller',
    gameEdition: 'classic',
    name: '烈酒蒸馏师',
    deck: 'K',
    number: 300,
    desc: ['每个丰收时节的喂养阶段，你可以将至多1份蔬菜转化为5份食物。'],
    cost: {},
    exchanges: [{ from: { vegetable: 1 }, to: { food: 5 }, triggers: ['harvest'], max: 1 }],
    vp: 0,
    prerequisite: '',
    players: '3+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K300.png',
    locales: {
      zh: {
        name: '烈酒蒸馏师',
        desc: ['每个丰收时节的喂养阶段，你可以将至多1份蔬菜转化为5份食物。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_K300_SchnapsDistiller_impl = OLD_K300_SchnapsDistiller.impl
