// Generated classic import. Remove this line before manually porting a card.
import { defineOccupationCard } from '../../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../../card-listeners'
import type { ActionHookResult } from '../../../actions/hooks'
import { gainLeaf } from '../../helpers/pay-gain-node'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_NL078_WaterWorker'
const TRIGGER_SPACE_IDS = new Set(['day-laborer', 'reed-bank'])

const isRound4ActionSpace = (context: CardListenerContext): boolean => {
  if (!context.space) return false
  const roundOrder = context.state.roundActionOrder
  // Round 4 is index 3 (0-based)
  const round4SpaceId = roundOrder[3]
  return round4SpaceId !== null && context.space.id === round4SpaceId
}

const collectListener: CardListenerRegistration = {
  id: 'OLD_NL078_WaterWorker-water-worker-after-collect',
  cardIds: [CARD_ID],
  phases: ['after'],
  actionSpaces: 'all',
  handler: (context: CardListenerContext): ActionHookResult | void => {
    if (context.space?.id !== 'fishing') return
    return { flow: gainLeaf(CARD_ID, { reed: 1 }), sourceCard: CARD_ID }
  },
}

const placeFarmerListener: CardListenerRegistration = {
  id: 'OLD_NL078_WaterWorker-water-worker-after-place-farmer',
  cardIds: [CARD_ID],
  phases: ['after'],
  actionSpaces: 'all',
  handler: (context: CardListenerContext): ActionHookResult | void => {
    if (!context.space) return
    if (TRIGGER_SPACE_IDS.has(context.space.id) || isRound4ActionSpace(context)) {
      return { flow: gainLeaf(CARD_ID, { reed: 1 }), sourceCard: CARD_ID }
    }
  },
}

const cardImpl = {
  listeners: [collectListener, placeFarmerListener],
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_NL078_WaterWorker = defineOccupationCard({
  meta: {
    id: 'OLD_NL078_WaterWorker',
    name: '水上工人',
    deck: 'NL',
    number: 78,
    category: 'BUILDING_RESOURCE_PROVIDER',
    desc: [
      '当你使用钓鱼积累行动格或与其正交相邻的行动格(临时工、芦苇滩、第4回合行动格)时，你额外获得1捆芦苇。',
    ],
    cost: {},
    players: '3+',
    originalId: 'NL078_WaterWorker',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/NL/NL078.png',
    locales: {
      zh: {
        name: '水上工人',
        desc: [
          '当你使用钓鱼积累行动格或与其正交相邻的行动格(临时工、芦苇滩、第4回合行动格)时，你额外获得1捆芦苇。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_NL078_WaterWorker_impl = OLD_NL078_WaterWorker.impl
