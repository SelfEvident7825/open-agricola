import { defineOccupationCard } from '../card-source';
import type { CardImpl } from '../registry';
import { gainLeaf } from '../helpers/pay-gain-node';
import { createEventQuery } from '../../events/query';
const CARD_ID = 'OLD_E188_ClayMixer';
const cardImpl = { listeners: [{
            id: CARD_ID + '-collect', cardIds: [CARD_ID], actionSpaces: 'all', phases: ['after'], handler: context => {
                const taken = createEventQuery(context.actionEvents ?? []).filter('resource.moved', e => e.from.kind === 'actionSpace' && e.to.kind === 'player' && e.to.playerId === context.player.id);
                if (!taken.some(e => (e.resources.clay ?? 0) > 0) || taken.some(e => Object.entries(e.resources).some(([key, amount]) => key !== 'clay' && (amount ?? 0) > 0)))
                    return;
                return {
                    sourceCard: CARD_ID, flow: gainLeaf(CARD_ID, { clay: 2 })
                };
            }
        }] } satisfies CardImpl;
export const OLD_E188_ClayMixer = defineOccupationCard({
    meta: {
        "id": "OLD_E188_ClayMixer",
        "originalId": "E188_ClayMixer",
        "gameEdition": "classic",
        "name": "和泥匠",
        "deck": "E",
        "number": 188,
        "desc": [
            "每当你从行动格上只获得了砖头时，额外获得2个砖头。（通过卡牌获得的砖头不算）"
        ],
        "cost": {},
        "vp": 0,
        "prerequisite": "",
        "players": "3+",
        "passing": false,
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E188.png",
        "locales": {
            "zh": {
                "name": "和泥匠",
                "desc": [
                    "每当你从行动格上只获得了砖头时，额外获得2个砖头。（通过卡牌获得的砖头不算）"
                ],
                "prerequisite": ""
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E188_ClayMixer_impl = OLD_E188_ClayMixer.impl;
