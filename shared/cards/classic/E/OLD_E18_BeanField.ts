import { defineMinorCard } from '../../card-source'
import { makeCardFieldImpl } from '../../helpers/card-field'
const CARD_ID = 'OLD_E18_BeanField'
const cardImpl = makeCardFieldImpl(CARD_ID, {
  allowedCrops: ['vegetable'],
  capacity: 1,
})
export const OLD_E18_BeanField = defineMinorCard({
  meta: {
    id: 'OLD_E18_BeanField',
    name: '豆田',
    deck: 'E',
    number: 18,
    category: 'CROP_PROVIDER',
    desc: ['此卡视为1块田地，但此卡只能种植蔬菜。'],
    cost: {
      food: 1,
    },
    vp: 1,
    prerequisite: '2 Occupations',
    occupationPrerequisites: {
      min: 2,
    },
    isField: true,
    cardField: {
      allowedCrops: ['vegetable'],
      capacity: 1,
    },
    originalId: 'E18_BeanField',
    gameEdition: 'classic',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E18.png',
    locales: {
      zh: {
        name: '豆田',
        desc: ['此卡视为1块田地，但此卡只能种植蔬菜。'],
        prerequisite: '职业×2',
      },
    },
  },
  presentation: { cardFields: true },
  impl: cardImpl,
})
export const OLD_E18_BeanField_impl = OLD_E18_BeanField.impl
