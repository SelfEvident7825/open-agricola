import { defineOccupationCard } from '../../card-source'
export const OLD_E171_DockWorker = defineOccupationCard({
  meta: {
    id: 'OLD_E171_DockWorker',
    originalId: 'E171_DockWorker',
    gameEdition: 'classic',
    name: '码头工人',
    deck: 'E',
    number: 171,
    desc: [
      '任意时刻，你可以将3根木头转化为1砖/1芦苇/1石头，或者将2砖/2芦苇/2石头转化为1个其他建筑资源。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E171.png',
    exchanges: [
      {
        from: {
          wood: 3,
        },
        to: {
          clay: 1,
        },
        triggers: ['anytime'],
      },
      {
        from: {
          wood: 3,
        },
        to: {
          reed: 1,
        },
        triggers: ['anytime'],
      },
      {
        from: {
          wood: 3,
        },
        to: {
          stone: 1,
        },
        triggers: ['anytime'],
      },
      {
        from: {
          clay: 2,
        },
        to: {
          wood: 1,
        },
        triggers: ['anytime'],
      },
      {
        from: {
          clay: 2,
        },
        to: {
          reed: 1,
        },
        triggers: ['anytime'],
      },
      {
        from: {
          clay: 2,
        },
        to: {
          stone: 1,
        },
        triggers: ['anytime'],
      },
      {
        from: {
          reed: 2,
        },
        to: {
          wood: 1,
        },
        triggers: ['anytime'],
      },
      {
        from: {
          reed: 2,
        },
        to: {
          clay: 1,
        },
        triggers: ['anytime'],
      },
      {
        from: {
          reed: 2,
        },
        to: {
          stone: 1,
        },
        triggers: ['anytime'],
      },
      {
        from: {
          stone: 2,
        },
        to: {
          wood: 1,
        },
        triggers: ['anytime'],
      },
      {
        from: {
          stone: 2,
        },
        to: {
          clay: 1,
        },
        triggers: ['anytime'],
      },
      {
        from: {
          stone: 2,
        },
        to: {
          reed: 1,
        },
        triggers: ['anytime'],
      },
    ],
  },
})
