import { defineMinorCard } from '../card-source';
import type { CardImpl } from '../registry';
const CARD_ID = 'OLD_E38_MadonnaStatue';
const cardImpl = {
    prerequisiteCheck: player => player.improvements.length + player.minorPlayed.filter(id => id !== CARD_ID).length >= 2, effect: {
        id: CARD_ID, onBuy: (_state, player) => {
            const cards = [...player.improvements, ...player.minorPlayed].filter(id => id !== CARD_ID);
            return {
                type: 'xor', children: cards.flatMap((a, i) => cards.slice(i + 1).map(b => ({
                    type: 'seq' as const, children: [a, b].map(cardId => ({
                        type: 'leaf' as const, actionId: 'special-effect', sourceCard: CARD_ID, choiceLabelKey: 'cards.' + cardId + '.name', params: {
                            kind: 'return-card-to-board', cardId
                        }
                    }))
                })))
            };
        }
    }
} satisfies CardImpl;
export const OLD_E38_MadonnaStatue = defineMinorCard({
    meta: {
        "id": "OLD_E38_MadonnaStatue",
        "originalId": "E38_MadonnaStatue",
        "gameEdition": "classic",
        "name": "圣母像",
        "deck": "E",
        "number": 38,
        "desc": [
            "打出此卡时，你必须弃掉2张你已打出的发展卡。"
        ],
        "cost": {},
        "vp": 2,
        "prerequisite": "",
        "passing": false,
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E38.png",
        "locales": {
            "zh": {
                "name": "圣母像",
                "desc": [
                    "打出此卡时，你必须弃掉2张你已打出的发展卡。"
                ],
                "prerequisite": "见下文"
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E38_MadonnaStatue_impl = OLD_E38_MadonnaStatue.impl;
