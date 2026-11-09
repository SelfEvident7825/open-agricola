// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_NL003_YearofDisaster = defineMinorCard({
  meta: {
    id: 'OLD_NL003_YearofDisaster',
    originalId: 'NL003_YearofDisaster',
    gameEdition: 'classic',
    name: '灾荒之年',
    deck: 'NL',
    number: 3,
    desc: [
      '在下次和下下次丰收时节之间的回合结束时，每位其他玩家必须支付1食物到游戏供应区或者扣1分',
    ],
    cost: {},
    vp: 1,
    prerequisite: '2 Occupations',
    occupationPrerequisites: {
      min: 2,
    },
    passing: false,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/NL/NL003.png',
    locales: {
      zh: {
        name: '灾荒之年',
        desc: [
          '在下次和下下次丰收时节之间的回合结束时，每位其他玩家必须支付1食物到游戏供应区或者扣1分',
        ],
        prerequisite: '职业×2',
      },
    },
  },
})
