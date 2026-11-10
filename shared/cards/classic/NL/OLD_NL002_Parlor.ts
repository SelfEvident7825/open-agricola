// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_NL002_Parlor = defineMinorCard({
  meta: {
    id: 'OLD_NL002_Parlor',
    originalId: 'NL002_Parlor',
    gameEdition: 'classic',
    name: '起居室',
    deck: 'NL',
    number: 2,
    desc: ['立即免费将一间房屋换成石屋(你无需再翻修此屋子，其他屋子不变，不改变你所住房子的等级)'],
    cost: {
      food: 1,
    },
    vp: 0,
    prerequisite: '2 Occupations',
    occupationPrerequisites: {
      min: 2,
    },
    passing: false,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/NL/NL002.png',
  },
})
