import { defineMinorCard } from '../card-source';
import { makeCardFieldImpl } from '../helpers/card-field';
import { payLeaf, gainLeaf } from '../helpers/pay-gain-node';
import type { ActionFlow } from '../../contract/types';
const CARD_ID = 'OLD_E47_LettucePatch';
const convertVegetablesFlow = (amount: number): ActionFlow | undefined => {
    if (amount <= 0)
        return;
    const children = Array.from({ length: amount }, (_, index) => {
        const count = index + 1;
        return {
            type: 'seq' as const,
            children: [
                payLeaf({
                    cardId: CARD_ID, cost: { vegetable: count }
                }),
                gainLeaf(CARD_ID, { food: 4 * count }),
            ],
        };
    });
    return {
        type: 'xor',
        optional: true,
        children,
    };
};
const cardImpl = makeCardFieldImpl(CARD_ID, {
    allowedCrops: ['vegetable'], capacity: 1
}, {
    onReap: ({ crop, amount }) => crop === 'vegetable'
        ? convertVegetablesFlow(amount)
        : undefined,
});
export const OLD_E47_LettucePatch = defineMinorCard({
    meta: {
        "id": "OLD_E47_LettucePatch",
        "name": "莴苣田",
        "deck": "E",
        "number": 47,
        "category": "CROP_PROVIDER",
        "providesField": true,
        "vp": 1,
        "cost": {},
        "prerequisite": "3 Occupations",
        "occupationPrerequisites": {
            "min": 3
        },
        "isField": true,
        "cardField": {
            "allowedCrops": [
                "vegetable"
            ],
            "capacity": 1
        },
        "desc": [
            "此卡视为1块田地，但此卡只能种植蔬菜。从此卡上收割的每份蔬菜可以立即被转化成4份食物。"
        ],
        "originalId": "E47_LettucePatch",
        "gameEdition": "classic",
        "passing": false,
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E47.png",
        "locales": {
            "zh": {
                "name": "莴苣田",
                "desc": [
                    "此卡视为1块田地，但此卡只能种植蔬菜。从此卡上收割的每份蔬菜可以立即被转化成4份食物。"
                ],
                "prerequisite": "职业×3"
            }
        }
    },
    presentation: { cardFields: true },
    impl: cardImpl,
});
export const OLD_E47_LettucePatch_impl = OLD_E47_LettucePatch.impl;
