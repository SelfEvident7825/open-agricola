// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_WM103_Raspberries = defineMinorCard({
  meta: {
    id: 'OLD_WM103_Raspberries',
    originalId: 'WM103_Raspberries',
    gameEdition: 'classic',
    name: '树莓',
    deck: 'WM',
    number: 103,
    desc: [
      '从游戏供应区拿取食物，在你至多3个农场空格上各放置1份食物。当对应农场空格被占用时，你获得对应的食物。注：放置食物的农场空格仍视为未占用。',
    ],
    cost: {
      clay: 1,
    },
    vp: 1,
    prerequisite: '2 Occupations',
    occupationPrerequisites: {
      min: 2,
    },
    passing: false,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/WM/WM103.png',
  },
})
