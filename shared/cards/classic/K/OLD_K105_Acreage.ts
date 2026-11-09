// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_K105_Acreage = defineMinorCard({
  meta: {
    id: 'OLD_K105_Acreage',
    originalId: 'K105_Acreage',
    gameEdition: 'classic',
    name: '一亩田',
    deck: 'K',
    number: 105,
    desc: ['每次播种时，你可以在此卡上播种至多2列小麦。(视作“2块麦田”)'],
    cost: {},
    vp: 0,
    prerequisite: '1 Occupations',
    occupationPrerequisites: {
      min: 1,
    },
    passing: false,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/K/K105.png',
    locales: {
      zh: {
        name: '一亩田',
        desc: ['每次播种时，你可以在此卡上播种至多2列小麦。(视作“2块麦田”)'],
        prerequisite: '职业×1',
      },
    },
  },
})
