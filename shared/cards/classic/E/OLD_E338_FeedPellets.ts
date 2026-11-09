import { defineMinorCard } from '../../card-source'
import { payLeaf, gainLeaf } from '../../helpers/pay-gain-node'
import type { ActionFlow } from '../../../contract/types'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E338_FeedPellets'
const ANIMAL_TYPES = ['sheep', 'boar', 'cattle'] as const
const cardImpl = {
  effect: {
    id: CARD_ID,
    onHarvestFeedingPhase: (_state, player) => {
      if (player.resources.vegetable < 1) return
      const ownedTypes = ANIMAL_TYPES.filter((t) => player.resources[t] > 0)
      if (ownedTypes.length === 0) return
      const children: ActionFlow[] = ownedTypes.map((type) => ({
        type: 'seq' as const,
        children: [
          payLeaf({
            cardId: CARD_ID,
            cost: { vegetable: 1 },
          }),
          gainLeaf(CARD_ID, { [type]: 1 }),
        ],
      }))
      if (children.length === 1) {
        return {
          ...children[0]!,
          optional: true,
        } as ActionFlow
      }
      return {
        type: 'xor',
        optional: true,
        children,
      } as ActionFlow
    },
  },
  reaches: [] as readonly string[],
} satisfies CardImpl
export const OLD_E338_FeedPellets = defineMinorCard({
  meta: {
    id: 'OLD_E338_FeedPellets',
    name: '饲料颗粒',
    deck: 'E',
    number: 338,
    category: 'LIVESTOCK_PROVIDER',
    desc: ['每个丰收时节的喂养阶段，你可以支付1份蔬菜，获得至多1只你已有的动物。'],
    cost: {},
    originalId: 'E338_FeedPellets',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E338.png',
    locales: {
      zh: {
        name: '饲料颗粒',
        desc: ['每个丰收时节的喂养阶段，你可以支付1份蔬菜，获得至多1只你已有的动物。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E338_FeedPellets_impl = OLD_E338_FeedPellets.impl
