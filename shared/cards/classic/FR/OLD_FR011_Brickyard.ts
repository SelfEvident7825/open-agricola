// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_FR011_Brickyard = defineMinorCard({
  meta: {
    id: 'OLD_FR011_Brickyard',
    originalId: 'FR011_Brickyard',
    gameEdition: 'classic',
    name: '砖厂',
    deck: 'FR',
    number: 11,
    desc: [
      '每回合开始前，如果你的个人供应区里没有砖头，则在此卡上补充1砖，每当此卡上有至少4块砖，你获得这些砖，你不能无故弃掉砖头。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '2 Occupations',
    occupationPrerequisites: {
      min: 2,
    },
    passing: false,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/FR/FR011.png',
  },
})
