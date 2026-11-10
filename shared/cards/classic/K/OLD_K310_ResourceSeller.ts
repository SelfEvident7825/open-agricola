import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { createEventQuery } from '../../../events/query'
import { getCardStack, ensureCardState } from '../../helpers/card-state'
import type { CardListenerContext } from '../../card-listeners'
import type { ActionFlow, Resource } from '../../../contract/types'

const CARD_ID = 'OLD_K310_ResourceSeller'
// Bottom to top, matching the original card's seven-resource pile.
const INITIAL_STACK = ['stone', 'clay', 'stone', 'clay', 'reed', 'clay', 'wood']
const matchingFlow = (context: CardListenerContext) => {
  const player = context.ownerPlayer ?? context.player
  const received = new Set<keyof Resource>()
  const events = createEventQuery(context.actionEvents ?? [])
  for (const event of events.filter('resource.moved')) {
    if (event.sourceCardId === CARD_ID || event.to.kind !== 'player' || event.to.playerId !== player.id) continue
    for (const [key, amount] of Object.entries(event.resources)) {
      if (amount > 0) received.add(key as keyof Resource)
    }
  }
  for (const event of events.filter('resource.exchanged')) {
    if (event.sourceCardId === CARD_ID || event.gainedTo.kind !== 'player' || event.gainedTo.playerId !== player.id) continue
    for (const [key, amount] of Object.entries(event.gained)) {
      if (amount > 0) received.add(key as keyof Resource)
    }
  }
  const topFirst = [...getCardStack(player, CARD_ID)].reverse()
  let count = 0
  while (count < topFirst.length && received.has(topFirst[count] as keyof Resource)) count++
  if (!count) return
  const children: ActionFlow[] = Array.from({ length: count }, (_, i) => ({
    type: 'seq',
    children: Array.from({ length: i + 1 }, () => ({
      type: 'leaf',
      actionId: 'pop-card-stack',
      sourceCard: CARD_ID,
    })),
  }))
  return { sourceCard: CARD_ID, flow: { type: 'xor' as const, optional: true, children } }
}
const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (_state, player) => {
      ensureCardState(player, CARD_ID).stack = [...INITIAL_STACK]
    },
  },
  listeners: [
    { id: CARD_ID + '-receive', cardIds: [CARD_ID], events: ['resource.moved'], phases: ['after'], scope: 'any', handler: matchingFlow },
    { id: CARD_ID + '-exchange', cardIds: [CARD_ID], actions: ['exchange'], phases: ['after'], handler: matchingFlow },
  ],
} satisfies CardImpl

export const OLD_K310_ResourceSeller = defineOccupationCard({
  presentation: { stack: true },
  meta: {
    id: 'OLD_K310_ResourceSeller',
    originalId: 'K310_ResourceSeller',
    gameEdition: 'classic',
    name: '资源销售商',
    deck: 'K',
    number: 310,
    desc: [
      '按右图所示将这些物品排列于此卡上，每当你获得与最上面的资源同种的资源时，你取走最上面的资源。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '3+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K310.png',
    locales: {
      zh: {
        name: '资源销售商',
        desc: [
          '按右图所示将这些物品排列于此卡上，每当你获得与最上面的资源同种的资源时，你取走最上面的资源。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_K310_ResourceSeller_impl = OLD_K310_ResourceSeller.impl
