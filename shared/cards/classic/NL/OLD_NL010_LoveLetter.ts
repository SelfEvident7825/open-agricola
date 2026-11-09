// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_NL010_LoveLetter = defineMinorCard({
  meta: {
    id: 'OLD_NL010_LoveLetter',
    originalId: 'NL010_LoveLetter',
    gameEdition: 'classic',
    name: '情书',
    deck: 'NL',
    number: 10,
    desc: [
      '如果你在当前回合数加1/2/3的回合中使用生儿育女行动格，你得到2/3/5份食物(标记打出时的回合)蚱蜢',
    ],
    cost: {
      wood: 1,
    },
    vp: 1,
    prerequisite: '发展卡×2',
    improvementPrerequisites: {
      min: 2,
    },
    passing: false,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/NL/NL010.png',
    locales: {
      zh: {
        name: '情书',
        desc: [
          '如果你在当前回合数加1/2/3的回合中使用生儿育女行动格，你得到2/3/5份食物(标记打出时的回合)蚱蜢',
        ],
        prerequisite: '发展卡×2',
      },
    },
  },
})
