// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_WM058_AppleTree = defineMinorCard({
  meta: {
    id: 'OLD_WM058_AppleTree',
    originalId: 'WM058_AppleTree',
    gameEdition: 'classic',
    name: '苹果树',
    deck: 'WM',
    number: 58,
    desc: [
      '从游戏供应区拿取1根木头放到1块空田上，该田视为已播种。每个丰收时节的收割阶段时，你获得1份食物。此卡牌打出条件“空田×1”必须是田地板块。此田可视为1块已播种田。',
    ],
    cost: {
      wood: 1,
    },
    vp: 1,
    prerequisite: '空田×1',
    passing: false,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/WM/WM058.png',
    locales: {
      zh: {
        name: '苹果树',
        desc: [
          '从游戏供应区拿取1根木头放到1块空田上，该田视为已播种。每个丰收时节的收割阶段时，你获得1份食物。此卡牌打出条件“空田×1”必须是田地板块。此田可视为1块已播种田。',
        ],
        prerequisite: '空田×1',
      },
    },
  },
})
