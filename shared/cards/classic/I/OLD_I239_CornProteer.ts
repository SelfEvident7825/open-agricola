import { defineOccupationCard } from '../../card-source'
import type { PlayerState } from '../../../contract/types'
import { registerAdHocAction } from '../../../actions/helpers/ad-hoc-action-registry'
import {
  createResourceSaleActions,
  readResourceSale,
} from '../../../actions/effects/internal/resource-sale'

const CARD_ID = 'OLD_I239_CornProteer'
const SALE_RULE = {
  resource: 'grain',
  amount: 1,
  supplyFood: 3,
  buyerFood: 2,
  offerPrompt: 'ui.cards.OLD_I239_CornProteer.offer',
  buyerPrompt: 'ui.cards.OLD_I239_CornProteer.chooseBuyer',
} as const
const START = `card_${CARD_ID}_start`
const RESPOND = `card_${CARD_ID}_respond`
const saleOf = (player: PlayerState) => readResourceSale(player, CARD_ID)
createResourceSaleActions(CARD_ID, SALE_RULE).forEach(registerAdHocAction)

export const OLD_I239_CornProteer = defineOccupationCard({
  meta: {
    id: 'OLD_I239_CornProteer',
    originalId: 'I239_CornProteer',
    gameEdition: 'classic',
    name: '小麦奸商',
    deck: 'I',
    number: 239,
    desc: [
      '你可以随时将1份小麦转化为3份食物，但任何1名其他玩家都可以通过支付你2份食物购买你的这份小麦来阻止你这么做。当有多位买家出现时，由你选择卖给谁。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I239.png',
  },
  impl: {
    effect: {
      id: CARD_ID,
      projectInteractionRequest: (_state, player, request, actionId) =>
        actionId === RESPOND && request.kind === 'choice'
          ? {
              ...request,
              options: request.options.map((option) =>
                option.value === 'buy'
                  ? {
                      ...option,
                      disabled: player.resources.food < SALE_RULE.buyerFood,
                      disabledReasonKey:
                        player.resources.food < SALE_RULE.buyerFood
                          ? `cards.${CARD_ID}.buyDisabled`
                          : undefined,
                    }
                  : option,
              ),
            }
          : request,
      computeResourceCommitments: (_state, owner) => {
        const sale = saleOf(owner)
        return sale
          ? [
              {
                playerId: owner.id,
                resources: { [SALE_RULE.resource]: SALE_RULE.amount },
              },
              ...sale.willing.map((playerId) => ({
                playerId,
                resources: { food: SALE_RULE.buyerFood },
              })),
            ]
          : []
      },
    },
    listeners: [
      {
        id: 'OLD_I239-grain-sale-anytime',
        cardIds: [CARD_ID],
        actions: ['anytime'],
        phases: ['anytime'],
        handler: ({ player }) =>
          player.resources.grain >= SALE_RULE.amount && !saleOf(player)
            ? {
                flow: { type: 'leaf', actionId: START, sourceCard: CARD_ID },
                sourceCard: CARD_ID,
              }
            : undefined,
      },
    ],
  },
})
