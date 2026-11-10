import { defineMinorCard } from '../../card-source'
import { scheduleOffersNode } from '../../../actions/effects/internal/schedule-offers'
import {
  getDueScheduledOffers,
  scheduledOffersRoundStartFlow,
  type ScheduledOffer,
} from '../../../actions/effects/internal/scheduled-offers'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K117_Greenhouse'

const cardImpl = {
  effect: {
    id: CARD_ID,
    stageEligibility: {
      onRoundStart: (state, player) => getDueScheduledOffers(state, player, CARD_ID).length > 0,
    },
    onBuy: (state) => {
      const offsets = [4, 7]
      const targetRounds = offsets.map((offset) => state.round + offset).filter((r) => r <= 14)
      if (targetRounds.length === 0) return
      const offers: ScheduledOffer[] = targetRounds.map((round) => ({
        id: `${CARD_ID}-${round}`,
        kind: 'resource-purchase',
        dueRound: round,
        resources: { vegetable: 1 },
        cost: { food: 1 },
        consumed: false,
      }))
      return scheduleOffersNode(CARD_ID, offers)
    },
    onRoundStart: (state, player) => scheduledOffersRoundStartFlow(state, player, CARD_ID),
  },
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_K117_Greenhouse = defineMinorCard({
  meta: {
    id: 'OLD_K117_Greenhouse',
    name: '小型温室',
    deck: 'K',
    number: 117,
    category: 'CROP_PROVIDER',
    desc: [
      '打出此卡时，将当前回合数加4和7，在对应回合行动格上各放1份蔬菜。这些回合开始时，你可支付1份食物，获得对应的蔬菜。',
    ],
    cost: {
      wood: 2,
    },
    vp: 1,
    prerequisite: '1 Occupations',
    occupationPrerequisites: {
      min: 1,
    },
    originalId: 'K117_Greenhouse',
    gameEdition: 'classic',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K117.png',
    locales: {
      zh: {
        name: '小型温室',
        desc: [
          '打出此卡时，将当前回合数加4和7，在对应回合行动格上各放1份蔬菜。这些回合开始时，你可支付1份食物，获得对应的蔬菜。',
        ],
        prerequisite: '职业×1',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_K117_Greenhouse_impl = OLD_K117_Greenhouse.impl
