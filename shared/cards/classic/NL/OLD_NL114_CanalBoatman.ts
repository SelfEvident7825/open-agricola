// Generated classic import. Remove this line before manually porting a card.
import { defineOccupationCard } from '../../card-source'
import type { CardListenerContext, CardListenerRegistration } from '../../card-listeners'
import type { ActionHookResult } from '../../../actions/hooks'
import { gainLeaf, payLeaf } from '../../helpers/pay-gain-node'
import { workersAvailable } from '../../../domain/player'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_NL114_CanalBoatman'
const TRIGGER_SPACE_IDS = new Set(['fishing', 'reed-bank'])

const listener: CardListenerRegistration = {
  id: 'OLD_NL114_CanalBoatman-canal-boatman-after-place-farmer',
  cardIds: [CARD_ID],
  actionSpaces: 'all',
  phases: ['after'],
  handler: (context: CardListenerContext): ActionHookResult | void => {
    if (!context.space || !TRIGGER_SPACE_IDS.has(context.space.id)) return
    if (workersAvailable(context.state, context.player) <= 0) return
    if (context.player.resources.food < 1) return

    return {
      flow: {
        type: 'seq',
        optional: true,
        children: [
          payLeaf({ cardId: CARD_ID, cost: { food: 1 } }),
          { type: 'leaf', actionId: 'spend-worker', sourceCard: CARD_ID },
          {
            type: 'xor',
            children: [
              gainLeaf(CARD_ID, { stone: 3 }),
              gainLeaf(CARD_ID, { grain: 1, vegetable: 1 }),
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

export const OLD_NL114_CanalBoatman = defineOccupationCard({
  meta: {
    id: 'OLD_NL114_CanalBoatman',
    name: '运河船夫',
    deck: 'NL',
    number: 114,
    category: 'GOODS_PROVIDER',
    desc: [
      '每当你使用钓鱼或芦苇滩积累行动格时，你可以支付1份食物来立即放置你的另1名家庭成员到此卡上。若你如此做，则你获得3块石头，或1份小麦+1份蔬菜。',
    ],
    cost: {},
    players: '4+',
    originalId: 'NL114_CanalBoatman',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/NL/NL114.png',
  },
  impl: cardImpl,
})

export const OLD_NL114_CanalBoatman_impl = OLD_NL114_CanalBoatman.impl
