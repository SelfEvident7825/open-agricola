// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_NL006_Backyard = defineMinorCard({
  meta: {
    id: 'OLD_NL006_Backyard',
    originalId: 'NL006_Backyard',
    gameEdition: 'classic',
    name: '后院',
    deck: 'NL',
    number: 6,
    desc: [
      '如果你的农场有2×2的空地且其中一个与房屋正交相邻，则这块空地可以容纳一名家庭成员。一旦其中一格被占用，你需要将该家庭成员移入空房间或个人供应区',
    ],
    cost: {
      reed: 1,
    },
    vp: 1,
    prerequisite: '2 Occupations',
    occupationPrerequisites: {
      min: 2,
    },
    passing: false,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/NL/NL006.png',
  },
})
