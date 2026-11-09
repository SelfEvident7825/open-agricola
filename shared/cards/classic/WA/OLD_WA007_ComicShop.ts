// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_WA007_ComicShop = defineMinorCard({
  meta: {
    id: 'OLD_WA007_ComicShop',
    originalId: 'WA007_ComicShop',
    gameEdition: 'classic',
    name: '漫画店',
    deck: 'WA',
    number: 7,
    desc: [
      '此卡是所有玩家可用的额外行动格。只有家中无人时能使用此格，且直到回合结束家中不能有人。使用此格的玩家在之后2个回合中，每个轮次能派遣至多2名家庭成员。',
    ],
    cost: {
      wood: 1,
      clay: 1,
    },
    vp: 3,
    prerequisite: '8或9回合',
    passing: false,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/WA/WA007.png',
    locales: {
      zh: {
        name: '漫画店',
        desc: [
          '此卡是所有玩家可用的额外行动格。只有家中无人时能使用此格，且直到回合结束家中不能有人。使用此格的玩家在之后2个回合中，每个轮次能派遣至多2名家庭成员。',
        ],
        prerequisite: '8或9回合',
      },
    },
  },
})
