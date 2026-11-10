import { defineMinorCard } from '../../card-source'
import { classicPlow } from '../../helpers/classic-plow'

const CARD_ID = 'OLD_K119_CrookedPlough'

const cardImpl = classicPlow(CARD_ID, 1, 2, ['farmland'])

export const OLD_K119_CrookedPlough = defineMinorCard({
  meta: {
    id: 'OLD_K119_CrookedPlough',
    originalId: 'K119_CrookedPlough',
    gameEdition: 'classic',
    name: '钩状犁',
    deck: 'K',
    number: 119,
    desc: [
      '在此卡上放2个田地板块。限1次：每当你使用犁田行动格时，你可以使用此卡上2块田，改为犁3块田。每次使用犁田/粮食耕种[犁播]行动格时，只能使用1个犁/I68耙的效果。',
    ],
    cost: {
      wood: 3,
    },
    vp: 0,
    prerequisite: '1 Occupations',
    occupationPrerequisites: {
      min: 1,
    },
    passing: false,
    extraVp: false,
    implemented: true,
    plowEffect: true,
    artUrl: '/assets/classic/K/K119.png',
  }, presentation: { stack: true },
  impl: cardImpl,
})

export const OLD_K119_CrookedPlough_impl = OLD_K119_CrookedPlough.impl
