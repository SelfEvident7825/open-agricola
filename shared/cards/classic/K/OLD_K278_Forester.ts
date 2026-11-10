import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { makeCardFieldImpl } from '../../helpers/card-field'

const CARD_ID = 'OLD_K278_Forester'
const cardImpl = makeCardFieldImpl(CARD_ID, { allowedCrops: ['wood'], capacity: 3 }) satisfies CardImpl
export const OLD_K278_Forester = defineOccupationCard({
  meta: {
    id: 'OLD_K278_Forester',
    originalId: 'K278_Forester',
    gameEdition: 'classic',
    name: '护林人',
    deck: 'K',
    number: 278,
    desc: [
      '你可以在此卡上播种3列木头。木头的播种和收割遵循小麦的一般规则。（不能被K286小农种植额外木头。此卡上未收割的木头不算作你的资源，不计算任何职业和发展卡分数。',
    ],
    isField: true,
    cardField: { allowedCrops: ['wood'], capacity: 3 },
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K278.png',
  },
  impl: cardImpl,
})
