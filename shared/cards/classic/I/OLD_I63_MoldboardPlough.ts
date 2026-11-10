import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { classicPlow } from '../../helpers/classic-plow'
const CARD_ID = 'OLD_I63_MoldboardPlough'

const cardImpl = classicPlow(CARD_ID, 2, 1, ['farmland']) satisfies CardImpl
export const OLD_I63_MoldboardPlough = defineMinorCard({
  meta: {
    id: 'OLD_I63_MoldboardPlough',
    name: '铧式犁',
    deck: 'I',
    number: 63,
    category: 'FARM_PLANNER',
    desc: [
      '在此卡上放2个田地板块。限2次：每当你使用犁田行动格时，你可以使用此卡上1块田，改为犁2块田。每次使用犁田/粮食耕种[犁播]行动格时，只能使用1个犁/I68耙的效果。',
    ],
    cost: {
      wood: 2,
    },
    prerequisite: '1 Occupations',
    occupationPrerequisites: {
      min: 1,
    },
    originalId: 'I63_MoldboardPlough',
    gameEdition: 'classic',
    vp: 0,
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I63.png',
    plowEffect: true,
  },
  impl: cardImpl,
})
export const OLD_I63_MoldboardPlough_impl = OLD_I63_MoldboardPlough.impl
