// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../card-listeners'
import type { ActionHookPhase, ActionHookResult } from '../../actions/hooks'
import type { DraftGameEvent, FarmFenceBuiltEvent } from '../../contract/events'
import { gainLeaf } from '../helpers/pay-gain-node'
import type { CardImpl } from '../registry'

const CARD_ID = 'OLD_I77_ShepherdsCrook'
const MIN_PASTURE_SIZE = 4

type QueryableFarmFenceBuiltEvent = FarmFenceBuiltEvent | DraftGameEvent<'farm.fenceBuilt'>

const isFarmFenceBuiltEvent = (
  event: CardListenerContext['transactionEvents'][number],
): event is QueryableFarmFenceBuiltEvent =>
  event.type === 'farm.fenceBuilt'

const newPasturesFromFenceEvents = (context: CardListenerContext): Array<{ tiles?: unknown[] }> => {
  const events = context.actionEvents ?? context.transactionEvents
  return (events ?? []).flatMap((event) =>
    isFarmFenceBuiltEvent(event) ? event.newPastures ?? [] : [],
  )
}

const listener: CardListenerRegistration = {
  id: 'OLD_I77_ShepherdsCrook-shepherds-crook-after-fencing',
  cardIds: [CARD_ID],
  phases: ['immediatelyAfter' as ActionHookPhase],
  actions: ['fence'],
  handler: (context: CardListenerContext): ActionHookResult | void => {
    const newPastures = newPasturesFromFenceEvents(context)
    const newBig = newPastures.filter(
      (pasture) => (pasture.tiles?.length ?? 0) >= MIN_PASTURE_SIZE,
    ).length
    if (newBig <= 0) return
    const sheepGain = newBig * 2
    return { flow: gainLeaf(CARD_ID, { sheep: sheepGain }), sourceCard: CARD_ID }
  },
}

const cardImpl = {
  listeners: [listener],
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_I77_ShepherdsCrook = defineMinorCard({
  meta: {
  "id": "OLD_I77_ShepherdsCrook",
  "name": "牧羊杖",
  "deck": "I",
  "number": 77,
  "category": "LIVESTOCK_PROVIDER",
  "desc": [
    "每当你用栅栏围出1个占据不小于4个农场格子的圈地时，你立即获得2只羊。"
  ],
  "cost": {
    "wood": 1
  },
  "originalId": "I77_ShepherdsCrook",
  "gameEdition": "classic",
  "vp": 0,
  "prerequisite": "",
  "passing": false,
  "extraVp": false,
  "implemented": true,
  "artUrl": "/card-art/classic/I77.png",
  "locales": {
    "zh": {
      "name": "牧羊杖",
      "desc": [
        "每当你用栅栏围出1个占据不小于4个农场格子的圈地时，你立即获得2只羊。"
      ],
      "prerequisite": ""
    }
  }
},
  impl: cardImpl,
})

export const OLD_I77_ShepherdsCrook_impl = OLD_I77_ShepherdsCrook.impl
