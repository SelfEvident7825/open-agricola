// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_O14_Spielefest = defineMinorCard({
  meta: {
    id: 'OLD_O14_Spielefest',
    originalId: 'O14_Spielefest',
    gameEdition: 'classic',
    name: '狂欢节',
    deck: 'O',
    number: 14,
    desc: [
      '（+ ）此卡是所有玩家都可使用的额外行动格。使用此格的玩家支付你1份食物获得2分，你使用则直接获得2分寄宿工人空房',
    ],
    cost: {
      wood: 2,
      food: 3,
    },
    vp: 2,
    prerequisite: '3职业',
    occupationPrerequisites: {
      min: 3,
    },
    passing: false,
    extraVp: true,
    implemented: false,
    artUrl: '/assets/classic/O/O14.png',
    locales: {
      zh: {
        name: '狂欢节',
        desc: [
          '（+ ）此卡是所有玩家都可使用的额外行动格。使用此格的玩家支付你1份食物获得2分，你使用则直接获得2分寄宿工人空房',
        ],
        prerequisite: '3职业',
      },
    },
  },
})
