// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
import type { CardListenerRegistration, CardListenerContext } from '../../card-listeners'
import type { ActionHookResult } from '../../../actions/hooks'
import { gainLeaf } from '../../helpers/pay-gain-node'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_NL012_Brook'
const FIXED_BROOK_SPACES = new Set(['forest', 'clay-pit', 'reed-bank'])

const listener: CardListenerRegistration = {
  id: 'OLD_NL012_Brook-brook-before-place-farmer',
  cardIds: [CARD_ID],
  phases: ['before'],
  actionSpaces: 'all',
  handler: (context: CardListenerContext): ActionHookResult | void => {
    const spaceId = context.space?.id
    if (!spaceId) return
    const roundOneSpaceId = context.state.roundActionOrder[0]
    if (!FIXED_BROOK_SPACES.has(spaceId) && spaceId !== roundOneSpaceId) return
    return { flow: gainLeaf(CARD_ID, { food: 1 }), sourceCard: CARD_ID }
  },
}

const cardImpl = {
  prerequisiteCheck: (player, state) => {
    if (!state) return true
    const fishing = state.actionSpaces.find((s) => s.id === 'fishing')
    if (!fishing) return false
    return fishing.takenBy.some((w) => w.playerId === player.id)
  },
  listeners: [listener],
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_NL012_Brook = defineMinorCard({
  meta: {
    id: 'OLD_NL012_Brook',
    name: '小溪',
    deck: 'NL',
    number: 12,
    category: 'FOOD_PROVIDER',
    desc: [
      '每当你使用钓鱼积累行动格上方的森林[3木]、土矿[1砖]和芦苇滩积累行动格时，你都额外获得1份食物',
    ],
    cost: {},
    prerequisite: '你有家庭成员在钓鱼',
    originalId: 'NL012_Brook',
    gameEdition: 'classic',
    vp: 0,
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/NL/NL012.png',
    locales: {
      zh: {
        name: '小溪',
        desc: [
          '每当你使用钓鱼积累行动格上方的森林[3木]、土矿[1砖]和芦苇滩积累行动格时，你都额外获得1份食物',
        ],
        prerequisite: '你有家庭成员在钓鱼',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_NL012_Brook_impl = OLD_NL012_Brook.impl
