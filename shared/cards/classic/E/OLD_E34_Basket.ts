import { defineMinorCard } from '../../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../../card-listeners'
import type { ActionHookResult } from '../../../actions/hooks'
import { returnToSpaceThenGainFlow } from '../../helpers/pay-gain-node'
import type { CardImpl } from '../../registry'
const CARD_ID = 'OLD_E34_Basket'
const isWoodAccumulationSpace = (space: CardListenerContext['space']): boolean =>
  (space?.gainPerRound?.wood ?? 0) > 0
const listener: CardListenerRegistration = {
  id: 'OLD_E34_Basket-basket-immediately-after-collect',
  cardIds: [CARD_ID],
  phases: ['immediatelyAfter'],
  actionSpaces: 'all',
  handler: (context: CardListenerContext): ActionHookResult | void => {
    if (!isWoodAccumulationSpace(context.space)) return
    return returnToSpaceThenGainFlow({
      cardId: CARD_ID,
      cost: { wood: 2 },
      gain: { food: 3 },
      choiceLabelKey: 'cards.OLD_E34_Basket.name',
    })
  },
}
const cardImpl = {
  listeners: [listener],
  reaches: [] as readonly string[],
} satisfies CardImpl
export const OLD_E34_Basket = defineMinorCard({
  meta: {
    id: 'OLD_E34_Basket',
    name: '篮子',
    deck: 'E',
    number: 34,
    category: 'FOOD_PROVIDER',
    desc: [
      '每当你从行动格上取得不少于2根木头时，可以留下2根木头在所使用的行动格上，额外获得3份食物。(通过卡牌获得的木头不算)',
    ],
    cost: {
      reed: 1,
    },
    waresSalesmanGains: [
      {
        wood: 1,
        reed: 1,
      },
    ],
    originalId: 'E34_Basket',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E34.png',
  },
  impl: cardImpl,
})
export const OLD_E34_Basket_impl = OLD_E34_Basket.impl
