// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_WM061_BackDoor = defineMinorCard({
  meta: {
    id: 'OLD_WM061_BackDoor',
    originalId: 'WM061_BackDoor',
    gameEdition: 'classic',
    name: '后门',
    deck: 'WM',
    number: 61,
    desc: [
      '立即派遣另一名家庭成员使用生儿育女(并打出1张次发卡)行动格，即使该格已被占用。使用后请将此卡交给下家，此卡将加入他的手牌。',
    ],
    cost: {
      reed: 1,
    },
    vp: 1,
    prerequisite: '第2季生儿育女已翻出',
    passing: true,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/WM/WM061.png',
    locales: {
      zh: {
        name: '后门',
        desc: [
          '立即派遣另一名家庭成员使用生儿育女(并打出1张次发卡)行动格，即使该格已被占用。使用后请将此卡交给下家，此卡将加入他的手牌。',
        ],
        prerequisite: '第2季生儿育女已翻出',
      },
    },
  },
})
