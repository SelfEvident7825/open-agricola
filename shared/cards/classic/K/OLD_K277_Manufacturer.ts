import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { isMajorImprovementAvailable } from '../../major/supply'
import { PaymentSolver } from '../../../actions/payment'
import type { CardCostCandidate, Resource } from '../../../contract/types'

const CARD_ID = 'OLD_K277_Manufacturer'
const WORKSHOPS = ['Major_Joinery', 'Major_Pottery', 'Major_Basket']
const cardImpl = {
  listeners: [
    {
      id: CARD_ID + '-minor-workshops',
      cardIds: [CARD_ID],
      actions: ['improvement'],
      phases: ['computeChoiceCandidates'],
      handler: ({ state, player }) => {
        if (player.houseType === 'wood') return
        return {
          sourceCard: CARD_ID,
          extraOptions: WORKSHOPS
            .filter(id => isMajorImprovementAvailable(state, id))
            .map(id => ({ value: id, labelKey: 'improvements.' + id + '.name', sourceCard: CARD_ID })),
        }
      },
    },
    {
      id: CARD_ID + '-workshop-discount',
      cardIds: [CARD_ID],
      actions: ['improvement'],
      phases: ['computeCosts'],
      cardCostCandidateMandatory: true,
      deriveCardCostCandidate: ({ player, cardId }, candidate) => {
        if (
          player.houseType === 'wood' ||
          !WORKSHOPS.includes(cardId ?? '') ||
          candidate.sources.includes(CARD_ID)
        ) return null
        const keys = (Object.keys(candidate.resources) as (keyof Resource)[])
          .filter(key => (candidate.resources[key] ?? 0) > 0)
        const total = keys.reduce((sum, key) => sum + (candidate.resources[key] ?? 0), 0)
        const derived: CardCostCandidate[] = []
        for (const [index, first] of keys.entries()) {
          const seconds = total === 1 ? [first] : keys.slice(index)
          for (const second of seconds) {
            if (total > 1 && first === second && (candidate.resources[first] ?? 0) < 2) continue
            const discount = total === 1 ? { [first]: 1 }
              : first === second ? { [first]: 2 } : { [first]: 1, [second]: 1 }
            const next = PaymentSolver.discountCardCostCandidate(candidate, CARD_ID, discount)
            if (next) derived.push(next)
          }
        }
        return derived.length ? derived : null
      },
    },
  ],
} satisfies CardImpl

export const OLD_K277_Manufacturer = defineOccupationCard({
  meta: {
    id: 'OLD_K277_Manufacturer',
    originalId: 'K277_Manufacturer',
    gameEdition: 'classic',
    name: '制造商',
    deck: 'K',
    number: 277,
    desc: [
      '一旦你的房屋等级是砖屋/石屋，A7家具工坊、A8陶艺工坊、A9编筐工坊对你来说都是次要发展卡，而且所需花费减少两个任意资源。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K277.png',
    locales: {
      zh: {
        name: '制造商',
        desc: [
          '一旦你的房屋等级是砖屋/石屋，A7家具工坊、A8陶艺工坊、A9编筐工坊对你来说都是次要发展卡，而且所需花费减少两个任意资源。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
