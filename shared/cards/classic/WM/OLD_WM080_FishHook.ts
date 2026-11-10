// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_WM080_FishHook = defineMinorCard({
  meta: {
    id: 'OLD_WM080_FishHook',
    originalId: 'WM080_FishHook',
    gameEdition: 'classic',
    name: '鱼钩',
    deck: 'WM',
    number: 80,
    desc: [
      '每当你使用与钓鱼积累行动格正交相邻的行动格时，你可以立即从钓鱼积累行动格上取走1份食物。注：一般情况下是指芦苇积累行动格、临时工、第4回合行动格。',
    ],
    cost: {
      wood: 1,
    },
    vp: 1,
    prerequisite: '2 Occupations',
    occupationPrerequisites: {
      min: 2,
    },
    passing: false,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/WM/WM080.png',
  },
})
