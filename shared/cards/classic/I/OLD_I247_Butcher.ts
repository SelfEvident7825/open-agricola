import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'

const cardImpl = {} satisfies CardImpl
export const OLD_I247_Butcher = defineOccupationCard({
  meta: {
    id: 'OLD_I247_Butcher',
    originalId: 'I247_Butcher',
    gameEdition: 'classic',
    name: '屠夫',
    deck: 'I',
    number: 247,
    desc: ['任意时刻，你可以将1只羊/猪/牛转换成1/2/3份食物。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '3+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I247.png',
    exchanges: [
      {
        from: {
          sheep: 1,
        },
        to: {
          food: 1,
        },
        triggers: ['anytime'],
      },
      {
        from: {
          boar: 1,
        },
        to: {
          food: 2,
        },
        triggers: ['anytime'],
      },
      {
        from: {
          cattle: 1,
        },
        to: {
          food: 3,
        },
        triggers: ['anytime'],
      },
    ],
  },
  impl: cardImpl,
})
export const OLD_I247_Butcher_impl = OLD_I247_Butcher.impl
