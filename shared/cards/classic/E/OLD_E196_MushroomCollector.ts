import { defineOccupationCard } from '../../card-source'
import type { CardListenerContext, CardListenerRegistration } from '../../card-listeners'
import type { ActionHookResult } from '../../../actions/hooks'
import { returnToSpaceThenGainFlow } from '../../helpers/pay-gain-node'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E196_MushroomCollector'
const isWoodAccumulationSpace = (space: CardListenerContext['space']): boolean =>
  (space.gainPerRound?.wood ?? 0) > 0
const mushroomCollectorImmediatelyAfterListener: CardListenerRegistration = {
  id: 'OLD_E196_MushroomCollector-mushroom-collector-immediately-after',
  cardIds: [CARD_ID],
  phases: ['immediatelyAfter'],
  actionSpaces: 'all',
  handler: (context: CardListenerContext): ActionHookResult | void => {
    if (!isWoodAccumulationSpace(context.space)) return
    return returnToSpaceThenGainFlow({
      cardId: CARD_ID,
      cost: { wood: 1 },
      gain: { food: 2 },
      choiceLabelKey: 'occupations.OLD_E196_MushroomCollector.name',
    })
  },
}
const cardImpl = {
  listeners: [mushroomCollectorImmediatelyAfterListener],
  reaches: [] as readonly string[],
} satisfies CardImpl
export const OLD_E196_MushroomCollector = defineOccupationCard({
  meta: {
    id: 'OLD_E196_MushroomCollector',
    name: '采菇人',
    deck: 'E',
    number: 196,
    category: 'FOOD_PROVIDER',
    desc: [
      '每当你使用木头积累行动格后，你可以立即将1根木头转换成2份食物。若你如此做，将那根木头放在你所使用的积累行动格上。',
    ],
    cost: {},
    players: '4+',
    waresSalesmanGains: [
      {
        wood: 1,
        reed: 1,
      },
    ],
    originalId: 'E196_MushroomCollector',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E196.png',
  },
  impl: cardImpl,
})
export const OLD_E196_MushroomCollector_impl = OLD_E196_MushroomCollector.impl
