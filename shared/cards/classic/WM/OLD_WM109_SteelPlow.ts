// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_WM109_SteelPlow = defineMinorCard({
  meta: {
    id: 'OLD_WM109_SteelPlow',
    originalId: 'WM109_SteelPlow',
    gameEdition: 'classic',
    name: '金钢犁',
    deck: 'WM',
    number: 109,
    desc: [
      '限1次：在你使用犁田/粮食耕种[犁播]行动格时，可以改为犁至多4块田每次使用犁田/粮食耕种[犁播]行动格时，只能使用1个犁/I68耙的效果。',
    ],
    cost: {
      stone: 3,
    },
    vp: 2,
    prerequisite: '3 Occupations',
    occupationPrerequisites: {
      min: 3,
    },
    passing: false,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/WM/WM109.png',
  },
})
