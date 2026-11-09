import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'

const cardImpl = {} satisfies CardImpl
export const OLD_I256_StoneCarver = defineOccupationCard({
  meta: {
    id: 'OLD_I256_StoneCarver',
    originalId: 'I256_StoneCarver',
    gameEdition: 'classic',
    name: '石雕工',
    deck: 'I',
    number: 256,
    desc: ['每个丰收时节，你可以将至多1个石头换成3份食物。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I256.png',
    locales: {
      zh: {
        name: '石雕工',
        desc: ['每个丰收时节，你可以将至多1个石头换成3份食物。'],
        prerequisite: '',
      },
    },
    exchanges: [
      {
        from: {
          stone: 1,
        },
        to: {
          food: 3,
        },
        triggers: ['harvest'],
        max: 1,
      },
    ],
  },
  impl: cardImpl,
})
export const OLD_I256_StoneCarver_impl = OLD_I256_StoneCarver.impl
