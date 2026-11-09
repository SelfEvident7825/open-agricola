import { defineOccupationCard } from '../card-source';
import type { CardImpl } from '../registry';
import { payLeaf, gainLeaf } from '../helpers/pay-gain-node';
import { readCardExtraData } from '../helpers/card-state';
const CARD_ID = 'OLD_E215_TenantFarmer';
const cardImpl = { effect: {
        id: CARD_ID, onBuy: () => gainLeaf(CARD_ID, {
            sheep: 1, boar: 1, cattle: 1
        }), onBeforeEndGame: (_state, player) => {
            if (readCardExtraData(player, CARD_ID, 'settled'))
                return;
            return {
                type: 'seq', children: [...(['sheep', 'boar', 'cattle'] as const).map(animal => ({
                        type: 'xor' as const, children: [...(player.resources[animal] > 0 ? [payLeaf({
                                    cardId: CARD_ID, cost: { [animal]: 1 }
                                })] : []), {
                                type: 'leaf' as const, actionId: 'special-effect', sourceCard: CARD_ID, params: {
                                    kind: 'increment-counter', key: 'unreturned', amount: 1
                                }
                            }]
                    })), {
                        type: 'leaf', actionId: 'special-effect', sourceCard: CARD_ID, params: {
                            kind: 'set-extra-data', key: 'settled', value: true
                        }
                    }]
            };
        }, computeBonusScore: (_state, player) => -(player.cardStates[CARD_ID]?.counters?.unreturned ?? 0)
    } } satisfies CardImpl;
export const OLD_E215_TenantFarmer = defineOccupationCard({
    meta: {
        "id": "OLD_E215_TenantFarmer",
        "originalId": "E215_TenantFarmer",
        "gameEdition": "classic",
        "name": "动物租用人",
        "deck": "E",
        "number": 215,
        "desc": [
            "你立即获得3种动物各1只。计分阶段开始前，你必须退还3种动物各1只，否则每只不退还的动物使你-1分。动物可以立即被转换成食物，即使你没有饲养空间。"
        ],
        "cost": {},
        "vp": 0,
        "prerequisite": "",
        "players": "4+",
        "passing": false,
        "extraVp": true,
        "implemented": true,
        "artUrl": "/card-art/classic/E215.png",
        "locales": {
            "zh": {
                "name": "动物租用人",
                "desc": [
                    "你立即获得3种动物各1只。计分阶段开始前，你必须退还3种动物各1只，否则每只不退还的动物使你-1分。动物可以立即被转换成食物，即使你没有饲养空间。"
                ],
                "prerequisite": ""
            }
        }
    },
    presentation: { counters: ['unreturned'] },
    impl: cardImpl,
});
export const OLD_E215_TenantFarmer_impl = OLD_E215_TenantFarmer.impl;
