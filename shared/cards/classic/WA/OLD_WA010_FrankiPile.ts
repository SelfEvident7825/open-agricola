// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_WA010_FrankiPile = defineMinorCard({
  meta: {
    id: 'OLD_WA010_FrankiPile',
    originalId: 'WA010_FrankiPile',
    gameEdition: 'classic',
    name: '弗兰基桩',
    deck: 'WA',
    number: 10,
    desc: [
      '从游戏供应区拿取石头放在任意数量的农场空格上各1个，这些空格仍视为未使用。你只能通过在这些格子扩建房屋来使用他们，如此做时，对于每间房屋你少花费1个任意建筑资源而且你获得上面的石头',
    ],
    cost: {},
    vp: 0,
    prerequisite: '2 Occupations',
    occupationPrerequisites: {
      min: 2,
    },
    passing: false,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/WA/WA010.png',
    locales: {
      zh: {
        name: '弗兰基桩',
        desc: [
          '从游戏供应区拿取石头放在任意数量的农场空格上各1个，这些空格仍视为未使用。你只能通过在这些格子扩建房屋来使用他们，如此做时，对于每间房屋你少花费1个任意建筑资源而且你获得上面的石头',
        ],
        prerequisite: '职业×2',
      },
    },
  },
})
