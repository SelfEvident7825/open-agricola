import { defineMinorCard } from '../../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../../card-listeners'
import type { ActionHookResult } from '../../../actions/hooks'
import { gainLeaf } from '../../helpers/pay-gain-node'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K131_ClayPit'
const listener: CardListenerRegistration = {
  id: 'OLD_K131_ClayPit-loam-pit-before-place-farmer',
  cardIds: [CARD_ID],
  phases: ['before'],
  actionSpaces: 'all',
  handler: (context: CardListenerContext): ActionHookResult | void => {
    if (context.space?.id !== 'day-laborer') return
    return { flow: gainLeaf(CARD_ID, { clay: 3 }), sourceCard: CARD_ID }
  },
}

const cardImpl = {
  listeners: [listener],
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_K131_ClayPit = defineMinorCard({
  meta: {
    id: 'OLD_K131_ClayPit',
    name: '黏土坑',
    deck: 'K',
    number: 131,
    category: 'BUILDING_RESOURCE_PROVIDER',
    desc: ['每当你使用临时工行动格时，额外获得3个砖头。'],
    vp: 1,
    cost: {},
    prerequisite: '3 Occupations',
    occupationPrerequisites: {
      min: 3,
    },
    originalId: 'K131_ClayPit',
    gameEdition: 'classic',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K131.png',
    locales: {
      zh: {
        name: '黏土坑',
        desc: ['每当你使用临时工行动格时，额外获得3个砖头。'],
        prerequisite: '职业×3',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_K131_ClayPit_impl = OLD_K131_ClayPit.impl
