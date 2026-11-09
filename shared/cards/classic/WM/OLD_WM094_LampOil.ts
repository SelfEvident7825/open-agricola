// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_WM094_LampOil = defineMinorCard({
  meta: {
    id: 'OLD_WM094_LampOil',
    originalId: 'WM094_LampOil',
    gameEdition: 'classic',
    name: '灯油',
    deck: 'WM',
    number: 94,
    desc: [
      '每次你打出1张职业卡前，你额外获得1份食物。注：本卡牌打出条件“动物×2”可为同种或不同种动物, 卡牌动物不算。',
    ],
    cost: {
      wood: 2,
      clay: 2,
    },
    vp: 2,
    prerequisite: '动物×2',
    passing: false,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/WM/WM094.png',
    locales: {
      zh: {
        name: '灯油',
        desc: [
          '每次你打出1张职业卡前，你额外获得1份食物。注：本卡牌打出条件“动物×2”可为同种或不同种动物, 卡牌动物不算。',
        ],
        prerequisite: '动物×2',
      },
    },
  },
})
