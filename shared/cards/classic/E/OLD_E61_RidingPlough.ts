import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { classicPlow } from '../../helpers/classic-plow'
const CARD_ID = 'OLD_E61_RidingPlough'
const cardImpl = classicPlow(CARD_ID, 2) satisfies CardImpl
export const OLD_E61_RidingPlough = defineMinorCard({
  meta: {
    id: 'OLD_E61_RidingPlough',
    originalId: 'E61_RidingPlough',
    gameEdition: 'classic',
    name: '车犁',
    deck: 'E',
    number: 61,
    desc: [
      '在此卡上放4个田地板块。限2次：每当你使用犁田/粮食耕种[犁播]行动格时，你可以使用此卡上2块田，改为犁3块田。每次使用犁田/粮食耕种[犁播]行动格时，只能使用1个犁/I68耙的效果。',
    ],
    cost: {
      wood: 4,
    },
    vp: 0,
    prerequisite: '3 Occupations',
    occupationPrerequisites: {
      min: 3,
    },
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E61.png',
    plowEffect: true,
  },
  presentation: { stack: true },
  impl: cardImpl,
})
export const OLD_E61_RidingPlough_impl = OLD_E61_RidingPlough.impl
