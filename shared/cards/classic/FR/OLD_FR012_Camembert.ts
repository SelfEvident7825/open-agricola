// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_FR012_Camembert = defineMinorCard({
  meta: {
    id: 'OLD_FR012_Camembert',
    originalId: 'FR012_Camembert',
    gameEdition: 'classic',
    name: '法式奶酪',
    deck: 'FR',
    number: 12,
    desc: ['在3个你选择的不同行动格上各放置1份食物，下一个使用这些行动格的玩家获得这份食物'],
    cost: {},
    vp: 1,
    prerequisite: '2 Occupations',
    occupationPrerequisites: {
      min: 2,
    },
    passing: false,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/FR/FR012.png',
    locales: {
      zh: {
        name: '法式奶酪',
        desc: ['在3个你选择的不同行动格上各放置1份食物，下一个使用这些行动格的玩家获得这份食物'],
        prerequisite: '职业×2',
      },
    },
  },
})
