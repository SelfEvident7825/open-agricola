import { defineOccupationCard } from '../../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../../card-listeners'
import type { ActionHookResult } from '../../../actions/hooks'
import { gainLeaf } from '../../helpers/pay-gain-node'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E168_Greengrocer'
const listener: CardListenerRegistration = {
  id: 'OLD_E168_Greengrocer-greengrocer-before-place-farmer',
  cardIds: [CARD_ID],
  phases: ['before'],
  actionSpaces: 'all',
  handler: (context: CardListenerContext): ActionHookResult | void => {
    if (context.space?.id !== 'grain-seeds') return
    return {
      flow: gainLeaf(CARD_ID, { vegetable: 1 }),
      sourceCard: CARD_ID,
    }
  },
}
const cardImpl = {
  listeners: [listener],
  reaches: [] as readonly string[],
} satisfies CardImpl
export const OLD_E168_Greengrocer = defineOccupationCard({
  meta: {
    id: 'OLD_E168_Greengrocer',
    name: '蔬菜商',
    deck: 'E',
    number: 168,
    category: 'CROP_PROVIDER',
    desc: ['每当你使用小麦种子行动格时，额外获得1份蔬菜。'],
    cost: {},
    players: '1+',
    originalId: 'E168_Greengrocer',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E168.png',
    locales: {
      zh: {
        name: '蔬菜商',
        desc: ['每当你使用小麦种子行动格时，额外获得1份蔬菜。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_E168_Greengrocer_impl = OLD_E168_Greengrocer.impl
