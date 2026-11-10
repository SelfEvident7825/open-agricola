import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { scheduleOffersNode } from '../../../actions/effects/internal/schedule-offers'
import { getDueScheduledOffers, scheduledOffersRoundStartFlow, type ScheduledOffer } from '../../../actions/effects/internal/scheduled-offers'

const CARD_ID = 'OLD_K305_AnimalHandler'
const cardImpl = {
  effect: {
    id: CARD_ID,
    stageEligibility: {
      onRoundStart: (state, player) => getDueScheduledOffers(state, player, CARD_ID).length > 0,
    },
    onBuy: state => {
      const entries = [
        { round: 7, animal: 'sheep' },
        { round: 10, animal: 'boar' },
        { round: 14, animal: 'cattle' },
      ] as const
      const offers: ScheduledOffer[] = entries
        .filter(entry => entry.round > state.round)
        .map(entry => ({
          id: CARD_ID + '-' + entry.round,
          kind: 'animal-purchase',
          dueRound: entry.round,
          animal: entry.animal,
          cost: { food: 1 },
          consumed: false,
        }))
      return offers.length ? scheduleOffersNode(CARD_ID, offers) : undefined
    },
    onRoundStart: (state, player) => scheduledOffersRoundStartFlow(state, player, CARD_ID),
  },
} satisfies CardImpl

export const OLD_K305_AnimalHandler = defineOccupationCard({
  meta: {
    id: 'OLD_K305_AnimalHandler',
    originalId: 'K305_AnimalHandler',
    gameEdition: 'classic',
    name: '动物驯养员',
    deck: 'K',
    number: 305,
    desc: [
      '在第7、10、14回合的行动格上依次放置1只羊、1只猪和1头牛。这些回合开始时，你可以支付1份食物购买对应的动物。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '3+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K305.png',
  },
  impl: cardImpl,
})

export const OLD_K305_AnimalHandler_impl = OLD_K305_AnimalHandler.impl
