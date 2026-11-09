import { defineMinorCard } from '../card-source';
import { queueFutureMeeples, futureMeeplesNode } from '../../actions/effects/internal/future-meeples';
import type { CardImpl } from '../registry';
const CARD_ID = 'OLD_E45_PrivateForest';
const cardImpl = {
    effect: {
        id: CARD_ID,
        onBuy: (state, player) => {
            const evenRounds = [2, 4, 6, 8, 10, 12, 14].filter((r) => r > state.round);
            if (evenRounds.length === 0)
                return;
            queueFutureMeeples(state, {
                cardId: CARD_ID,
                playerId: player.id,
                entries: evenRounds.map((round) => ({
                    round, resources: { wood: 1 }
                })),
            });
            return futureMeeplesNode();
        },
    },
    reaches: [] as readonly string[],
} satisfies CardImpl;
export const OLD_E45_PrivateForest = defineMinorCard({
    meta: {
        "id": "OLD_E45_PrivateForest",
        "name": "私有林地",
        "deck": "E",
        "number": 45,
        "category": "BUILDING_RESOURCE_PROVIDER",
        "desc": [
            "打出此卡时，在之后的每个偶数回合行动格上各放1根木头。这些回合开始时，你获得对应的木头。"
        ],
        "cost": {
            "food": 2
        },
        "prerequisite": "",
        "originalId": "E45_PrivateForest",
        "gameEdition": "classic",
        "vp": 0,
        "passing": false,
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E45.png",
        "locales": {
            "zh": {
                "name": "私有林地",
                "desc": [
                    "打出此卡时，在之后的每个偶数回合行动格上各放1根木头。这些回合开始时，你获得对应的木头。"
                ],
                "prerequisite": ""
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E45_PrivateForest_impl = OLD_E45_PrivateForest.impl;
