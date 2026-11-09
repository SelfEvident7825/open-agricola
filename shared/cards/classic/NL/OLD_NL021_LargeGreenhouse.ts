// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_NL021_LargeGreenhouse = defineMinorCard({
  meta: {
    id: 'OLD_NL021_LargeGreenhouse',
    originalId: 'NL021_LargeGreenhouse',
    gameEdition: 'classic',
    name: '大型温室',
    deck: 'NL',
    number: 21,
    desc: ['将当前回合数加5,7,9，在这些回合的行动格上各放1份蔬菜，这些回合开始时，你获得这份蔬菜'],
    cost: {
      wood: 2,
    },
    vp: 0,
    prerequisite: '2 Occupations',
    occupationPrerequisites: {
      min: 2,
    },
    passing: false,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/NL/NL021.png',
    locales: {
      zh: {
        name: '大型温室',
        desc: [
          '将当前回合数加5,7,9，在这些回合的行动格上各放1份蔬菜，这些回合开始时，你获得这份蔬菜',
        ],
        prerequisite: '职业×2',
      },
    },
  },
})
