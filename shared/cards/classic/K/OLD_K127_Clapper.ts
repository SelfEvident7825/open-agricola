import { defineMinorCard } from '../../card-source'
import { getLogicalFields } from '../../helpers/card-field'
import { createEventQuery } from '../../../events/query'
import type { ActionFlow, PlayerState } from '../../../contract/types'
import type { CardImpl } from '../../registry'

const CARD_ID = 'OLD_K127_Clapper'

const isGrowthSpace = (id: string, round: number) =>
  id === 'wish-children'
  || id === 'urgent-wish-children'
  || (id === 'modest-wish-children-56' && round >= 5)

const growGrain = (player: PlayerState): ActionFlow | undefined => {
  const locations = getLogicalFields(player)
    .filter(field => {
      const crop = field.stacks[0]?.kind
      return (crop === 'grain' || crop === 'wood')
        && field.stacks.every(stack => stack.kind === crop)
    })
    .map(field => ({ kind: 'field' as const, row: field.row, col: field.col }))
  if (!locations.length) return
  return {
    type: 'leaf',
    actionId: 'special-effect',
    sourceCard: CARD_ID,
    params: { kind: 'plant-additional-good', locations },
  }
}

const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state, player) => {
      const occupiesGrowth = state.actionSpaces.some(space =>
        isGrowthSpace(space.id, state.round)
        && space.takenBy.some(worker => worker.playerId === player.id && !worker.synthetic),
      )
      return occupiesGrowth ? growGrain(player) : undefined
    },
  },
  listeners: [
    {
      id: `${CARD_ID}-grow-grain`,
      cardIds: [CARD_ID],
      actionSpaces: ['wish-children', 'urgent-wish-children', 'modest-wish-children-56'],
      phases: ['after'],
      handler: ({ state, player, space, actionEvents }) => {
        if (!space || !isGrowthSpace(space.id, state.round)) return
        // A purchase on this same space already applies the immediate onBuy effect.
        if (createEventQuery(actionEvents ?? []).filter('card.played').some(event => event.cardId === CARD_ID)) return
        const flow = growGrain(player)
        return flow ? { flow, sourceCard: CARD_ID } : undefined
      },
    }
  ],
} satisfies CardImpl

export const OLD_K127_Clapper = defineMinorCard({
  meta: {
    id: 'OLD_K127_Clapper',
    originalId: 'K127_Clapper',
    gameEdition: 'classic',
    name: '响板',
    deck: 'K',
    number: 127,
    desc: [
      '每当你使用写有“生娃”行动的行动格时(或打出此卡时有家庭成员在其上)，在你的每个麦田上额外叠放1份小麦。（1）如果你使用五人局“技能培训/生娃“行动格执行“技能培训”行动，也可发动此效果。（从第5回合起）（2）对任意卡牌麦田有效。（3）对下列卡牌资源田有效：K278护林人、I78木头地、WM014芦苇地、NL048郁金香花田、Ö21葡萄园。',
    ],
    cost: {
      wood: 1,
    },
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K127.png',
  },
  impl: cardImpl,
})
export const OLD_K127_Clapper_impl = OLD_K127_Clapper.impl
