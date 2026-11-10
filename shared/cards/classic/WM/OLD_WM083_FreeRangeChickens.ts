// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_WM083_FreeRangeChickens = defineMinorCard({
  meta: {
    id: 'OLD_WM083_FreeRangeChickens',
    originalId: 'WM083_FreeRangeChickens',
    gameEdition: 'classic',
    name: '散养鸡',
    deck: 'WM',
    number: 83,
    desc: [
      '每回合开始时，如果你有至少1个麦田，拿取1份食物（从游戏供应区）到此卡上。此卡上的食物你可以随时使用。游戏结束时，如果此卡上有3/6+份食物，则你获得1/2分。注：“麦田×1”包括卡牌田。',
    ],
    cost: {
      wood: 1,
    },
    vp: 0,
    prerequisite: '1 Grain Fields',
    passing: false,
    extraVp: true,
    implemented: false,
    artUrl: '/assets/classic/WM/WM083.png',
  },
})
