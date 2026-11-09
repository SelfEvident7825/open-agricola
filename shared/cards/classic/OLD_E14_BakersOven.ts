import { defineMinorCard } from '../card-source';
import type { CardImpl } from '../registry';
const CARD_ID = 'OLD_E14_BakersOven';
const cardImpl = {
    reaches: ['OLD_E27_WoodredOven', 'OLD_G065_BeehiveOven', 'OLD_G073_ErrantOven', 'OLD_WA012_CastironOven'] as readonly string[], effect: {
        id: CARD_ID, onBuy: () => ({
            type: 'leaf', actionId: 'bake-bread', sourceCard: CARD_ID, optional: true
        })
    }
} satisfies CardImpl;
export const OLD_E14_BakersOven = defineMinorCard({
    meta: {
        "id": "OLD_E14_BakersOven",
        "originalId": "E14_BakersOven",
        "gameEdition": "classic",
        "name": "烘焙师烤炉",
        "deck": "E",
        "number": 14,
        "desc": [
            "打出此卡时，你获得1次“烤面包”行动。每次你执行“烤面包”行动时，你可以将至多2份小麦各转换成5份食物。"
        ],
        "cost": {},
        "vp": 3,
        "prerequisite": "退还1个烤炉",
        "passing": false,
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E14.png",
        "locales": {
            "zh": {
                "name": "烘焙师烤炉",
                "desc": [
                    "打出此卡时，你获得1次“烤面包”行动。每次你执行“烤面包”行动时，你可以将至多2份小麦各转换成5份食物。"
                ],
                "prerequisite": "退还1个烤炉"
            }
        },
        "isBaking": true,
        "ovenIdentity": true,
        "returnCards": [
            "Major_ClayOven",
            "Major_StoneOven",
            "OLD_E27_WoodredOven",
            "OLD_WA012_CastironOven",
            "OLD_G065_BeehiveOven",
            "OLD_G073_ErrantOven"
        ],
        "exchanges": [
            {
                "from": {
                    "grain": 1
                },
                "to": {
                    "food": 5
                },
                "triggers": [
                    "bake-bread"
                ],
                "max": 2
            }
        ]
    },
    impl: cardImpl,
});
export const OLD_E14_BakersOven_impl = OLD_E14_BakersOven.impl;
