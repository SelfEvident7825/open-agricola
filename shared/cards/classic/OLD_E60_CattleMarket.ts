import { defineMinorCard } from '../card-source';
import type { CardImpl } from '../registry';
const CARD_ID = 'OLD_E60_CattleMarket';
const cardImpl = {
    effect: {
        id: CARD_ID,
        onBuy: () => ({
            type: 'leaf' as const,
            actionId: 'gain',
            sourceCard: CARD_ID,
            params: { cattle: 1 },
        }),
    },
    reaches: [] as readonly string[],
} satisfies CardImpl;
export const OLD_E60_CattleMarket = defineMinorCard({
    meta: {
        "id": "OLD_E60_CattleMarket",
        "name": "牛市",
        "deck": "E",
        "number": 60,
        "category": "LIVESTOCK_PROVIDER",
        "desc": [
            "立即获得1头牛。使用后请将此卡交给下家，此卡将加入他的手牌。"
        ],
        "cost": {
            "sheep": 1
        },
        "passing": true,
        "originalId": "E60_CattleMarket",
        "gameEdition": "classic",
        "vp": 0,
        "prerequisite": "",
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E60.png",
        "locales": {
            "zh": {
                "name": "牛市",
                "desc": [
                    "立即获得1头牛。使用后请将此卡交给下家，此卡将加入他的手牌。"
                ],
                "prerequisite": ""
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E60_CattleMarket_impl = OLD_E60_CattleMarket.impl;
