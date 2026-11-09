// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_FL020_LoveGarden = defineMinorCard({
  meta: {
    id: 'OLD_FL020_LoveGarden',
    originalId: 'FL020_LoveGarden',
    gameEdition: 'classic',
    name: '爱情花园',
    deck: 'FL',
    number: 20,
    desc: [
      '每个工作阶段结束时，如果所有提供“生娃”和“扩建房屋”行动的行动格都被占用，你立即执行1次“生娃(需要空房间)”行动',
    ],
    cost: {
      food: 2,
    },
    vp: 0,
    prerequisite: '存在生娃行动格',
    passing: false,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/FL/FL020.png',
    locales: {
      zh: {
        name: '爱情花园',
        desc: [
          '每个工作阶段结束时，如果所有提供“生娃”和“扩建房屋”行动的行动格都被占用，你立即执行1次“生娃(需要空房间)”行动',
        ],
        prerequisite: '存在生娃行动格',
      },
    },
  },
})
