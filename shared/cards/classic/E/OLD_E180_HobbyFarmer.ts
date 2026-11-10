import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { gainLeaf } from '../../helpers/pay-gain-node'
const CARD_ID = 'OLD_E180_HobbyFarmer'
const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: () => ({
      type: 'seq',
      children: [
        gainLeaf(CARD_ID, { vegetable: 1 }),
        {
          type: 'leaf',
          actionId: 'sow',
          optional: true,
          sourceCard: CARD_ID,
          actionContext: {
            maxSelections: 1,
            maxSeedSelections: 1,
            allowedCrops: ['vegetable'],
          },
        },
      ],
    }),
  },
} satisfies CardImpl
export const OLD_E180_HobbyFarmer = defineOccupationCard({
  meta: {
    id: 'OLD_E180_HobbyFarmer',
    originalId: 'E180_HobbyFarmer',
    gameEdition: 'classic',
    name: '小园主',
    deck: 'E',
    number: 180,
    desc: ['打出此卡时，你获得1份蔬菜。并且你获得1次播种行动，但此次播种行动你只能播种这份蔬菜。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '4+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E180.png',
  },
  impl: cardImpl,
})
export const OLD_E180_HobbyFarmer_impl = OLD_E180_HobbyFarmer.impl
