import { defineMinorCard } from '../card-source';
import type { CardImpl } from '../registry';
const CARD_ID = 'OLD_E11_Field';
const cardImpl = {
    effect: {
        id: CARD_ID,
        onBuy: () => ({
            type: 'leaf' as const,
            actionId: 'plow',
            sourceCard: CARD_ID,
            optional: true,
        }),
    },
    reaches: [] as readonly string[],
} satisfies CardImpl;
export const OLD_E11_Field = defineMinorCard({
    meta: {
        "id": "OLD_E11_Field",
        "name": "走耕",
        "deck": "E",
        "number": 11,
        "category": "FARM_PLANNER",
        "desc": [
            "立即犁1块田。使用后请将此卡交给下家，此卡将加入他的手牌。"
        ],
        "cost": {
            "food": 1
        },
        "passing": true,
        "originalId": "E11_Field",
        "gameEdition": "classic",
        "vp": 0,
        "prerequisite": "",
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E11.png",
        "locales": {
            "zh": {
                "name": "走耕",
                "desc": [
                    "立即犁1块田。使用后请将此卡交给下家，此卡将加入他的手牌。"
                ],
                "prerequisite": ""
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E11_Field_impl = OLD_E11_Field.impl;
