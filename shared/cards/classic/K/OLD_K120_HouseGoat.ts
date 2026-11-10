import { defineMinorCard } from '../../card-source'
import { gainLeaf } from '../../helpers/pay-gain-node'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K120_HouseGoat'

const cardImpl = {
  effect: {
    id: CARD_ID,
    onHarvestFeedingPhase: (_state, _player) => {
      return gainLeaf(CARD_ID, { food: 1 })
    },
  },
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_K120_HouseGoat = defineMinorCard({
  meta: {
    id: 'OLD_K120_HouseGoat',
    name: '家用山羊',
    deck: 'K',
    number: 120,
    category: 'FARM_PLANNER',
    desc: [
      '每个丰收时节的喂养阶段，你额外获得1份食物。无论如何，你的房子不能再容纳动物了。即使有卡牌允许你这样做，例：K306驯兽师。',
    ],
    cost: {},
    vp: 1,
    blocksHouseAnimalZones: true,
    originalId: 'K120_HouseGoat',
    gameEdition: 'classic',
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K120.png',
    locales: {
      zh: {
        name: '家用山羊',
        desc: [
          '每个丰收时节的喂养阶段，你额外获得1份食物。无论如何，你的房子不能再容纳动物了。即使有卡牌允许你这样做，例：K306驯兽师。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_K120_HouseGoat_impl = OLD_K120_HouseGoat.impl
