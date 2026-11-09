// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_C20_Golem = defineMinorCard({
  meta: {
    id: 'OLD_C20_Golem',
    originalId: 'C20_Golem',
    gameEdition: 'classic',
    name: '炉',
    deck: 'C',
    number: 20,
    desc: [
      '在此卡上放置2砖，在之后两回合开始时，你退还1砖到游戏供应区，并且在本回合你的第一位家庭成员使用行动格时，可以执行两次对应的效果(如果是积累行动格则额外获得积累1次的量)',
    ],
    cost: {
      wood: 1,
    },
    vp: 0,
    prerequisite: '2 Occupations',
    occupationPrerequisites: {
      min: 2,
    },
    passing: false,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/C/C20.png',
    locales: {
      zh: {
        name: '炉',
        desc: [
          '在此卡上放置2砖，在之后两回合开始时，你退还1砖到游戏供应区，并且在本回合你的第一位家庭成员使用行动格时，可以执行两次对应的效果(如果是积累行动格则额外获得积累1次的量)',
        ],
        prerequisite: '职业×2',
      },
    },
  },
})
