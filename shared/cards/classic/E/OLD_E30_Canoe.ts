import { defineMinorCard } from '../../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../../card-listeners'
import type { ActionHookResult } from '../../../actions/hooks'
import { gainLeaf } from '../../helpers/pay-gain-node'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E30_Canoe'
const listener: CardListenerRegistration = {
  id: 'OLD_E30_Canoe-canoe-before-place-farmer',
  cardIds: [CARD_ID],
  phases: ['before'],
  actionSpaces: 'all',
  handler: (context: CardListenerContext): ActionHookResult | void => {
    if (!context.space || context.space.id !== 'fishing') return
    return {
      flow: gainLeaf(CARD_ID, {
        reed: 1,
        food: 1,
      }),
      sourceCard: CARD_ID,
    }
  },
}
const cardImpl = {
  listeners: [listener],
  reaches: [] as readonly string[],
} satisfies CardImpl
export const OLD_E30_Canoe = defineMinorCard({
  meta: {
    id: 'OLD_E30_Canoe',
    name: '独木舟',
    deck: 'E',
    number: 30,
    category: 'BUILDING_RESOURCE_PROVIDER',
    desc: ['每当你使用钓鱼积累行动格时，额外获得1份食物和1捆芦苇。'],
    cost: {
      wood: 2,
    },
    vp: 1,
    prerequisite: '2 Occupations',
    occupationPrerequisites: {
      min: 2,
    },
    originalId: 'E30_Canoe',
    gameEdition: 'classic',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E30.png',
    locales: {
      zh: {
        name: '独木舟',
        desc: ['每当你使用钓鱼积累行动格时，额外获得1份食物和1捆芦苇。'],
        prerequisite: '职业×2',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E30_Canoe_impl = OLD_E30_Canoe.impl
