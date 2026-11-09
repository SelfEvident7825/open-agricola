// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_G107_SheepMarket = defineMinorCard({
  meta: {
    id: 'OLD_G107_SheepMarket',
    originalId: 'G107_SheepMarket',
    gameEdition: 'classic',
    name: '羊市场',
    deck: 'G',
    number: 107,
    desc: [
      '每个丰收时节开始时，你可以把至多1个小麦或1个蔬菜换成1只羊，或者把至多1只羊换成1个小麦或1个蔬菜',
    ],
    cost: {
      wood: 1,
    },
    vp: 0,
    prerequisite: '1 Occupations',
    occupationPrerequisites: {
      min: 1,
    },
    passing: false,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/G/G107.png',
    locales: {
      zh: {
        name: '羊市场',
        desc: [
          '每个丰收时节开始时，你可以把至多1个小麦或1个蔬菜换成1只羊，或者把至多1只羊换成1个小麦或1个蔬菜',
        ],
        prerequisite: '职业×1',
      },
    },
  },
})
