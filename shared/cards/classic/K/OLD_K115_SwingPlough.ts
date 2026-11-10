import { defineMinorCard } from '../../card-source'
import { classicPlow } from '../../helpers/classic-plow'

const CARD_ID = 'OLD_K115_SwingPlough'

const cardImpl = classicPlow(CARD_ID, 2, 2, ['farmland'])

export const OLD_K115_SwingPlough = defineMinorCard({
  meta: {
    id: 'OLD_K115_SwingPlough',
    name: '摆杆步犁',
    deck: 'K',
    number: 115,
    category: 'FARM_PLANNER',
    desc: [
      '在此卡上放4个田地板块。限2次：每当你使用犁田行动格时，你可以使用此卡上2块田，改为犁3块田。每次使用犁田/粮食耕种[犁播]行动格时，只能使用1个犁/I68耙的效果。',
    ],
    cost: {
      wood: 3,
    },
    prerequisite: '3 Occupations',
    occupationPrerequisites: {
      min: 3,
    },
    originalId: 'K115_SwingPlough',
    gameEdition: 'classic',
    vp: 0,
    passing: false,
    extraVp: false,
    implemented: true,
    plowEffect: true,
    artUrl: '/assets/classic/K/K115.png',
  },
  presentation: { stack: true },
  impl: cardImpl,
})

export const OLD_K115_SwingPlough_impl = OLD_K115_SwingPlough.impl
