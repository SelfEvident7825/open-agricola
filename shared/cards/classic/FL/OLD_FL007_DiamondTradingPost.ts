// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_FL007_DiamondTradingPost = defineMinorCard({
  meta: {
    id: 'OLD_FL007_DiamondTradingPost',
    originalId: 'FL007_DiamondTradingPost',
    gameEdition: 'classic',
    name: '钻石交易所',
    deck: 'FL',
    number: 7,
    desc: [
      '从游戏供应区拿取3个石头放在此卡上，任意时刻你可以将这3个石头移入个人供应区。每个丰收时节开始时，如果你个人供应区里的石头比此卡上的多，你可以支付1石头到此卡上并获得动物。第1/2/3次发动时分别获得2只羊/2只猪/2头牛。',
    ],
    cost: {
      wood: 3,
      clay: 3,
    },
    vp: 1,
    prerequisite: '3 Occupations',
    occupationPrerequisites: {
      min: 3,
    },
    passing: false,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/FL/FL007.png',
    locales: {
      zh: {
        name: '钻石交易所',
        desc: [
          '从游戏供应区拿取3个石头放在此卡上，任意时刻你可以将这3个石头移入个人供应区。每个丰收时节开始时，如果你个人供应区里的石头比此卡上的多，你可以支付1石头到此卡上并获得动物。第1/2/3次发动时分别获得2只羊/2只猪/2头牛。',
        ],
        prerequisite: '职业×3',
      },
    },
  },
})
