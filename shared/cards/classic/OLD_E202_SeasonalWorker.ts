import { defineOccupationCard } from '../card-source';
import type { CardListenerRegistration, CardListenerContext } from '../card-listeners';
import type { ActionHookResult } from '../../actions/hooks';
import { gainLeaf } from '../helpers/pay-gain-node';
import type { CardImpl } from '../registry';
const CARD_ID = 'OLD_E202_SeasonalWorker';
const listener: CardListenerRegistration = {
    id: 'OLD_E202_SeasonalWorker-seasonal-worker-before-place-farmer',
    cardIds: [CARD_ID],
    phases: ['before'],
    actionSpaces: 'all',
    handler: (context: CardListenerContext): ActionHookResult | void => {
        if (!context.space || context.space.id !== 'day-laborer')
            return;
        if (context.state.round < 6) {
            return {
                flow: gainLeaf(CARD_ID, { grain: 1 }), sourceCard: CARD_ID
            };
        }
        return {
            flow: {
                type: 'xor',
                children: [
                    gainLeaf(CARD_ID, { grain: 1 }),
                    gainLeaf(CARD_ID, { vegetable: 1 }),
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
export const OLD_E202_SeasonalWorker = defineOccupationCard({
    meta: {
        "id": "OLD_E202_SeasonalWorker",
        "name": "季节工",
        "deck": "E",
        "number": 202,
        "category": "CROP_PROVIDER",
        "desc": [
            "每当你使用临时工行动格时，你额外获得1份小麦。第6回合起，改为额外获得1份小麦/1份蔬菜。"
        ],
        "cost": {},
        "players": "4+",
        "originalId": "E202_SeasonalWorker",
        "gameEdition": "classic",
        "vp": 0,
        "prerequisite": "",
        "passing": false,
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E202.png",
        "locales": {
            "zh": {
                "name": "季节工",
                "desc": [
                    "每当你使用临时工行动格时，你额外获得1份小麦。第6回合起，改为额外获得1份小麦/1份蔬菜。"
                ],
                "prerequisite": ""
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E202_SeasonalWorker_impl = OLD_E202_SeasonalWorker.impl;
