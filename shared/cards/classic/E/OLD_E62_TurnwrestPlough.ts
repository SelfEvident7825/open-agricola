import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { classicPlow } from '../../helpers/classic-plow'
const CARD_ID = 'OLD_E62_TurnwrestPlough'
const cardImpl = classicPlow(CARD_ID, 1) satisfies CardImpl
export const OLD_E62_TurnwrestPlough = defineMinorCard({
  meta: {
    id: 'OLD_E62_TurnwrestPlough',
    name: '转犁',
    deck: 'E',
    number: 62,
    category: 'FARM_PLANNER',
    desc: [
      '在此卡上放2个田地板块。限1次：每当你使用犁田/粮食耕种[犁播]行动格时，你可以使用此卡上2块田，改为犁3块田。每次使用犁田/粮食耕种[犁播]行动格时，只能使用1个犁/I68耙的效果。',
    ],
    cost: {
      wood: 3,
    },
    prerequisite: '2 Occupations',
    occupationPrerequisites: {
      min: 2,
    },
    originalId: 'E62_TurnwrestPlough',
    gameEdition: 'classic',
    vp: 0,
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E62.png',
    locales: {
      zh: {
        name: '转犁',
        desc: [
          '在此卡上放2个田地板块。限1次：每当你使用犁田/粮食耕种[犁播]行动格时，你可以使用此卡上2块田，改为犁3块田。每次使用犁田/粮食耕种[犁播]行动格时，只能使用1个犁/I68耙的效果。',
        ],
        prerequisite: '职业×2',
      },
    },
    plowEffect: true,
  },
  presentation: { stack: true },
  impl: cardImpl,
})
export const OLD_E62_TurnwrestPlough_impl = OLD_E62_TurnwrestPlough.impl
