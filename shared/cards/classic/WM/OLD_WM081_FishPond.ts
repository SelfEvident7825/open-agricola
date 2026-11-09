// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_WM081_FishPond = defineMinorCard({
  meta: {
    id: 'OLD_WM081_FishPond',
    originalId: 'WM081_FishPond',
    gameEdition: 'classic',
    name: '鱼塘',
    deck: 'WM',
    number: 81,
    desc: [
      '将1个砖头（从游戏供应区拿取）放到你农场中的1个空格上，该格视为已使用。每当你使用钓鱼积累行动格时，你可以将此钓鱼行动格上食物中任意数量的食物放置到此卡上。游戏结束时，如果此卡上有至少0/1/4/6/8份食物，则你额外获得-1/1/2/3/4分。注：（1）若此卡因其他卡牌效果弃置/翻面/失去效果，则移除此砖并移除此卡上食物。（2）只能放置钓鱼积累行动格上原有食物。',
    ],
    cost: {
      wood: 1,
    },
    vp: 0,
    prerequisite: '空格×1',
    passing: false,
    extraVp: true,
    implemented: false,
    artUrl: '/assets/classic/WM/WM081.png',
    locales: {
      zh: {
        name: '鱼塘',
        desc: [
          '将1个砖头（从游戏供应区拿取）放到你农场中的1个空格上，该格视为已使用。每当你使用钓鱼积累行动格时，你可以将此钓鱼行动格上食物中任意数量的食物放置到此卡上。游戏结束时，如果此卡上有至少0/1/4/6/8份食物，则你额外获得-1/1/2/3/4分。注：（1）若此卡因其他卡牌效果弃置/翻面/失去效果，则移除此砖并移除此卡上食物。（2）只能放置钓鱼积累行动格上原有食物。',
        ],
        prerequisite: '空格×1',
      },
    },
  },
})
