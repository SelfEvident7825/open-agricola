import { defineOccupationCard } from '../../card-source'
export const OLD_E154_MasterBrewer = defineOccupationCard({
  meta: {
    id: 'OLD_E154_MasterBrewer',
    name: '家庭酿酒师',
    deck: 'E',
    number: 154,
    category: 'FOOD_PROVIDER',
    desc: [
      '在每个丰收时节的喂养阶段时，你可用此卡将至多1份小麦转化成3份食物。（这不算作“烤面包”行动）',
    ],
    exchanges: [
      {
        from: { grain: 1 },
        to: { food: 3 },
        triggers: ['harvest'],
        max: 1,
      },
    ],
    cost: {},
    players: '1+',
    extraVp: false,
    originalId: 'E154_MasterBrewer',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    implemented: true,
    artUrl: '/assets/classic/E/E154.png',
  },
})
