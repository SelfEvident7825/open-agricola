import { defineOccupationCard } from '../../card-source'
export const OLD_E158_Turner = defineOccupationCard({
  meta: {
    id: 'OLD_E158_Turner',
    originalId: 'E158_Turner',
    gameEdition: 'classic',
    name: '车工',
    deck: 'E',
    number: 158,
    desc: ['任意时刻，你可以将1个木头转化成1份食物。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E158.png',
    locales: {
      zh: {
        name: '车工',
        desc: ['任意时刻，你可以将1个木头转化成1份食物。'],
        prerequisite: '',
      },
    },
    exchanges: [
      {
        from: {
          wood: 1,
        },
        to: {
          food: 1,
        },
        triggers: ['anytime'],
      },
    ],
  },
})
