import { defineMinorCard } from '../../card-source'
import { makeCardFieldImpl } from '../../helpers/card-field'

const CARD_ID = 'OLD_K105_Acreage'

const cardImpl = makeCardFieldImpl(CARD_ID, {
  allowedCrops: ['grain'],
  capacity: 2,
  separateFields: true,
})

export const OLD_K105_Acreage = defineMinorCard({
  meta: {
    id: 'OLD_K105_Acreage',
    originalId: 'K105_Acreage',
    gameEdition: 'classic',
    name: '一亩田',
    deck: 'K',
    number: 105,
    desc: ['每次播种时，你可以在此卡上播种至多2列小麦。(视作“2块麦田”)'],
    cost: {},
    vp: 0,
    prerequisite: '1 Occupations',
    occupationPrerequisites: {
      min: 1,
    },
    passing: false,
    extraVp: false,
    implemented: true,
    isField: true,
    cardField: { allowedCrops: ['grain'], capacity: 2, separateFields: true },
    artUrl: '/assets/classic/K/K105.png',
    locales: {
      zh: {
        name: '一亩田',
        desc: ['每次播种时，你可以在此卡上播种至多2列小麦。(视作“2块麦田”)'],
        prerequisite: '职业×1',
      },
    },
  }, presentation: { cardFields: true },
  impl: cardImpl,
})

export const OLD_K105_Acreage_impl = OLD_K105_Acreage.impl
