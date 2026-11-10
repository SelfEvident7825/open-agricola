import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import type { GameState, ActionDefinition } from '../../../contract/types'
import { registerAdHocAction } from '../../../actions/helpers/ad-hoc-action-registry'
import { gainLeaf } from '../../helpers/pay-gain-node'

const CARD_ID = 'OLD_K284_WoodDistributor'
const ACTION = 'card_' + CARD_ID + '_redistribute'
const TARGETS = ['clay-pit', 'reed-bank', 'fishing'] as const
const distributions = (state: GameState) => {
  const count = state.actionSpaces.find(space => space.id === 'forest')?.resources.wood ?? 0
  if (count <= 0 || TARGETS.some(id => !state.actionSpaces.some(space => space.id === id))) return []
  const base = Math.floor(count / 3)
  const remainder = count % 3
  const selections = remainder === 0 ? [[]] : remainder === 1 ? [[0], [1], [2]] : [[0, 1], [0, 2], [1, 2]]
  return selections.map(extra => TARGETS.map((_, index) => base + Number(extra.includes(index))))
}
const redistribute: ActionDefinition = {
  id: ACTION,
  nameKey: 'actions.forest.name',
  descriptionKey: 'actions.forest.description',
  roundAvailable: 1,
  gainPerRound: {},
  canBeExecutedByPlayer: state => distributions(state).length > 0,
  execute: ({ state }) => ({
    type: 'request',
    request: {
      kind: 'choice',
      options: distributions(state).map(counts => ({
        value: counts.join(','),
        labelKey: 'ui.interactionUseAbility',
        sourceCard: CARD_ID,
        descriptionPreview: {
          kind: 'group',
          operator: 'sequence',
          separator: ' + ',
          parts: TARGETS.map((id, index) => ({
            kind: 'action',
            labelKey: 'actions.' + id + '.name',
            effectPreview: {
              kind: 'resourceMovement',
              resources: { wood: counts[index]! },
              from: { kind: 'actionSpace', spaceId: 'forest', nameKey: 'actions.forest.name' },
              to: { kind: 'actionSpace', spaceId: id, nameKey: 'actions.' + id + '.name' },
            },
          })),
        },
      })),
    },
  }),
  resolveChoice: ({ state, eventSink }, choice) => {
    const counts = distributions(state).find(values => values.join(',') === choice)
    const forest = state.actionSpaces.find(space => space.id === 'forest')
    if (!counts || !forest) return { type: 'fail', errorKey: 'log.actionFail', recoverable: true }
    for (const [index, id] of TARGETS.entries()) {
      const amount = counts[index]!
      const target = state.actionSpaces.find(space => space.id === id)!
      target.resources.wood = (target.resources.wood ?? 0) + amount
      forest.resources.wood -= amount
      if (amount > 0) {
        eventSink.emit<'resource.moved'>({
          type: 'resource.moved',
          resources: { wood: amount },
          from: { kind: 'actionSpace', spaceId: 'forest' },
          to: { kind: 'actionSpace', spaceId: id },
          reason: 'cardEffect',
        })
      }
    }
    return { type: 'ok' }
  },
}
registerAdHocAction(redistribute)

const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: () => gainLeaf(CARD_ID, { wood: 2 }),
    onWorkStart: () => ({ type: 'leaf', actionId: ACTION, sourceCard: CARD_ID, optional: true }),
  },
} satisfies CardImpl

export const OLD_K284_WoodDistributor = defineOccupationCard({
  meta: {
    id: 'OLD_K284_WoodDistributor',
    originalId: 'K284_WoodDistributor',
    gameEdition: 'classic',
    name: '木头分配员',
    deck: 'K',
    number: 284,
    desc: [
      '打出此卡时，你立即获得2根木头。每个工作阶段开始时，你可以把森林[3木]积累行动格上的所有木头（其他物品不能分发）尽量平均分配到土矿[1砖]、芦苇滩和钓鱼积累行动格上。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K284.png',
    locales: {
      zh: {
        name: '木头分配员',
        desc: [
          '打出此卡时，你立即获得2根木头。每个工作阶段开始时，你可以把森林[3木]积累行动格上的所有木头（其他物品不能分发）尽量平均分配到土矿[1砖]、芦苇滩和钓鱼积累行动格上。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
