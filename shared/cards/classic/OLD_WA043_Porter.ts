// Generated classic import. Remove this line before manually porting a card.
import { defineOccupationCard } from '../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../card-listeners'
import type { ActionHookPhase, ActionHookResult } from '../../actions/hooks'
import { gainLeaf } from '../helpers/pay-gain-node'
import { sumResourceMovedToPlayer } from '../helpers/event-provenance'
import type { Resource } from '../../contract/types'
import type { CardImpl } from '../registry'

const CARD_ID = 'OLD_WA043_Porter'
const BUILDING_RESOURCES: (keyof Resource)[] = ['wood', 'clay', 'reed', 'stone']

const listener: CardListenerRegistration = {
  id: 'OLD_WA043_Porter-porter-after-collect',
  cardIds: [CARD_ID],
  actions: ['collect'],
  phases: ['after' as ActionHookPhase],
  handler: (context: CardListenerContext): ActionHookResult | void => {
    const events = context.actionEvents ?? context.transactionEvents
    const gain: Partial<Resource> = {}
    let triggered = false
    for (const res of BUILDING_RESOURCES) {
      const amount = sumResourceMovedToPlayer(events, res, context.player.id, (event) =>
        event.from.kind === 'actionSpace',
      )
      if (amount >= 4) {
        gain[res] = (gain[res] ?? 0) + 1
        triggered = true
      }
    }
    if (!triggered) return
    gain.food = (gain.food ?? 0) + 1
    return { flow: gainLeaf(CARD_ID, gain), sourceCard: CARD_ID }
  },
}

const cardImpl = {
  listeners: [listener],
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_WA043_Porter = defineOccupationCard({
  meta: {
  "id": "OLD_WA043_Porter",
  "name": "搬运工",
  "deck": "WA",
  "number": 43,
  "category": "BUILDING_RESOURCE_PROVIDER",
  "desc": [
    "每当你从行动格上拿取不少于4份同种建筑资源时，你额外获得1个该建筑资源+1份食物。"
  ],
  "cost": {},
  "players": "1+",
  "implemented": true,
  "originalId": "WA043_Porter",
  "gameEdition": "classic",
  "vp": 0,
  "prerequisite": "",
  "passing": false,
  "extraVp": false,
  "artUrl": "/card-art/classic/WA043.png",
  "locales": {
    "zh": {
      "name": "搬运工",
      "desc": [
        "每当你从行动格上拿取不少于4份同种建筑资源时，你额外获得1个该建筑资源+1份食物。"
      ],
      "prerequisite": ""
    }
  }
},
  impl: cardImpl,
})

export const OLD_WA043_Porter_impl = OLD_WA043_Porter.impl
