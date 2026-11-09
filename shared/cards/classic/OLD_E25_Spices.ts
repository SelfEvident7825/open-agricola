import { defineMinorCard } from '../card-source';
import type { CardImpl } from '../registry';
import { gainLeaf } from '../helpers/pay-gain-node';
import { createEventQuery } from '../../events/query';
import { getCardDefinition } from '../catalog';
const CARD_ID = 'OLD_E25_Spices';
const cardImpl = { listeners: [{
            id: CARD_ID + '-vegetable-cooking', cardIds: [CARD_ID], actions: ['exchange'], phases: ['after'], handler: context => {
                const food = createEventQuery(context.actionEvents ?? []).filter('resource.exchanged', e => (e.gained.food ?? 0) > 0 && !!getCardDefinition(e.exchangeSource ?? '')?.isCookery).reduce((n, e) => n + (e.paid.vegetable ?? 0), 0);
                if (food)
                    return {
                        sourceCard: CARD_ID, flow: gainLeaf(CARD_ID, { food })
                    };
            }
        }] } satisfies CardImpl;
export const OLD_E25_Spices = defineMinorCard({
    meta: {
        "id": "OLD_E25_Spices",
        "originalId": "E25_Spices",
        "gameEdition": "classic",
        "name": "调味料",
        "deck": "E",
        "number": 25,
        "desc": [
            "每当你使用A3/A4/E128壁炉、A1/A2火炉、E20简易火炉、I85烹饪角将蔬菜转换成食物时，每份蔬菜都额外获得1份食物。"
        ],
        "cost": {},
        "vp": 0,
        "prerequisite": "",
        "passing": false,
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E25.png",
        "locales": {
            "zh": {
                "name": "调味料",
                "desc": [
                    "每当你使用A3/A4/E128壁炉、A1/A2火炉、E20简易火炉、I85烹饪角将蔬菜转换成食物时，每份蔬菜都额外获得1份食物。"
                ],
                "prerequisite": ""
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E25_Spices_impl = OLD_E25_Spices.impl;
