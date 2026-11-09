import { defineOccupationCard } from '../card-source';
import type { CardListenerRegistration, CardListenerContext } from '../card-listeners';
import type { ActionHookResult } from '../../actions/hooks';
import { getPlowableTiles } from '../../actions/effects/plow';
import { payLeaf } from '../helpers/pay-gain-node';
import type { CardImpl } from '../registry';
const CARD_ID = 'OLD_E195_PloughMaker';
const listener: CardListenerRegistration = {
    id: 'OLD_E195_PloughMaker-plow-maker-before-place-farmer',
    cardIds: [CARD_ID],
    phases: ['before'],
    actionSpaces: 'all',
    handler: (context: CardListenerContext): ActionHookResult | void => {
        const spaceId = context.space?.id;
        if (spaceId !== 'farmland' && spaceId !== 'cultivation')
            return;
        if (getPlowableTiles(context.player).length < 2)
            return;
        return {
            flow: {
                type: 'seq',
                optional: true,
                children: [
                    payLeaf({
                        cardId: CARD_ID, cost: { food: 1 }
                    }),
                    {
                        type: 'leaf', actionId: 'plow', sourceCard: CARD_ID
                    },
                ],
            },
            sourceCard: CARD_ID,
        };
    },
};
const cardImpl = {
    listeners: [listener],
    reaches: [] as readonly string[],
} satisfies CardImpl;
export const OLD_E195_PloughMaker = defineOccupationCard({
    meta: {
        "id": "OLD_E195_PloughMaker",
        "name": "制犁工",
        "deck": "E",
        "number": 195,
        "category": "FARM_PLANNER",
        "desc": [
            "每当你使用犁田/粮食耕种[犁播]行动格时，你可以花费1份食物额外犁1块田。"
        ],
        "cost": {},
        "players": "3+",
        "originalId": "E195_PloughMaker",
        "gameEdition": "classic",
        "vp": 0,
        "prerequisite": "",
        "passing": false,
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E195.png",
        "locales": {
            "zh": {
                "name": "制犁工",
                "desc": [
                    "每当你使用犁田/粮食耕种[犁播]行动格时，你可以花费1份食物额外犁1块田。"
                ],
                "prerequisite": ""
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E195_PloughMaker_impl = OLD_E195_PloughMaker.impl;
