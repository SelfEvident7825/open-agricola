import { defineOccupationCard } from '../card-source';
import type { CardImpl } from '../registry';
import { getCardDefinition } from '../catalog';
const CARD_ID = 'OLD_E162_MeatSeller';
const cardImpl = { listeners: [{
            id: CARD_ID + '-cook', cardIds: [CARD_ID], actions: ['compute-exchanges'], phases: ['computeExchanges'], handler: ({ player, extraData }) => {
                if (!['anytime', 'harvest'].includes(String(extraData?.window)))
                    return;
                if (![...player.improvements, ...player.minorPlayed].some(id => getCardDefinition(id)?.ovenIdentity))
                    return;
                return {
                    sourceCard: CARD_ID, extraExchanges: [{
                            from: { sheep: 1 }, to: { food: 2 }, triggers: ['anytime']
                        }, {
                            from: { boar: 1 }, to: { food: 3 }, triggers: ['anytime']
                        }, {
                            from: { cattle: 1 }, to: { food: 4 }, triggers: ['anytime']
                        }]
                };
            }
        }] } satisfies CardImpl;
export const OLD_E162_MeatSeller = defineOccupationCard({
    meta: {
        "id": "OLD_E162_MeatSeller",
        "originalId": "E162_MeatSeller",
        "gameEdition": "classic",
        "name": "售肉商",
        "deck": "E",
        "number": 162,
        "desc": [
            "如果你拥有烤炉，你可以随时将动物转换成食物。每只羊2食物，每头猪3食物，每头牛4食物。"
        ],
        "cost": {},
        "vp": 0,
        "prerequisite": "",
        "players": "1+",
        "passing": false,
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E162.png",
        "locales": {
            "zh": {
                "name": "售肉商",
                "desc": [
                    "如果你拥有烤炉，你可以随时将动物转换成食物。每只羊2食物，每头猪3食物，每头牛4食物。"
                ],
                "prerequisite": ""
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E162_MeatSeller_impl = OLD_E162_MeatSeller.impl;
