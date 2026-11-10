import { defineOccupationCard } from '../../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../../card-listeners'
import type { ActionHookResult } from '../../../actions/hooks'
import { payLeaf, gainLeaf } from '../../helpers/pay-gain-node'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_I259_AnimalDealer'
type AnimalKey = 'sheep' | 'boar' | 'cattle'

const SPACE_TO_ANIMAL: Record<string, AnimalKey> = {
  'sheep-market': 'sheep',
  'pig-market': 'boar',
  'cattle-market': 'cattle',
}

const listener: CardListenerRegistration = {
  id: 'OLD_I259_AnimalDealer-animal-dealer-before-place-farmer',
  cardIds: [CARD_ID],
  phases: ['before'],
  actionSpaces: 'all',
  handler: (context: CardListenerContext): ActionHookResult | void => {
    const spaceId = context.space?.id ?? ''
    const animal = SPACE_TO_ANIMAL[spaceId]
    if (!animal) return
    return {
      flow: {
        type: 'seq',
        optional: true,
        children: [
          payLeaf({ cardId: CARD_ID, cost: { food: 1 } }),
          gainLeaf(CARD_ID, { [animal]: 1 }),
        ],
      },
      sourceCard: CARD_ID,
    }
  },
}

const cardImpl = {
  listeners: [listener],
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_I259_AnimalDealer = defineOccupationCard({
  meta: {
    id: 'OLD_I259_AnimalDealer',
    name: '动物交易员',
    deck: 'I',
    number: 259,
    category: 'LIVESTOCK_PROVIDER',
    desc: ['每当你使用羊市场/猪市场/牛市场积累行动格时，你可以支付1份食物来额外购买1只对应动物。'],
    cost: {},
    players: '3+',
    originalId: 'I259_AnimalDealer',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I259.png',
  },
  impl: cardImpl,
})

export const OLD_I259_AnimalDealer_impl = OLD_I259_AnimalDealer.impl
