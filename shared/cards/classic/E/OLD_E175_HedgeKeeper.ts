import { defineOccupationCard } from '../../card-source'
import type { TradeModifier } from '../../../contract/types'
import type { CardImpl } from '../../registry'
/** Up to 3× "pay 0 to cover 1 wood" fence units. */
export const OLD_E175_HedgeKeeper = defineOccupationCard({
  meta: {
    id: 'OLD_E175_HedgeKeeper',
    name: '篱笆护理员',
    deck: 'E',
    number: 175,
    category: 'FARM_PLANNER',
    desc: ['每当你建造了至少1根栅栏时，可以额外免费建造3根栅栏。'],
    cost: {},
    players: '3+',
    originalId: 'E175_HedgeKeeper',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E175.png',
  },
  impl: {
    modifiers: [
      {
        type: 'trade',
        cardId: 'OLD_E175_HedgeKeeper',
        appliesTo: ['fencing'],
        from: {},
        to: { wood: 1 },
        max: 3,
      } as TradeModifier,
    ],
  } satisfies CardImpl,
})
export const OLD_E175_HedgeKeeper_impl = OLD_E175_HedgeKeeper.impl
