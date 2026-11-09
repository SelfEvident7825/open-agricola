import { defineMinorCard } from '../card-source';
import type { CardListenerRegistration, CardListenerContext } from '../card-listeners';
import type { ActionHookResult } from '../../actions/hooks';
import { gainLeaf } from '../helpers/pay-gain-node';
import type { CardImpl } from '../registry';
const CARD_ID = 'OLD_E35_CornScoop';
const listener: CardListenerRegistration = {
    id: 'OLD_E35_CornScoop-corn-scoop-before-place-farmer',
    cardIds: [CARD_ID],
    phases: ['before'],
    actionSpaces: 'all',
    handler: (context: CardListenerContext): ActionHookResult | void => {
        if (!context.space || context.space.id !== 'grain-seeds')
            return;
        return {
            flow: gainLeaf(CARD_ID, { grain: 1 }), sourceCard: CARD_ID
        };
    },
};
const cardImpl = {
    listeners: [listener],
    reaches: [] as readonly string[],
} satisfies CardImpl;
export const OLD_E35_CornScoop = defineMinorCard({
    meta: {
        "id": "OLD_E35_CornScoop",
        "name": "谷物铲",
        "deck": "E",
        "number": 35,
        "category": "CROP_PROVIDER",
        "desc": [
            "每当你使用小麦种子行动格时，额外获得1份小麦。"
        ],
        "cost": {
            "wood": 1
        },
        "originalId": "E35_CornScoop",
        "gameEdition": "classic",
        "vp": 0,
        "prerequisite": "",
        "passing": false,
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E35.png",
        "locales": {
            "zh": {
                "name": "谷物铲",
                "desc": [
                    "每当你使用小麦种子行动格时，额外获得1份小麦。"
                ],
                "prerequisite": ""
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E35_CornScoop_impl = OLD_E35_CornScoop.impl;
