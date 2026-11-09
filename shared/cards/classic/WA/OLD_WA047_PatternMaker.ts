// Generated classic import. Remove this line before manually porting a card.
import { defineOccupationCard } from '../../card-source'
import type { CardListenerRegistration } from '../../card-listeners'
import type { ActionHookPhase, ActionHookResult } from '../../../actions/hooks'
import { payLeaf, gainLeaf } from '../../helpers/pay-gain-node'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_WA047_PatternMaker'
/**
 * C153 Pattern Maker:
 * Each time another player renovates, the card owner can optionally
 * pay 2 wood to get 1 grain + 1 food + 1 bonus VP.
 */
const listener: CardListenerRegistration = {
  id: 'OLD_WA047_PatternMaker-pattern-maker-opponent-renovate',
  cardIds: [CARD_ID],
  actions: ['renovate-house'],
  phases: ['after' as ActionHookPhase],
  scope: 'opponent',
  handler: (): ActionHookResult | void => {
    return {
      flow: {
        type: 'seq',
        optional: true,
        children: [
          payLeaf({
            cardId: CARD_ID,
            cost: { wood: 2 },
          }),
          {
            type: 'leaf',
            actionId: 'bonus-vp',
            sourceCard: CARD_ID,
          },
          gainLeaf(CARD_ID, { grain: 1, food: 1 }),
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

export const OLD_WA047_PatternMaker = defineOccupationCard({
  meta: {
    id: 'OLD_WA047_PatternMaker',
    name: '模型制造商',
    deck: 'WA',
    number: 47,
    category: 'POINTS_PROVIDER',
    desc: ['每当其他玩家翻修房屋时，你可以花费2根木头来获得1份小麦+1份食物+1分。'],
    cost: {},
    players: '1+',
    extraVp: true,
    waresSalesmanGains: [
      {
        wood: 1,
        reed: 1,
      },
    ],
    originalId: 'WA047_PatternMaker',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    implemented: true,
    artUrl: '/assets/classic/WA/WA047.png',
    locales: {
      zh: {
        name: '模型制造商',
        desc: ['每当其他玩家翻修房屋时，你可以花费2根木头来获得1份小麦+1份食物+1分。'],
        prerequisite: '',
      },
    },
  },
  presentation: { counters: ['bonusVp'] },
  impl: cardImpl,
})

export const OLD_WA047_PatternMaker_impl = OLD_WA047_PatternMaker.impl
