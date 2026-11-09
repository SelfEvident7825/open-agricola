// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_WM099_PigWallow = defineMinorCard({
  meta: {
    id: 'OLD_WM099_PigWallow',
    originalId: 'WM099_PigWallow',
    gameEdition: 'classic',
    name: '退耕还牧',
    deck: 'WM',
    number: 99,
    desc: [
      '立即退还已犁的1个空田板块，并免费围建农场1个空地。（需满足围建栅栏的一般规则）使用后请将此卡交给下家，此卡将加入他的手牌。注: 此田地板块附加物品随之移除，例: NL014壕沟。',
    ],
    cost: {
      wood: 1,
      stone: 1,
    },
    vp: 1,
    prerequisite: '空田×1',
    passing: true,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/WM/WM099.png',
    locales: {
      zh: {
        name: '退耕还牧',
        desc: [
          '立即退还已犁的1个空田板块，并免费围建农场1个空地。（需满足围建栅栏的一般规则）使用后请将此卡交给下家，此卡将加入他的手牌。注: 此田地板块附加物品随之移除，例: NL014壕沟。',
        ],
        prerequisite: '空田×1',
      },
    },
  },
})
