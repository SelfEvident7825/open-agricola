import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { getAssignedAnimalCount } from '../../../domain/animals'
import { harvestRounds } from '../../../contract/state-constants'
const CARD_ID = 'OLD_I92_Manure'

const cardImpl = {
  prerequisiteCheck: (player) => getAssignedAnimalCount(player) >= 2,
  effect: {
    id: CARD_ID,
    onRoundEnd: (state) =>
      harvestRounds.includes(state.round)
        ? undefined
        : {
            type: 'leaf',
            actionId: 'reap',
            sourceCard: CARD_ID,
            optional: true,
            actionContext: { trigger: { phase: 'private-field-phase' } },
          },
  },
} satisfies CardImpl
export const OLD_I92_Manure = defineMinorCard({
  meta: {
    id: 'OLD_I92_Manure',
    originalId: 'I92_Manure',
    gameEdition: 'classic',
    name: '肥料',
    deck: 'I',
    number: 92,
    desc: [
      '每个不以丰收时节为结束的回合结束时，你可以执行1次丰收时节的收割行动。此“收割行动”可触发以下卡牌：I86谷仓、I103水磨坊(只能自用)、I226园丁。此卡牌打出条件“动物×2”不包括卡牌动物。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '动物×2',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I92.png',
    locales: {
      zh: {
        name: '肥料',
        desc: [
          '每个不以丰收时节为结束的回合结束时，你可以执行1次丰收时节的收割行动。此“收割行动”可触发以下卡牌：I86谷仓、I103水磨坊(只能自用)、I226园丁。此卡牌打出条件“动物×2”不包括卡牌动物。',
        ],
        prerequisite: '动物×2',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_I92_Manure_impl = OLD_I92_Manure.impl
