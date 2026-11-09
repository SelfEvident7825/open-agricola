import { defineOccupationCard } from '../../card-source'
import { scheduleNextHarvestSkip } from '../../helpers/harvest-skip'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_I244_Layabout'

const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (_state, player) => {
      scheduleNextHarvestSkip(player, CARD_ID)
    },
  },
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_I244_Layabout = defineOccupationCard({
  meta: {
    id: 'OLD_I244_Layabout',
    originalId: 'I244_Layabout',
    gameEdition: 'classic',
    name: '懒汉',
    deck: 'I',
    number: 244,
    desc: [
      '打出此卡，你就不能参加下一个丰收时节。（你虽不用喂养家庭成员，但也不能收割作物或繁殖动物）',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I244.png',
    locales: {
      zh: {
        name: '懒汉',
        desc: [
          '打出此卡，你就不能参加下一个丰收时节。（你虽不用喂养家庭成员，但也不能收割作物或繁殖动物）',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_I244_Layabout_impl = OLD_I244_Layabout.impl
