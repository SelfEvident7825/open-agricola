// Generated classic import. Remove this line before manually porting a card.
import { defineOccupationCard } from '../../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../../card-listeners'
import type { ActionHookResult } from '../../../actions/hooks'
import { gainLeaf, payLeaf } from '../../helpers/pay-gain-node'
import type { CardImpl } from '../../registry'
import { isTravelingPlayersSpaceId } from '../../helpers/action-space-categories'

const CARD_ID = 'OLD_WA044_Lutenist'
/**
 * A160 Lutenist:
 * Each time another player uses the Traveling Players accumulation space,
 * you automatically get 1 food + 1 wood.
 * Then you can optionally pay 2 food to get 1 vegetable.
 * Players 3+.
 */
const listener: CardListenerRegistration = {
  id: 'OLD_WA044_Lutenist-lutenist-opponent-traveling-players',
  cardIds: [CARD_ID],
  actionSpaces: 'all',
  phases: ['after'],
  scope: 'opponent',
  handler: (context: CardListenerContext): ActionHookResult | void => {
    if (!isTravelingPlayersSpaceId(context.space?.id)) return
    return {
      flow: {
        type: 'seq',
        children: [
          gainLeaf(CARD_ID, { food: 1, wood: 1 }),
          {
            type: 'seq',
            optional: true,
            children: [
              payLeaf({ cardId: CARD_ID, cost: { food: 2 } }),
              gainLeaf(CARD_ID, { vegetable: 1 }),
            ],
          },
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

export const OLD_WA044_Lutenist = defineOccupationCard({
  meta: {
    id: 'OLD_WA044_Lutenist',
    name: '琵琶演奏家',
    deck: 'WA',
    number: 44,
    category: 'CROP_PROVIDER',
    desc: ['每当其他玩家使用卖艺积累行动格时，你获得1份食物，并且可以花费2食物购买1份蔬菜。'],
    cost: {},
    players: '1+',
    originalId: 'WA044_Lutenist',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/WA/WA044.png',
    locales: {
      zh: {
        name: '琵琶演奏家',
        desc: ['每当其他玩家使用卖艺积累行动格时，你获得1份食物，并且可以花费2食物购买1份蔬菜。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_WA044_Lutenist_impl = OLD_WA044_Lutenist.impl
