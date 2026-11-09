// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_G080_HarvestFeast = defineMinorCard({
  meta: {
    id: 'OLD_G080_HarvestFeast',
    originalId: 'G080_HarvestFeast',
    gameEdition: 'classic',
    name: '秋收盛宴',
    deck: 'G',
    number: 80,
    desc: ['打出时，所有人家都可以将各自田地里的任意数量作物移入各自的个人供应区(不算作收割阶段)'],
    cost: {},
    vp: 2,
    prerequisite: '3 Occupations',
    occupationPrerequisites: {
      min: 3,
    },
    passing: false,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/G/G080.png',
    locales: {
      zh: {
        name: '秋收盛宴',
        desc: [
          '打出时，所有人家都可以将各自田地里的任意数量作物移入各自的个人供应区(不算作收割阶段)',
        ],
        prerequisite: '职业×3',
      },
    },
  },
})
