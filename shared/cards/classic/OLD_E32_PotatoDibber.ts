import { defineMinorCard } from '../card-source';
import type { CardImpl } from '../registry';
import { createEventQuery } from '../../events/query';
import type { PlantAdditionalGoodLocation } from '../../actions/effects/special-effect';
const CARD_ID = 'OLD_E32_PotatoDibber';
const cardImpl = { listeners: [{
            id: CARD_ID + '-sow', cardIds: [CARD_ID], actions: ['sow'], phases: ['after'], handler: context => {
                const sows = createEventQuery(context.actionEvents ?? []).filter('farm.sown').flatMap(e => e.sows).filter(s => s.crop === 'vegetable');
                const locations: PlantAdditionalGoodLocation[] = sows.flatMap<PlantAdditionalGoodLocation>(({ location }) => location.kind === 'field' ? [{
                        kind: 'field' as const, row: location.row, col: location.col
                    }] : location.kind === 'card' ? [{
                        kind: 'card-field' as const, cardId: location.cardId
                    }] : []);
                if (locations.length)
                    return {
                        sourceCard: CARD_ID, flow: {
                            type: 'leaf', actionId: 'special-effect', sourceCard: CARD_ID, params: {
                                kind: 'plant-additional-good', locations
                            }
                        }
                    };
            }
        }] } satisfies CardImpl;
export const OLD_E32_PotatoDibber = defineMinorCard({
    meta: {
        "id": "OLD_E32_PotatoDibber",
        "originalId": "E32_PotatoDibber",
        "gameEdition": "classic",
        "name": "土豆挖掘器",
        "deck": "E",
        "number": 32,
        "desc": [
            "每当你播种蔬菜时，在每块新播种的菜田上额外叠放1份蔬菜。"
        ],
        "cost": {
            "wood": 1
        },
        "vp": 0,
        "prerequisite": "",
        "passing": false,
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E32.png",
        "locales": {
            "zh": {
                "name": "土豆挖掘器",
                "desc": [
                    "每当你播种蔬菜时，在每块新播种的菜田上额外叠放1份蔬菜。"
                ],
                "prerequisite": ""
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E32_PotatoDibber_impl = OLD_E32_PotatoDibber.impl;
