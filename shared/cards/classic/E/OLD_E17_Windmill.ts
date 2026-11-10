import { defineMinorCard } from '../../card-source'
export const OLD_E17_Windmill = defineMinorCard({
  meta: {
    id: 'OLD_E17_Windmill',
    originalId: 'E17_Windmill',
    gameEdition: 'classic',
    name: '风车磨坊',
    deck: 'E',
    number: 17,
    desc: ['任意时刻，你可以将1份小麦转换成2份食物。(这不属于“烤面包”行动)'],
    cost: {
      wood: 3,
      stone: 1,
    },
    vp: 2,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E17.png',
    exchanges: [
      {
        from: {
          grain: 1,
        },
        to: {
          food: 2,
        },
        triggers: ['anytime'],
      },
    ],
  },
})
