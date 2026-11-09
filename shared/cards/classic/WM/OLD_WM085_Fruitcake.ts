// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_WM085_Fruitcake = defineMinorCard({
  meta: {
    id: 'OLD_WM085_Fruitcake',
    originalId: 'WM085_Fruitcake',
    gameEdition: 'classic',
    name: '水果蛋糕',
    deck: 'WM',
    number: 85,
    desc: ['下一次丰收时节的喂养阶段，你的每个家庭成员(包括新生儿)少喂养1份食物。'],
    cost: {
      wood: 1,
    },
    vp: 0,
    prerequisite: '2 Occupations',
    occupationPrerequisites: {
      min: 2,
    },
    passing: false,
    extraVp: true,
    implemented: false,
    artUrl: '/assets/classic/WM/WM085.png',
    locales: {
      zh: {
        name: '水果蛋糕',
        desc: ['下一次丰收时节的喂养阶段，你的每个家庭成员(包括新生儿)少喂养1份食物。'],
        prerequisite: '职业×2',
      },
    },
  },
})
