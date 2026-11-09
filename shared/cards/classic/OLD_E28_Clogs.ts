import { defineMinorCard } from '../card-source';
import type { CardImpl } from '../registry';
const CARD_ID = 'OLD_E28_Clogs';
const cardImpl = { effect: {
        id: CARD_ID, computeBonusScore: (_state, player, _ctx) => player.houseType === 'stone' ? 2 : player.houseType === 'clay' ? 1 : 0
    } } satisfies CardImpl;
export const OLD_E28_Clogs = defineMinorCard({
    meta: {
        "id": "OLD_E28_Clogs",
        "originalId": "E28_Clogs",
        "gameEdition": "classic",
        "name": "木靴",
        "deck": "E",
        "number": 28,
        "desc": [
            "游戏结束时，如果你的房屋等级是砖屋/石屋，你便额外获得1/2分。"
        ],
        "cost": {
            "wood": 1
        },
        "vp": 0,
        "prerequisite": "",
        "passing": false,
        "extraVp": true,
        "implemented": true,
        "artUrl": "/card-art/classic/E28.png",
        "locales": {
            "zh": {
                "name": "木靴",
                "desc": [
                    "游戏结束时，如果你的房屋等级是砖屋/石屋，你便额外获得1/2分。"
                ],
                "prerequisite": ""
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E28_Clogs_impl = OLD_E28_Clogs.impl;
