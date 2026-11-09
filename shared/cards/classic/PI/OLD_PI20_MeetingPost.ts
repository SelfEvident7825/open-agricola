// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_PI20_MeetingPost = defineMinorCard({
  meta: {
    id: 'OLD_PI20_MeetingPost',
    originalId: 'PI20_MeetingPost',
    gameEdition: 'classic',
    name: 'Skimmer Plow',
    deck: 'PI',
    number: 20,
    desc: [
      'Each time you use the __Farmland__ or __Cultivation__  action space, you can plow 2 fields instead of 1. Each time you sow, you must place 1 fewer good on each field you sow.',
    ],
    cost: {
      wood: 1,
    },
    vp: 0,
    prerequisite: '2 Occupations',
    occupationPrerequisites: {
      min: 2,
    },
    passing: false,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/PI/PI20.png',
    locales: {
      zh: {
        name: 'Skimmer Plow',
        desc: [
          'Each time you use the __Farmland__ or __Cultivation__  action space, you can plow 2 fields instead of 1. Each time you sow, you must place 1 fewer good on each field you sow.',
        ],
        prerequisite: '2 Occupations',
      },
    },
  },
})
