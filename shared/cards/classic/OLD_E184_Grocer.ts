import { defineOccupationCard } from '../card-source';
import type { CardListenerRegistration, CardListenerContext } from '../card-listeners';
import type { ActionHookPhase, ActionHookResult } from '../../actions/hooks';
import { getCardStack, pushToCardStack } from '../helpers/card-state';
import { payLeaf } from '../helpers/pay-gain-node';
import type { CardImpl } from '../registry';
const CARD_ID = 'OLD_E184_Grocer';
/**
 * Stack order (bottom to top): vegetable, reed, clay, vegetable, stone, reed, grain, wood
 * Player pays 1 food to take the top good at any time.
 */
const STACK_ITEMS = ['vegetable', 'reed', 'clay', 'wood', 'vegetable', 'stone', 'grain', 'reed'];
const anytimeListener: CardListenerRegistration = {
    id: 'OLD_E184_Grocer-grocer-anytime',
    cardIds: [CARD_ID],
    actions: ['anytime'],
    phases: ['anytime' as ActionHookPhase],
    preScoring: true,
    handler: (context: CardListenerContext): ActionHookResult | void => {
        const stack = getCardStack(context.player, CARD_ID);
        if (stack.length === 0)
            return;
        if (context.player.resources.food < 1)
            return;
        return {
            flow: {
                type: 'seq',
                children: [
                    payLeaf({
                        cardId: CARD_ID, cost: { food: 1 }
                    }),
                    {
                        type: 'leaf', actionId: 'pop-card-stack', sourceCard: CARD_ID
                    },
                ],
            },
            sourceCard: CARD_ID,
        };
    },
};
const cardImpl = {
    listeners: [anytimeListener],
    effect: {
        id: CARD_ID,
        onBuy: (_state, player) => {
            pushToCardStack(player, CARD_ID, STACK_ITEMS);
        },
    },
    reaches: [] as readonly string[],
} satisfies CardImpl;
export const OLD_E184_Grocer = defineOccupationCard({
    meta: {
        "id": "OLD_E184_Grocer",
        "name": "杂货商",
        "deck": "E",
        "number": 184,
        "category": "GOODS_PROVIDER",
        "desc": [
            "从上到下将<REED><GRAIN><STONE><VEGETABLE><WOOD><CLAY><REED><VEGETABLE>排列于此卡上。任意时刻，你可以支付1<FOOD>来买走最上方的物品。"
        ],
        "cost": {},
        "players": "3+",
        "originalId": "E184_Grocer",
        "gameEdition": "classic",
        "vp": 0,
        "prerequisite": "",
        "passing": false,
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E184.png",
        "locales": {
            "zh": {
                "name": "杂货商",
                "desc": [
                    "从上到下将<REED><GRAIN><STONE><VEGETABLE><WOOD><CLAY><REED><VEGETABLE>排列于此卡上。任意时刻，你可以支付1<FOOD>来买走最上方的物品。"
                ],
                "prerequisite": ""
            }
        }
    },
    presentation: { stack: true },
    impl: cardImpl,
});
export const OLD_E184_Grocer_impl = OLD_E184_Grocer.impl;
