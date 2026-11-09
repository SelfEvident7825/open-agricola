import { defineOccupationCard } from '../card-source';
import type { CardImpl } from '../registry';
const CARD_ID = 'OLD_E173_ChiefsDaughter';
const cardImpl = {
    reaches: ['OLD_E172_Chief'] as readonly string[], effect: {
        id: CARD_ID, computeBonusScore: (_state, player) => player.houseType === 'stone' ? 3 : player.houseType === 'clay' ? 1 : 0
    }, listeners: [{
            id: CARD_ID + '-chief', cardIds: [CARD_ID], actions: ['occupation'], phases: ['after'], scope: 'opponent', zones: ['hand'], handler: context => {
                if (context.choice !== 'OLD_E172_Chief')
                    return;
                return {
                    sourceCard: CARD_ID, flow: {
                        type: 'seq', optional: true, children: [{
                                type: 'leaf', actionId: 'occupation', sourceCard: CARD_ID, params: {
                                    exactCost: {}, allowedCards: [CARD_ID]
                                }
                            }]
                    }
                };
            }
        }]
} satisfies CardImpl;
export const OLD_E173_ChiefsDaughter = defineOccupationCard({
    meta: {
        "id": "OLD_E173_ChiefsDaughter",
        "originalId": "E173_ChiefsDaughter",
        "gameEdition": "classic",
        "name": "酋长女儿",
        "deck": "E",
        "number": 173,
        "desc": [
            "当其他玩家打出了E172酋长，你可以立即免费打出此卡。游戏结束时，若你的房屋等级是砖屋/石屋，额外获得1/3分。"
        ],
        "cost": {},
        "vp": 0,
        "prerequisite": "",
        "players": "1+",
        "passing": false,
        "extraVp": true,
        "implemented": true,
        "artUrl": "/card-art/classic/E173.png",
        "locales": {
            "zh": {
                "name": "酋长女儿",
                "desc": [
                    "当其他玩家打出了E172酋长，你可以立即免费打出此卡。游戏结束时，若你的房屋等级是砖屋/石屋，额外获得1/3分。"
                ],
                "prerequisite": ""
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E173_ChiefsDaughter_impl = OLD_E173_ChiefsDaughter.impl;
