import { defineMinorCard } from '../card-source';
import type { CardListenerContext, CardListenerRegistration } from '../card-listeners';
import type { ActionHookResult } from '../../actions/hooks';
import { gainLeaf } from '../helpers/pay-gain-node';
import type { CardImpl } from '../registry';
const CARD_ID = 'OLD_E56_StoneTongs';
/**
 * A80 Stone Tongs — Each time you use a stone accumulation space
 * (eastern-quarry or western-quarry), you get 1 additional stone.
 *
 */
const STONE_SPACES = ['eastern-quarry', 'western-quarry'];
const listener: CardListenerRegistration = {
    id: 'OLD_E56_StoneTongs-stone-tongs-before-stone',
    cardIds: [CARD_ID],
    actionSpaces: 'all',
    phases: ['before'],
    handler: (context: CardListenerContext): ActionHookResult | void => {
        if (!context.space || !STONE_SPACES.includes(context.space.id))
            return;
        return {
            flow: gainLeaf(CARD_ID, { stone: 1 }), sourceCard: CARD_ID
        };
    },
};
const cardImpl = {
    listeners: [listener],
    reaches: [] as readonly string[],
} satisfies CardImpl;
export const OLD_E56_StoneTongs = defineMinorCard({
    meta: {
        "id": "OLD_E56_StoneTongs",
        "name": "夹石钳",
        "deck": "E",
        "number": 56,
        "category": "BUILDING_RESOURCE_PROVIDER",
        "desc": [
            "每当你使用石头积累行动格时，额外获得1个石头。"
        ],
        "cost": {
            "wood": 1
        },
        "originalId": "E56_StoneTongs",
        "gameEdition": "classic",
        "vp": 0,
        "prerequisite": "",
        "passing": false,
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E56.png",
        "locales": {
            "zh": {
                "name": "夹石钳",
                "desc": [
                    "每当你使用石头积累行动格时，额外获得1个石头。"
                ],
                "prerequisite": ""
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E56_StoneTongs_impl = OLD_E56_StoneTongs.impl;
