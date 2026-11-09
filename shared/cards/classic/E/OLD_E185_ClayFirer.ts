import { defineOccupationCard } from '../../card-source'
export const OLD_E185_ClayFirer = defineOccupationCard({
  meta: {
    id: 'OLD_E185_ClayFirer',
    originalId: 'E185_ClayFirer',
    gameEdition: 'classic',
    name: '烧砖工',
    deck: 'E',
    number: 185,
    desc: ['任意时刻，你可以把砖头按照以下比例转化成石头：2砖头 → 1石头3砖头 → 2石头'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '3+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E185.png',
    locales: {
      zh: {
        name: '烧砖工',
        desc: ['任意时刻，你可以把砖头按照以下比例转化成石头：2砖头 → 1石头3砖头 → 2石头'],
        prerequisite: '',
      },
    },
    exchanges: [
      {
        from: {
          clay: 2,
        },
        to: {
          stone: 1,
        },
        triggers: ['anytime'],
      },
      {
        from: {
          clay: 3,
        },
        to: {
          stone: 2,
        },
        triggers: ['anytime'],
      },
    ],
  },
})
