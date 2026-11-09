// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_FL029_BirdTrap = defineMinorCard({
  meta: {
    id: 'OLD_FL029_BirdTrap',
    originalId: 'FL029_BirdTrap',
    gameEdition: 'classic',
    name: '捕鸟器',
    deck: 'FL',
    number: 29,
    desc: ['每个丰收时节的收割阶段，你获得1份食物，并且可以从至多1块田上额外收割至多1份作物'],
    cost: {
      wood: 2,
    },
    vp: 0,
    prerequisite: '1 Grain Fields',
    passing: false,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/FL/FL029.png',
    locales: {
      zh: {
        name: '捕鸟器',
        desc: ['每个丰收时节的收割阶段，你获得1份食物，并且可以从至多1块田上额外收割至多1份作物'],
        prerequisite: '麦田×1',
      },
    },
  },
})
