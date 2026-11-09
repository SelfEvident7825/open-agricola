import { defineMinorCard } from '../card-source';
import { gainLeaf } from '../helpers/pay-gain-node';
import { getAssignedAnimalsByType } from '../../domain/animals';
import type { CardImpl } from '../registry';
const CARD_ID = 'OLD_E53_ButterChurn';
const cardImpl = {
    effect: {
        id: CARD_ID,
        onHarvestFieldPhase: (state, player) => {
            const animals = getAssignedAnimalsByType(player, state);
            const gain = Math.floor(animals.sheep / 3) + Math.floor(animals.cattle / 2);
            if (gain <= 0)
                return;
            return gainLeaf(CARD_ID, { food: gain });
        },
    },
    reaches: [] as readonly string[],
} satisfies CardImpl;
export const OLD_E53_ButterChurn = defineMinorCard({
    meta: {
        "id": "OLD_E53_ButterChurn",
        "name": "黄油桶",
        "deck": "E",
        "number": 53,
        "category": "FOOD_PROVIDER",
        "desc": [
            "每个丰收时节的收割阶段，你每拥有3只羊/2头牛，便可额外获得1份食物。(卡牌提供的“收割阶段”不算，如：I92肥料)"
        ],
        "vp": 0,
        "cost": {
            "wood": 2
        },
        "prerequisite": "",
        "originalId": "E53_ButterChurn",
        "gameEdition": "classic",
        "passing": false,
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E53.png",
        "locales": {
            "zh": {
                "name": "黄油桶",
                "desc": [
                    "每个丰收时节的收割阶段，你每拥有3只羊/2头牛，便可额外获得1份食物。(卡牌提供的“收割阶段”不算，如：I92肥料)"
                ],
                "prerequisite": ""
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E53_ButterChurn_impl = OLD_E53_ButterChurn.impl;
