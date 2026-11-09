// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
import type { ActionFlow } from '../../../contract/types'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_NL005_Studio'

const cardImpl = {
  effect: {
    id: CARD_ID,
    onHarvestFeedingPhase: (_state, _player) => {
      const children: ActionFlow[] = [
        {
          type: 'seq',
          children: [
            { type: 'leaf', actionId: 'pay', params: { wood: 1 }, sourceCard: CARD_ID },
            { type: 'leaf', actionId: 'gain', params: { food: 2 }, sourceCard: CARD_ID },
          ],
        },
        {
          type: 'seq',
          children: [
            { type: 'leaf', actionId: 'pay', params: { clay: 1 }, sourceCard: CARD_ID },
            { type: 'leaf', actionId: 'gain', params: { food: 2 }, sourceCard: CARD_ID },
          ],
        },
        {
          type: 'seq',
          children: [
            { type: 'leaf', actionId: 'pay', params: { stone: 1 }, sourceCard: CARD_ID },
            { type: 'leaf', actionId: 'gain', params: { food: 3 }, sourceCard: CARD_ID },
          ],
        },
      ]

      return {
        type: 'xor',
        optional: true,
        children,
      }
    },
  },
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_NL005_Studio = defineMinorCard({
  meta: {
    id: 'OLD_NL005_Studio',
    name: '工作室',
    deck: 'NL',
    number: 5,
    category: 'FOOD_PROVIDER',
    desc: [
      '每个喂养阶段，你可以使用此卡将至多1个资源转化成食物。每个木头/砖头能转换成2食物，每个石头能转换成3食物',
    ],
    vp: 1,
    cost: {
      clay: 1,
      reed: 1,
    },
    waresSalesmanGains: [
      {
        wood: 1,
        reed: 1,
      },
      {
        clay: 1,
        reed: 1,
      },
      {
        stone: 1,
        reed: 1,
      },
    ],
    originalId: 'NL005_Studio',
    gameEdition: 'classic',
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/NL/NL005.png',
    locales: {
      zh: {
        name: '工作室',
        desc: [
          '每个喂养阶段，你可以使用此卡将至多1个资源转化成食物。每个木头/砖头能转换成2食物，每个石头能转换成3食物',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_NL005_Studio_impl = OLD_NL005_Studio.impl
