// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_G101_Remodeling = defineMinorCard({
  meta: {
    id: 'OLD_G101_Remodeling',
    originalId: 'G101_Remodeling',
    gameEdition: 'classic',
    name: '木屋改建',
    deck: 'G',
    number: 101,
    desc: [
      '打出时你必须将农场中的一个马厩退还到个人供应区，然后免费扩建1间木屋使用后请将此卡交给下家，此卡将加入他的手牌。',
    ],
    cost: {
      reed: 1,
      wood: 1,
    },
    vp: 0,
    prerequisite: '马厩×1',
    passing: true,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/G/G101.png',
    locales: {
      zh: {
        name: '木屋改建',
        desc: [
          '打出时你必须将农场中的一个马厩退还到个人供应区，然后免费扩建1间木屋使用后请将此卡交给下家，此卡将加入他的手牌。',
        ],
        prerequisite: '马厩×1',
      },
    },
  },
})
