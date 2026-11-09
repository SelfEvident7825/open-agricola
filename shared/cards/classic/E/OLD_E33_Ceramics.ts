import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { isMajorImprovementAvailable } from '../../major/supply'
import { gainLeaf } from '../../helpers/pay-gain-node'
import { getCardDefinition } from '../../catalog'
const CARD_ID = 'OLD_E33_Ceramics'
const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: () => gainLeaf(CARD_ID, { food: 2 }),
  },
  prerequisiteCheck: (player) =>
    [...player.improvements, ...player.minorPlayed].some(
      (id) => getCardDefinition(id)?.ovenIdentity,
    ),
  listeners: [
    {
      id: CARD_ID + '-minor-major',
      cardIds: [CARD_ID],
      actions: ['improvement'],
      phases: ['computeChoiceCandidates'],
      handler: ({ state }) => ({
        sourceCard: CARD_ID,
        extraOptions: ['Major_Pottery']
          .filter((id) => isMajorImprovementAvailable(state, id))
          .map((id) => ({
            value: id,
            labelKey: 'improvements.' + id + '.name',
            sourceCard: CARD_ID,
          })),
      }),
    },
    {
      id: CARD_ID + '-cost',
      cardIds: [CARD_ID],
      actions: ['improvement'],
      phases: ['computeCosts'],
      deriveCardCostCandidate: (context, candidate) => {
        if (
          !['Major_Pottery'].includes(context.cardId ?? '') ||
          candidate.sources.includes(CARD_ID)
        )
          return null
        return {
          resources: {},
          originalFeeIndex: candidate.originalFeeIndex,
          sources: [CARD_ID],
        }
      },
    },
  ],
} satisfies CardImpl
export const OLD_E33_Ceramics = defineMinorCard({
  meta: {
    id: 'OLD_E33_Ceramics',
    originalId: 'E33_Ceramics',
    gameEdition: 'classic',
    name: '陶器',
    deck: 'E',
    number: 33,
    desc: ['打出此卡时，你获得2份食物。从现在起，A8陶艺工坊对你来说是一张免费的次要发展卡。'],
    cost: {
      clay: 1,
    },
    vp: 0,
    prerequisite: '烤炉×1',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E33.png',
    locales: {
      zh: {
        name: '陶器',
        desc: ['打出此卡时，你获得2份食物。从现在起，A8陶艺工坊对你来说是一张免费的次要发展卡。'],
        prerequisite: '烤炉×1',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E33_Ceramics_impl = OLD_E33_Ceramics.impl
