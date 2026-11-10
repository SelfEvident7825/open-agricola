// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_G104_SeasonalPlants = defineMinorCard({
  meta: {
    id: 'OLD_G104_SeasonalPlants',
    originalId: 'G104_SeasonalPlants',
    gameEdition: 'classic',
    name: '季节性作物',
    deck: 'G',
    number: 104,
    desc: ['每当你在偶数回合执行“播种”行动时，在你刚播种的田上额外放置一份对应的资源'],
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
    artUrl: '/assets/classic/G/G104.png',
  },
})
