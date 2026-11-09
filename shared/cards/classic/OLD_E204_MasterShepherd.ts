import { defineOccupationCard } from '../card-source';
import type { CardImpl } from '../registry';
import { queueFutureMeeples, futureMeeplesNode } from '../../actions/effects/internal/future-meeples';
const CARD_ID = 'OLD_E204_MasterShepherd';
const cardImpl = { effect: {
        id: CARD_ID, onBuy: (state, player) => {
            const entries = ([state.round + 1, state.round + 2, state.round + 3]).filter(round => round > state.round && round <= 14).map(round => ({
                round, resources: { sheep: 1 }
            }));
            if (!entries.length)
                return;
            queueFutureMeeples(state, {
                cardId: CARD_ID, playerId: player.id, entries
            });
            return futureMeeplesNode();
        }
    } } satisfies CardImpl;
export const OLD_E204_MasterShepherd = defineOccupationCard({
    meta: {
        "id": "OLD_E204_MasterShepherd",
        "originalId": "E204_MasterShepherd",
        "gameEdition": "classic",
        "name": "牧羊人管理员",
        "deck": "E",
        "number": 204,
        "desc": [
            "在之后3个回合行动格上各放1只羊。这些回合开始时，你获得对应的羊。"
        ],
        "cost": {},
        "vp": 0,
        "prerequisite": "",
        "players": "4+",
        "passing": false,
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E204.png",
        "locales": {
            "zh": {
                "name": "牧羊人管理员",
                "desc": [
                    "在之后3个回合行动格上各放1只羊。这些回合开始时，你获得对应的羊。"
                ],
                "prerequisite": ""
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E204_MasterShepherd_impl = OLD_E204_MasterShepherd.impl;
