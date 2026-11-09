import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { isMajorImprovementAvailable } from '../../major/supply'
const CARD_ID = 'OLD_E15_BakingTray'
const cardImpl = {
  reaches: ['OLD_E27_WoodredOven'] as readonly string[],
  listeners: [
    {
      id: CARD_ID + '-minor-major',
      cardIds: [CARD_ID],
      actions: ['improvement'],
      phases: ['computeChoiceCandidates'],
      handler: ({ state }) => ({
        sourceCard: CARD_ID,
        extraOptions: ['Major_ClayOven', 'Major_StoneOven']
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
          !['Major_ClayOven', 'Major_StoneOven', 'OLD_E27_WoodredOven'].includes(
            context.cardId ?? '',
          ) ||
          candidate.sources.includes(CARD_ID)
        )
          return null
        return (['wood', 'clay', 'reed', 'stone'] as const).flatMap((resource) =>
          (candidate.resources[resource] ?? 0) > 0
            ? [
                {
                  resources: {
                    ...candidate.resources,
                    [resource]: candidate.resources[resource]! - 1,
                  },
                  originalFeeIndex: candidate.originalFeeIndex,
                  sources: [CARD_ID],
                },
              ]
            : [],
        )
      },
    },
  ],
} satisfies CardImpl
export const OLD_E15_BakingTray = defineMinorCard({
  meta: {
    id: 'OLD_E15_BakingTray',
    originalId: 'E15_BakingTray',
    gameEdition: 'classic',
    name: '烤盘',
    deck: 'E',
    number: 15,
    desc: [
      'A5砖造烤炉和A6石造烤炉对你来说是次要发展卡。当你打出A5砖造烤炉、A6石造烤炉、E27木造烤炉时，可以减少任意1个建筑资源花费。',
    ],
    cost: {
      wood: 1,
    },
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E15.png',
    locales: {
      zh: {
        name: '烤盘',
        desc: [
          'A5砖造烤炉和A6石造烤炉对你来说是次要发展卡。当你打出A5砖造烤炉、A6石造烤炉、E27木造烤炉时，可以减少任意1个建筑资源花费。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E15_BakingTray_impl = OLD_E15_BakingTray.impl
