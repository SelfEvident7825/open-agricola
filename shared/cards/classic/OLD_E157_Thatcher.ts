import { defineOccupationCard } from '../card-source';
import type { CardImpl } from '../registry';
const CARD_ID = 'OLD_E157_Thatcher';
const cardImpl = {
    reaches: ['OLD_E21_HalftimberedHouse', 'OLD_I103_WaterMill', 'OLD_I71_HolidayHouse', 'OLD_I84_ChickenCoop', 'OLD_I86_CornStorehouse', 'OLD_K144_Mansion'] as readonly string[], modifiers: [{
            type: 'trade', cardId: CARD_ID, appliesTo: ['construct'], scope: 'unit', from: {}, to: { reed: 1 }
        }, {
            type: 'bonus', cardId: CARD_ID, appliesTo: ['renovation'], discount: { reed: 1 }, optional: false
        }], listeners: [{
            id: CARD_ID + '-cost', cardIds: [CARD_ID], actions: ['improvement'], phases: ['computeCosts'], deriveCardCostCandidate: (context, candidate) => {
                if (!['OLD_E21_HalftimberedHouse', 'OLD_I71_HolidayHouse', 'OLD_I84_ChickenCoop', 'OLD_I86_CornStorehouse', 'OLD_I103_WaterMill', 'OLD_K144_Mansion'].includes(context.cardId ?? '') || candidate.sources.includes(CARD_ID) || (candidate.resources.reed ?? 0) < 1)
                    return null;
                return [{
                        resources: {
                            ...candidate.resources, reed: candidate.resources.reed! - 1
                        }, originalFeeIndex: candidate.originalFeeIndex, sources: [CARD_ID]
                    }];
            }
        }]
} satisfies CardImpl;
export const OLD_E157_Thatcher = defineOccupationCard({
    meta: {
        "id": "OLD_E157_Thatcher",
        "originalId": "E157_Thatcher",
        "gameEdition": "classic",
        "name": "盖顶工",
        "deck": "E",
        "number": 157,
        "desc": [
            "扩建每间房屋、翻修房屋和打出以下发展卡所需费用都减少1捆芦苇。E21半木梁房、I71度假屋、I84鸡舍、I86谷仓、I103水磨坊、K144豪宅。"
        ],
        "cost": {},
        "vp": 0,
        "prerequisite": "",
        "players": "1+",
        "passing": false,
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E157.png",
        "locales": {
            "zh": {
                "name": "盖顶工",
                "desc": [
                    "扩建每间房屋、翻修房屋和打出以下发展卡所需费用都减少1捆芦苇。E21半木梁房、I71度假屋、I84鸡舍、I86谷仓、I103水磨坊、K144豪宅。"
                ],
                "prerequisite": ""
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E157_Thatcher_impl = OLD_E157_Thatcher.impl;
