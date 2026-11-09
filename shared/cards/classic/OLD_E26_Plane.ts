import { defineMinorCard } from '../card-source';
import type { CardImpl } from '../registry';
import { payLeaf, gainLeaf } from '../helpers/pay-gain-node';
import { createEventQuery } from '../../events/query';
const CARD_ID = 'OLD_E26_Plane';
const cardImpl = {
    reaches: ['OLD_I258_Cabinetmaker', 'OLD_K122_Sawmill'] as readonly string[], listeners: [{
            id: CARD_ID + '-joinery', cardIds: [CARD_ID], actions: ['exchange'], phases: ['after'], handler: context => {
                const count = createEventQuery(context.actionEvents ?? []).filter('resource.exchanged', e => ['Major_Joinery', 'Major_Joinery2', 'OLD_K122_Sawmill', 'OLD_I258_Cabinetmaker'].includes(e.exchangeSource ?? '') && (e.gained.food ?? 0) > 0).reduce((n, e) => n + (e.paid.wood ?? 0), 0);
                if (!count)
                    return;
                return {
                    sourceCard: CARD_ID, flow: {
                        type: 'seq', children: Array.from({ length: count }, () => ({
                            type: 'xor', children: [gainLeaf(CARD_ID, { food: 1 }), {
                                    type: 'seq', children: [payLeaf({
                                            cardId: CARD_ID, cost: { wood: 1 }
                                        }), gainLeaf(CARD_ID, { food: 2 })]
                                }]
                        }))
                    }
                };
            }
        }]
} satisfies CardImpl;
export const OLD_E26_Plane = defineMinorCard({
    meta: {
        "id": "OLD_E26_Plane",
        "originalId": "E26_Plane",
        "gameEdition": "classic",
        "name": "木工刨",
        "deck": "E",
        "number": 26,
        "desc": [
            "每当你使用A7家具工坊、K122大家具工坊、I258家具匠将1个木头转化成食物时，额外获得1份食物，或额外将1根木头转化成2份食物。"
        ],
        "cost": {
            "wood": 1
        },
        "vp": 0,
        "prerequisite": "",
        "passing": false,
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E26.png",
        "locales": {
            "zh": {
                "name": "木工刨",
                "desc": [
                    "每当你使用A7家具工坊、K122大家具工坊、I258家具匠将1个木头转化成食物时，额外获得1份食物，或额外将1根木头转化成2份食物。"
                ],
                "prerequisite": ""
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E26_Plane_impl = OLD_E26_Plane.impl;
