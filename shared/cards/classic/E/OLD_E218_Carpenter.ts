import { defineOccupationCard } from '../../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../../card-listeners'
import type { ActionHookPhase, ActionHookResult } from '../../../actions/hooks'
import type { CardImpl } from '../../registry'
import { constructUnitDiscountTrade } from '../../helpers/construct-cost'
const CARD_ID = 'OLD_E218_Carpenter'
/**
 * B126 Carpenter — Every new room only costs 3 of the appropriate building resource
 * and 2 reed (instead of the standard 5+2).
 *
 * Reference: onPlayerComputeCostsConstruct calls Utils::addCost with [res => 3, REED => 2].
 */
const constructCostListener: CardListenerRegistration = {
  id: 'OLD_E218_Carpenter-carpenter-costs-construct',
  cardIds: [CARD_ID],
  phases: ['computeCosts' as ActionHookPhase],
  actions: ['construct'],
  handler: (context: CardListenerContext): ActionHookResult | void => {
    const houseType = context.player.houseType
    if (houseType === 'clay')
      return {
        trades: [
          {
            ...constructUnitDiscountTrade(CARD_ID, { clay: 2 }),
            groupId: 'classic-room-base',
            groupMax: 1,
            groupScope: 'unit',
          },
        ],
      }
    if (houseType === 'stone')
      return {
        trades: [
          {
            ...constructUnitDiscountTrade(CARD_ID, { stone: 2 }),
            groupId: 'classic-room-base',
            groupMax: 1,
            groupScope: 'unit',
          },
        ],
      }
    return {
      trades: [
        {
          ...constructUnitDiscountTrade(CARD_ID, { wood: 2 }),
          groupId: 'classic-room-base',
          groupMax: 1,
          groupScope: 'unit',
        },
      ],
    }
  },
}
const cardImpl = {
  listeners: [constructCostListener],
  reaches: [] as readonly string[],
} satisfies CardImpl
export const OLD_E218_Carpenter = defineOccupationCard({
  meta: {
    id: 'OLD_E218_Carpenter',
    name: '木匠',
    deck: 'E',
    number: 218,
    category: 'BUILDING_RESOURCE_PROVIDER',
    desc: [
      '你扩建每间房屋只需花费2捆芦苇和3份对应你房屋类型的建材。例如：扩建1间石屋只需2捆芦苇+3个石头。',
    ],
    cost: {},
    players: '1+',
    originalId: 'E218_Carpenter',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E218.png',
    locales: {
      zh: {
        name: '木匠',
        desc: [
          '你扩建每间房屋只需花费2捆芦苇和3份对应你房屋类型的建材。例如：扩建1间石屋只需2捆芦苇+3个石头。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E218_Carpenter_impl = OLD_E218_Carpenter.impl
