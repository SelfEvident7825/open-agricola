// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_WM112_VillageSchool = defineMinorCard({
  meta: {
    id: 'OLD_WM112_VillageSchool',
    originalId: 'WM112_VillageSchool',
    gameEdition: 'classic',
    name: '乡村学校',
    deck: 'WM',
    number: 112,
    desc: ['每轮次限1次：每当你需要支付费用时，你可以弃掉你1张手牌来少支付1个建筑资源'],
    cost: {
      wood: 2,
    },
    vp: 0,
    prerequisite: '1 Occupations',
    occupationPrerequisites: {
      min: 1,
    },
    passing: false,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/WM/WM112.png',
    locales: {
      zh: {
        name: '乡村学校',
        desc: ['每轮次限1次：每当你需要支付费用时，你可以弃掉你1张手牌来少支付1个建筑资源'],
        prerequisite: '职业×1',
      },
    },
  },
})
