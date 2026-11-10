// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_NL015_RowBoat = defineMinorCard({
  meta: {
    id: 'OLD_NL015_RowBoat',
    originalId: 'NL015_RowBoat',
    gameEdition: 'classic',
    name: '划艇',
    deck: 'NL',
    number: 15,
    desc: [
      '每当其他玩家使用钓鱼积累行动格时，你可以将你一位已派遣的家庭成员移动到钓鱼积累行动格并获得1食物(这不算使用钓鱼)',
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
    artUrl: '/assets/classic/NL/NL015.png',
  },
})
