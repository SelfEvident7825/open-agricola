// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_WM073_DiamondMine = defineMinorCard({
  meta: {
    id: 'OLD_WM073_DiamondMine',
    originalId: 'WM073_DiamondMine',
    gameEdition: 'classic',
    name: '钻石矿车',
    deck: 'WM',
    number: 73,
    desc: ['打出此卡时，在之后的2个回合行动格上各放1个石头。这些回合开始时，你获得对应的石头。'],
    cost: {},
    vp: 1,
    prerequisite: '3 Occupations',
    occupationPrerequisites: {
      min: 3,
    },
    passing: false,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/WM/WM073.png',
    locales: {
      zh: {
        name: '钻石矿车',
        desc: [
          '打出此卡时，在之后的2个回合行动格上各放1个石头。这些回合开始时，你获得对应的石头。',
        ],
        prerequisite: '职业×3',
      },
    },
  },
})
