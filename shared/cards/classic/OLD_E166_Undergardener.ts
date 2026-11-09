import { defineOccupationCard } from '../card-source';
import type { CardImpl } from '../registry';
import { gainLeaf } from '../helpers/pay-gain-node';
const CARD_ID = 'OLD_E166_Undergardener';
const cardImpl = { listeners: [{
            id: CARD_ID + '-space', cardIds: [CARD_ID], actionSpaces: 'all', phases: ['before'], handler: context => {
                if (!(context.space?.id === 'day-laborer'))
                    return;
                return {
                    flow: gainLeaf(CARD_ID, { vegetable: 1 }), sourceCard: CARD_ID
                };
            }
        }] } satisfies CardImpl;
export const OLD_E166_Undergardener = defineOccupationCard({
    meta: {
        "id": "OLD_E166_Undergardener",
        "originalId": "E166_Undergardener",
        "gameEdition": "classic",
        "name": "花园工人",
        "deck": "E",
        "number": 166,
        "desc": [
            "每当你使用临时工行动格时，额外获得1份蔬菜。"
        ],
        "cost": {},
        "vp": 0,
        "prerequisite": "",
        "players": "1+",
        "passing": false,
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E166.png",
        "locales": {
            "zh": {
                "name": "花园工人",
                "desc": [
                    "每当你使用临时工行动格时，额外获得1份蔬菜。"
                ],
                "prerequisite": ""
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E166_Undergardener_impl = OLD_E166_Undergardener.impl;
