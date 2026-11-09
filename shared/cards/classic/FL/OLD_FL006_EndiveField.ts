// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_FL006_EndiveField = defineMinorCard({
  meta: {
    id: 'OLD_FL006_EndiveField',
    originalId: 'FL006_EndiveField',
    gameEdition: 'classic',
    name: '菊苣田',
    deck: 'FL',
    number: 6,
    desc: ['打出时获得1份蔬菜，在以丰收时节为结束的回合结束时，你可以在此卡上播种蔬菜'],
    cost: {
      food: 2,
    },
    vp: 0,
    prerequisite: '2 Occupations',
    occupationPrerequisites: {
      min: 2,
    },
    passing: false,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/FL/FL006.png',
    locales: {
      zh: {
        name: '菊苣田',
        desc: ['打出时获得1份蔬菜，在以丰收时节为结束的回合结束时，你可以在此卡上播种蔬菜'],
        prerequisite: '职业×2',
      },
    },
  },
})
