import { selectedRenovationTarget, sourcedMandatoryBonus } from '../helpers/renovation-cost';
import { defineOccupationCard } from '../card-source';
import type { CardImpl } from '../registry';
const CARD_ID = 'OLD_E199_Renovator';
const cardImpl = { listeners: [{
            id: CARD_ID + '-renovation-cost', cardIds: [CARD_ID], actions: ['renovate-house'], phases: ['computeCosts'],
            handler: context => { const target = selectedRenovationTarget(context); return target ? { bonuses: [sourcedMandatoryBonus(CARD_ID, { [target]: 2 })] } : undefined; }
        }] } satisfies CardImpl;
export const OLD_E199_Renovator = defineOccupationCard({
    meta: {
        "id": "OLD_E199_Renovator",
        "originalId": "E199_Renovator",
        "gameEdition": "classic",
        "name": "装修工",
        "deck": "E",
        "number": 199,
        "desc": [
            "你翻修成砖屋/石屋的费用减少2砖头/2石头。"
        ],
        "cost": {},
        "vp": 0,
        "prerequisite": "",
        "players": "4+",
        "passing": false,
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E199.png",
        "locales": {
            "zh": {
                "name": "装修工",
                "desc": [
                    "你翻修成砖屋/石屋的费用减少2砖头/2石头。"
                ],
                "prerequisite": ""
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E199_Renovator_impl = OLD_E199_Renovator.impl;
