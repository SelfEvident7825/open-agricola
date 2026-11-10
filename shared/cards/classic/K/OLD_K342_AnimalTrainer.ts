import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { payGainActionFlow } from '../../helpers/pay-gain-node'
import { sumActionSpaceMovedToTriggerPlayer } from '../../helpers/event-provenance'
import { isTravelingPlayersSpaceId } from '../../helpers/action-space-categories'
import type { ActionFlow } from '../../../contract/types'

const CARD_ID = 'OLD_K342_AnimalTrainer'
const cardImpl = {
  listeners: [{
    id: CARD_ID + '-animals',
    cardIds: [CARD_ID],
    actionSpaces: 'all',
    phases: ['immediatelyAfter'],
    handler: context => {
      if (!isTravelingPlayersSpaceId(context.space.id)) return
      const budget = Math.min(context.player.resources.food, sumActionSpaceMovedToTriggerPlayer(context, 'food'))
      const children: ActionFlow[] = []
      for (let cattle = 0; cattle * 3 <= budget; cattle++) {
        for (let sheep = 0; cattle * 3 + sheep * 2 <= budget; sheep++) {
          for (let boar = 0; cattle * 3 + (sheep + boar) * 2 <= budget; boar++) {
            const cost = cattle * 3 + (sheep + boar) * 2
            if (!cost) continue
            children.push(payGainActionFlow({
              cardId: CARD_ID,
              cost: { food: cost },
              gain: { sheep, boar, cattle },
              choiceLabelKey: 'ui.interactionResourceExchange',
            }))
          }
        }
      }
      return children.length ? { sourceCard: CARD_ID, flow: { type: 'xor', optional: true, children } } : undefined
    },
  }],
} satisfies CardImpl

export const OLD_K342_AnimalTrainer = defineOccupationCard({
  meta: {
    id: 'OLD_K342_AnimalTrainer',
    originalId: 'K342_AnimalTrainer',
    gameEdition: 'classic',
    name: '马戏驯兽师',
    deck: 'K',
    number: 342,
    desc: [
      '每当你使用卖艺积累行动格时，你可以使用上面的食物购买动物，羊/猪/牛分别花费2/2/3份食物。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K342.png',
  },
  impl: cardImpl,
})

export const OLD_K342_AnimalTrainer_impl = OLD_K342_AnimalTrainer.impl
