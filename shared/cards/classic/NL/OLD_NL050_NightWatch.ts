// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_NL050_NightWatch = defineMinorCard({
  meta: {
    id: 'OLD_NL050_NightWatch',
    originalId: 'NL050_NightWatch',
    gameEdition: 'classic',
    name: '夜巡',
    deck: 'NL',
    number: 50,
    desc: [
      '此卡是一个额外行动格。每回合在此卡上补充1份小麦。使用此行动格的玩家需要支付2食物到游戏供应区，并获得此卡上的所有小麦，并且可以将其中任意数量的小麦换成等量的分数',
    ],
    cost: {},
    vp: 2,
    prerequisite: '职业≤1',
    occupationPrerequisites: {
      max: 1,
    },
    passing: false,
    extraVp: true,
    implemented: false,
    artUrl: '/assets/classic/NL/NL050.png',
  },
})
