import { defineOccupationCard } from '../card-source';
import { queueFutureMeeples, futureMeeplesNode } from '../../actions/effects/internal/future-meeples';
import type { CardImpl } from '../registry';
const CARD_ID = 'OLD_E201_CattleWhisperer';
const cardImpl = {
    effect: {
        id: CARD_ID,
        onBuy: (state, player) => {
            const offsets = [5, 9];
            const entries = offsets
                .map((offset) => ({
                round: state.round + offset, resources: { cattle: 1 }
            }))
                .filter((e) => e.round <= 14);
            if (entries.length === 0)
                return;
            queueFutureMeeples(state, {
                cardId: CARD_ID,
                playerId: player.id,
                entries,
            });
            return futureMeeplesNode();
        },
    },
    reaches: [] as readonly string[],
} satisfies CardImpl;
export const OLD_E201_CattleWhisperer = defineOccupationCard({
    meta: {
        "id": "OLD_E201_CattleWhisperer",
        "name": "驯牛人",
        "deck": "E",
        "number": 201,
        "category": "LIVESTOCK_PROVIDER",
        "desc": [
            "将当前回合数加5和9，在这些回合的行动格上各放1头牛。这些回合开始时，你获得对应的牛。"
        ],
        "players": "4+",
        "originalId": "E201_CattleWhisperer",
        "gameEdition": "classic",
        "cost": {},
        "vp": 0,
        "prerequisite": "",
        "passing": false,
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E201.png",
        "locales": {
            "zh": {
                "name": "驯牛人",
                "desc": [
                    "将当前回合数加5和9，在这些回合的行动格上各放1头牛。这些回合开始时，你获得对应的牛。"
                ],
                "prerequisite": ""
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E201_CattleWhisperer_impl = OLD_E201_CattleWhisperer.impl;
