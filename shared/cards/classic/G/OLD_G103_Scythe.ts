// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_G103_Scythe = defineMinorCard({
  meta: {
    id: 'OLD_G103_Scythe',
    originalId: 'G103_Scythe',
    gameEdition: 'classic',
    name: '长柄镰刀',
    deck: 'G',
    number: 103,
    desc: ['你可以在已播种的田上播种同种资源，将新的资源叠放在原有每一列资源的上面。'],
    cost: {
      wood: 1,
      stone: 1,
    },
    vp: 1,
    prerequisite: '1 Occupations',
    occupationPrerequisites: {
      min: 1,
    },
    passing: false,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/G/G103.png',
    locales: {
      zh: {
        name: '长柄镰刀',
        desc: ['你可以在已播种的田上播种同种资源，将新的资源叠放在原有每一列资源的上面。'],
        prerequisite: '职业×1',
      },
    },
  },
})
