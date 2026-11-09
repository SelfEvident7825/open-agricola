// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_FL022_CornMaze = defineMinorCard({
  meta: {
    id: 'OLD_FL022_CornMaze',
    originalId: 'FL022_CornMaze',
    gameEdition: 'classic',
    name: '麦田迷宫',
    deck: 'FL',
    number: 22,
    desc: ['每回合开始时，如果你有2×2布置的麦田，你获得1根木头+1捆芦苇。'],
    cost: {
      food: 1,
    },
    vp: 0,
    prerequisite: '2 Grain Fields',
    passing: false,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/FL/FL022.png',
    locales: {
      zh: {
        name: '麦田迷宫',
        desc: ['每回合开始时，如果你有2×2布置的麦田，你获得1根木头+1捆芦苇。'],
        prerequisite: '麦田×2',
      },
    },
  },
})
