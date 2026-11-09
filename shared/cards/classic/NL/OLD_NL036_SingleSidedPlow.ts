// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_NL036_SingleSidedPlow = defineMinorCard({
  meta: {
    id: 'OLD_NL036_SingleSidedPlow',
    originalId: 'NL036_SingleSidedPlow',
    gameEdition: 'classic',
    name: '单面犁',
    deck: 'NL',
    number: 36,
    desc: [
      '放置1块田在此卡上，每当你使用犁田行动格时，你可以用此卡上的田地来额外犁1块田，若如此做，你可以立即在这个田上播种蔬菜',
    ],
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
    artUrl: '/assets/classic/NL/NL036.png',
    locales: {
      zh: {
        name: '单面犁',
        desc: [
          '放置1块田在此卡上，每当你使用犁田行动格时，你可以用此卡上的田地来额外犁1块田，若如此做，你可以立即在这个田上播种蔬菜',
        ],
        prerequisite: '职业×2',
      },
    },
  },
})
