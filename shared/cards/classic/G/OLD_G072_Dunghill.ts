// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_G072_Dunghill = defineMinorCard({
  meta: {
    id: 'OLD_G072_Dunghill',
    originalId: 'G072_Dunghill',
    gameEdition: 'classic',
    name: '粪肥',
    deck: 'G',
    number: 72,
    desc: ['在作物收割阶段，如果你有2/3种动物，则你可以在1/2块已播种的田地上添加一份对应资源'],
    cost: {
      sheep: 1,
    },
    vp: 1,
    prerequisite: '2 Occupations',
    occupationPrerequisites: {
      min: 2,
    },
    passing: false,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/G/G072.png',
    locales: {
      zh: {
        name: '粪肥',
        desc: ['在作物收割阶段，如果你有2/3种动物，则你可以在1/2块已播种的田地上添加一份对应资源'],
        prerequisite: '职业×2',
      },
    },
  },
})
