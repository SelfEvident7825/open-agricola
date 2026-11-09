// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_FL010_StuckCart = defineMinorCard({
  meta: {
    id: 'OLD_FL010_StuckCart',
    originalId: 'FL010_StuckCart',
    gameEdition: 'classic',
    name: '停靠的马车',
    deck: 'FL',
    number: 10,
    desc: ['立即派遣你剩下的所有家庭成员使用后请将此卡交给下家，此卡将加入他的手牌。'],
    cost: {
      wood: 1,
    },
    vp: 1,
    prerequisite: '已放置家庭成员×2',
    passing: true,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/FL/FL010.png',
    locales: {
      zh: {
        name: '停靠的马车',
        desc: ['立即派遣你剩下的所有家庭成员使用后请将此卡交给下家，此卡将加入他的手牌。'],
        prerequisite: '已放置家庭成员×2',
      },
    },
  },
})
