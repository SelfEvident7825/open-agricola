import { defineOccupationCard } from '../../card-source'
export const OLD_E209_Quarryman = defineOccupationCard({
  meta: {
    id: 'OLD_E209_Quarryman',
    originalId: 'E209_Quarryman',
    gameEdition: 'classic',
    name: '采石工',
    deck: 'E',
    number: 209,
    desc: ['任意时刻，你可以将1个石头转化为2份食物。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '4+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E209.png',
    locales: {
      zh: {
        name: '采石工',
        desc: ['任意时刻，你可以将1个石头转化为2份食物。'],
        prerequisite: '',
      },
    },
    exchanges: [
      {
        from: {
          stone: 1,
        },
        to: {
          food: 2,
        },
        triggers: ['anytime'],
      },
    ],
  },
})
