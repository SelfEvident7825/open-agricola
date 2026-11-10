import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { registerAdHocAction } from '../../../actions/helpers/ad-hoc-action-registry'
import { executeActivatedRuleOperation } from '../../../actions/rule-activated-operation'
import { openRoundForSpace } from '../../../actions/helpers/placement-availability'
import type { ActionDefinition } from '../../../contract/types'

const CARD_ID = 'OLD_K308_Foreman'
const PLACE_FOOD = `card_${CARD_ID}_placeFood`
const placeFood: ActionDefinition = {
  id: PLACE_FOOD,
  nameKey: `cards.${CARD_ID}.name`,
  descriptionKey: `cards.${CARD_ID}.desc`,
  roundAvailable: 1,
  gainPerRound: {},
  canBeExecutedByPlayer: () => true,
  execute: context => ({
    type: 'request',
    request: {
      kind: 'choice',
      options: context.state.actionSpaces
        .filter(space => openRoundForSpace(context.state, space) <= context.state.round)
        .map(space => ({ value: space.id, labelKey: space.nameKey })),
    },
  }),
  resolveChoice: (context, choice) => {
    const space = context.state.actionSpaces.find(candidate => candidate.id === choice)
    if (!space || openRoundForSpace(context.state, space) > context.state.round) {
      return { type: 'fail', errorKey: 'log.actionFail' }
    }
    return executeActivatedRuleOperation({
      kind: 'put-on-action-space',
      spaceId: space.id,
      resources: { food: 1 },
    }, context)
  },
}
registerAdHocAction(placeFood)
const cardImpl = {
  effect: {
    id: CARD_ID,
    onRoundStart: () => ({ type: 'leaf', actionId: PLACE_FOOD, sourceCard: CARD_ID, optional: true }),
  },
} satisfies CardImpl

export const OLD_K308_Foreman = defineOccupationCard({
  meta: {
    id: 'OLD_K308_Foreman',
    originalId: 'K308_Foreman',
    gameEdition: 'classic',
    name: '工头',
    deck: 'K',
    number: 308,
    desc: [
      '每回合开始时，你可以从游戏供应区拿取1份食物放置任意一个行动格上。（不能放在未翻开行动格上）',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '3+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K308.png',
  },
  impl: cardImpl,
})

export const OLD_K308_Foreman_impl = OLD_K308_Foreman.impl
