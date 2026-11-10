import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_I220_WellBuilder'

const cardImpl = {
  reaches: ['Major_Well'],
  listeners: [
    {
      id: CARD_ID + '-offer',
      cardIds: [CARD_ID],
      actions: ['improvement'],
      phases: ['computeChoiceCandidates'],
      handler: (context) =>
        context.state.availableMajorImprovements.includes('Major_Well')
          ? {
              extraOptions: [
                {
                  value: 'Major_Well',
                  labelKey: 'improvements.Major_Well.name',
                  sourceCard: CARD_ID,
                },
              ],
            }
          : undefined,
    },
    {
      id: CARD_ID + '-cost',
      cardIds: [CARD_ID],
      actions: ['improvement'],
      phases: ['computeCosts'],
      deriveCardCostCandidate: (context, candidate) =>
        context.cardId === 'Major_Well' && !candidate.sources.includes(CARD_ID)
          ? {
              resources: { wood: 1, stone: 1 },
              originalFeeIndex: candidate.originalFeeIndex,
              sources: [CARD_ID],
            }
          : null,
    },
  ],
} satisfies CardImpl
export const OLD_I220_WellBuilder = defineOccupationCard({
  meta: {
    id: 'OLD_I220_WellBuilder',
    originalId: 'I220_WellBuilder',
    gameEdition: 'classic',
    name: '打井人',
    deck: 'I',
    number: 220,
    desc: ['对你来说，A10水井是张次要发展卡，并且只花费1木头+1石头。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I220.png',
  },
  impl: cardImpl,
})
export const OLD_I220_WellBuilder_impl = OLD_I220_WellBuilder.impl
