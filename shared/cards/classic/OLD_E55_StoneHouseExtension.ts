import { defineMinorCard } from '../card-source';
import type { CardImpl } from '../registry';
const CARD_ID = 'OLD_E55_StoneHouseExtension';
const cardImpl = {
    prerequisiteCheck: player => player.houseType === 'stone', effect: {
        id: CARD_ID, onBuy: () => ({
            type: 'leaf', actionId: 'construct', sourceCard: CARD_ID, actionContext: {
                max: 1, exactCost: { max: 1 }
            }
        })
    }
} satisfies CardImpl;
export const OLD_E55_StoneHouseExtension = defineMinorCard({
    meta: {
        "id": "OLD_E55_StoneHouseExtension",
        "originalId": "E55_StoneHouseExtension",
        "gameEdition": "classic",
        "name": "扩建石屋",
        "deck": "E",
        "number": 55,
        "desc": [
            "立即免费扩建1间石屋。使用后请将此卡交给下家，此卡将加入他的手牌。"
        ],
        "cost": {
            "reed": 1,
            "stone": 3
        },
        "vp": 0,
        "prerequisite": "石屋阶段",
        "passing": true,
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E55.png",
        "locales": {
            "zh": {
                "name": "扩建石屋",
                "desc": [
                    "立即免费扩建1间石屋。使用后请将此卡交给下家，此卡将加入他的手牌。"
                ],
                "prerequisite": "石屋阶段"
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E55_StoneHouseExtension_impl = OLD_E55_StoneHouseExtension.impl;
