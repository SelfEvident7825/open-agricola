import { defineMinorCard } from '../card-source';
import type { CardImpl } from '../registry';
import { gainLeaf } from '../helpers/pay-gain-node';
const CARD_ID = 'OLD_E16_BuildingMaterial';
const cardImpl = { effect: {
        id: CARD_ID, onBuy: () => ({
            type: 'xor', children: [{ "wood": 1 }, { "clay": 1 }].map(resources => gainLeaf(CARD_ID, resources))
        })
    } } satisfies CardImpl;
export const OLD_E16_BuildingMaterial = defineMinorCard({
    meta: {
        "id": "OLD_E16_BuildingMaterial",
        "originalId": "E16_BuildingMaterial",
        "gameEdition": "classic",
        "name": "建筑材料",
        "deck": "E",
        "number": 16,
        "desc": [
            "立即获得1木/1砖。使用后请将此卡交给下家，此卡将加入他的手牌。"
        ],
        "cost": {},
        "vp": 0,
        "prerequisite": "",
        "passing": true,
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E16.png",
        "locales": {
            "zh": {
                "name": "建筑材料",
                "desc": [
                    "立即获得1木/1砖。使用后请将此卡交给下家，此卡将加入他的手牌。"
                ],
                "prerequisite": ""
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E16_BuildingMaterial_impl = OLD_E16_BuildingMaterial.impl;
