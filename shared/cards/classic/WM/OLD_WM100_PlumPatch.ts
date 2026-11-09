// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_WM100_PlumPatch = defineMinorCard({
  meta: {
    id: 'OLD_WM100_PlumPatch',
    originalId: 'WM100_PlumPatch',
    gameEdition: 'classic',
    name: '葡萄干',
    deck: 'WM',
    number: 100,
    desc: [
      '计算你已播种的田地数量，在接下来的（等同于此数量）回合行动格上各放置1份食物。这些回合开始时，你获得对应的食物。注:（1）此卡牌打出条件包括卡牌田。（2）在本次计算时，每张已播种的卡牌田算作1块已播种的田。',
    ],
    cost: {},
    vp: 1,
    prerequisite: '1 Grain Fields+菜田×1',
    passing: false,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/WM/WM100.png',
    locales: {
      zh: {
        name: '葡萄干',
        desc: [
          '计算你已播种的田地数量，在接下来的（等同于此数量）回合行动格上各放置1份食物。这些回合开始时，你获得对应的食物。注:（1）此卡牌打出条件包括卡牌田。（2）在本次计算时，每张已播种的卡牌田算作1块已播种的田。',
        ],
        prerequisite: '麦田×1+菜田×1',
      },
    },
  },
})
