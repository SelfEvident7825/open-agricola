import { defineMinorCard } from '../card-source';
import { queueFutureMeeplesFlow } from '../../actions/effects/internal/future-meeples';
import type { CardImpl } from '../registry';
const CARD_ID = 'OLD_E48_ReedPond';
const cardImpl = {
    effect: {
        id: CARD_ID,
        onBuy: (state, player) => {
            // Place 1 reed on each of the next 3 round spaces
            const count = Math.min(3, 14 - state.round);
            if (count <= 0)
                return;
            return queueFutureMeeplesFlow(state, {
                cardId: CARD_ID,
                playerId: player.id,
                startRound: state.round + 1,
                count,
                resources: { reed: 1 },
            });
        },
    },
    reaches: [] as readonly string[],
} satisfies CardImpl;
export const OLD_E48_ReedPond = defineMinorCard({
    meta: {
        "id": "OLD_E48_ReedPond",
        "name": "芦苇塘",
        "deck": "E",
        "number": 48,
        "category": "BUILDING_RESOURCE_PROVIDER",
        "desc": [
            "打出此卡时，在之后的3个回合行动格上各放1捆芦苇。这些回合开始时，你获得对应的芦苇。"
        ],
        "cost": {},
        "prerequisite": "3 Occupations",
        "occupationPrerequisites": {
            "min": 3
        },
        "originalId": "E48_ReedPond",
        "gameEdition": "classic",
        "vp": 1,
        "passing": false,
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E48.png",
        "locales": {
            "zh": {
                "name": "芦苇塘",
                "desc": [
                    "打出此卡时，在之后的3个回合行动格上各放1捆芦苇。这些回合开始时，你获得对应的芦苇。"
                ],
                "prerequisite": "职业×3"
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E48_ReedPond_impl = OLD_E48_ReedPond.impl;
