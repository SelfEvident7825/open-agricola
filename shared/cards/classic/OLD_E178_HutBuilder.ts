import { defineOccupationCard } from '../card-source';
import type { CardImpl } from '../registry';
import { readCardExtraData, writeCardExtraData } from '../helpers/card-state';
const CARD_ID = 'OLD_E178_HutBuilder';
const cardImpl = { effect: {
        id: CARD_ID, onBuy: (_state, player) => { writeCardExtraData(player, CARD_ID, 'eligible', _state.round <= 4); }, onRoundStart: (state, player) => {
            if (state.round !== 11 || player.houseType === 'stone' || readCardExtraData(player, CARD_ID, 'used') || !readCardExtraData(player, CARD_ID, 'eligible'))
                return;
            return {
                type: 'seq', optional: true, children: [{
                        type: 'leaf', actionId: 'construct', sourceCard: CARD_ID, actionContext: {
                            max: 1, exactCost: { max: 1 }
                        }
                    }, {
                        type: 'leaf', actionId: 'special-effect', sourceCard: CARD_ID, params: {
                            kind: 'set-extra-data', key: 'used', value: true
                        }
                    }]
            };
        }
    } } satisfies CardImpl;
export const OLD_E178_HutBuilder = defineOccupationCard({
    meta: {
        "id": "OLD_E178_HutBuilder",
        "originalId": "E178_HutBuilder",
        "gameEdition": "classic",
        "name": "小屋建造工",
        "deck": "E",
        "number": 178,
        "desc": [
            "若你在第1-4回合打出此卡，第11回合开始时，你的房屋等级是木屋/砖屋，则你可以免费扩建 1间房屋。"
        ],
        "cost": {},
        "vp": 0,
        "prerequisite": "",
        "players": "4+",
        "passing": false,
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E178.png",
        "locales": {
            "zh": {
                "name": "小屋建造工",
                "desc": [
                    "若你在第1-4回合打出此卡，第11回合开始时，你的房屋等级是木屋/砖屋，则你可以免费扩建 1间房屋。"
                ],
                "prerequisite": ""
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E178_HutBuilder_impl = OLD_E178_HutBuilder.impl;
