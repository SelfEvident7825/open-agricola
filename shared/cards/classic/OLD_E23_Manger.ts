import { defineMinorCard } from '../card-source';
import { getPastureSize } from '../../domain/pasture';
import type { CardImpl } from '../registry';
const CARD_ID = 'OLD_E23_Manger';
const cardImpl = {
    effect: {
        id: CARD_ID,
        computeBonusScore: (_state, player) => {
            const totalSize = player.pastures.reduce((sum, p) => sum + getPastureSize(p), 0);
            if (totalSize >= 9)
                return 4;
            if (totalSize >= 8)
                return 3;
            if (totalSize >= 7)
                return 2;
            if (totalSize >= 6)
                return 1;
            return 0;
        },
    },
    reaches: [] as readonly string[],
} satisfies CardImpl;
export const OLD_E23_Manger = defineMinorCard({
    meta: {
        "id": "OLD_E23_Manger",
        "name": "食槽",
        "deck": "E",
        "number": 23,
        "category": "POINTS_PROVIDER",
        "desc": [
            "游戏结束时，若你所有的圈地总计覆盖了6/7/8/9+农场格子，额外获得1/2/3/4分。"
        ],
        "cost": {
            "wood": 2
        },
        "extraVp": true,
        "originalId": "E23_Manger",
        "gameEdition": "classic",
        "vp": 0,
        "prerequisite": "",
        "passing": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E23.png",
        "locales": {
            "zh": {
                "name": "食槽",
                "desc": [
                    "游戏结束时，若你所有的圈地总计覆盖了6/7/8/9+农场格子，额外获得1/2/3/4分。"
                ],
                "prerequisite": ""
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E23_Manger_impl = OLD_E23_Manger.impl;
