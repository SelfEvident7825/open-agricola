import { defineOccupationCard } from '../../card-source'
export const OLD_E148_Academic = defineOccupationCard({
  meta: {
    id: 'OLD_E148_Academic',
    originalId: 'E148_Academic',
    gameEdition: 'classic',
    name: '智者',
    deck: 'E',
    number: 148,
    desc: [
      '此卡对次要发展卡和职业卡(例：E217地方官)的需求、功能、数量和计分来说，算作2个职业，1张职业卡。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E148.png',
    occupationCount: 2,
  },
})
