import { defineOccupationCard } from '../card-source';
import type { CardImpl } from '../registry';
import { gainLeaf } from '../helpers/pay-gain-node';
const CARD_ID = 'OLD_E147_LandAgent';
const cardImpl = {
    effect: {
        id: CARD_ID, onBuy: () => gainLeaf(CARD_ID, { vegetable: 1 })
    }, listeners: [{
            id: CARD_ID + '-vegetable-seeds', cardIds: [CARD_ID], actionSpaces: ['vegetable-seeds'], phases: ['before'], handler: () => ({
                sourceCard: CARD_ID, flow: gainLeaf(CARD_ID, { grain: 1 })
            })
        }]
} satisfies CardImpl;
export const OLD_E147_LandAgent = defineOccupationCard({
    meta: {
        "id": "OLD_E147_LandAgent",
        "originalId": "E147_LandAgent",
        "gameEdition": "classic",
        "name": "地皮商",
        "deck": "E",
        "number": 147,
        "desc": [
            "打出此卡时，你获得1份蔬菜。每当你使用蔬菜种子行动格时，额外获得1份小麦。"
        ],
        "cost": {},
        "vp": 0,
        "prerequisite": "",
        "players": "1+",
        "passing": false,
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E147.png",
        "locales": {
            "zh": {
                "name": "地皮商",
                "desc": [
                    "打出此卡时，你获得1份蔬菜。每当你使用蔬菜种子行动格时，额外获得1份小麦。"
                ],
                "prerequisite": ""
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E147_LandAgent_impl = OLD_E147_LandAgent.impl;
