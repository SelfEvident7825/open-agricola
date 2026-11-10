// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_NL056_ImpossibleCrate = defineMinorCard({
  meta: {
    id: 'OLD_NL056_ImpossibleCrate',
    originalId: 'NL056_ImpossibleCrate',
    gameEdition: 'classic',
    name: '不可能的盒子',
    deck: 'NL',
    number: 56,
    desc: [
      '当前回合数加3，在该回合行动格上放置12根栅栏条，该回合开始时，你可以拿回栅栏条并执行一次“围建栅栏”行动。(正常支付)',
    ],
    cost: {
      wood: 2,
    },
    vp: 2,
    prerequisite: '未使用栅栏≥12',
    passing: false,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/NL/NL056.png',
  },
})
