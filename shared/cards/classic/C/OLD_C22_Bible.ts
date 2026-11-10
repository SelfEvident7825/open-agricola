// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_C22_Bible = defineMinorCard({
  meta: {
    id: 'OLD_C22_Bible',
    originalId: 'C22_Bible',
    gameEdition: 'classic',
    name: '圣经',
    deck: 'C',
    number: 22,
    desc: [
      '在丰收时节前的那一回合，你使用了犁田/粮食耕种[犁播]/小麦种子/蔬菜种子/临时工行动格的家庭成员，在这个丰收时节的喂养阶段可以少喂养1食物',
    ],
    cost: {
      wood: 1,
    },
    vp: 1,
    prerequisite: '1 Occupations',
    occupationPrerequisites: {
      min: 1,
    },
    passing: false,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/C/C22.png',
  },
})
