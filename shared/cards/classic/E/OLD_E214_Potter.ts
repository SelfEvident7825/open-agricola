import { defineOccupationCard } from '../../card-source'
export const OLD_E214_Potter = defineOccupationCard({
  meta: {
    id: 'OLD_E214_Potter',
    originalId: 'E214_Potter',
    gameEdition: 'classic',
    name: '制陶工',
    deck: 'E',
    number: 214,
    desc: ['每个丰收时节，你可以将至多1块砖头转化为2份食物。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '4+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E214.png',
    locales: {
      zh: {
        name: '制陶工',
        desc: ['每个丰收时节，你可以将至多1块砖头转化为2份食物。'],
        prerequisite: '',
      },
    },
    exchanges: [
      {
        from: {
          clay: 1,
        },
        to: {
          food: 2,
        },
        triggers: ['harvest'],
        max: 1,
      },
    ],
  },
})
