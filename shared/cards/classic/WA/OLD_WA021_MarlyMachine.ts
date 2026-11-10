// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_WA021_MarlyMachine = defineMinorCard({
  meta: {
    id: 'OLD_WA021_MarlyMachine',
    originalId: 'WA021_MarlyMachine',
    gameEdition: 'classic',
    name: '泥磨机',
    deck: 'WA',
    number: 21,
    desc: ['回合开始时，如果有至少1名玩家获得水井的食物，则你获得1份食物壁炉台砖屋或石'],
    cost: {
      food: 1,
      wood: 1,
    },
    vp: 2,
    prerequisite: '其他玩家有水井',
    passing: false,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/WA/WA021.png',
  },
})
