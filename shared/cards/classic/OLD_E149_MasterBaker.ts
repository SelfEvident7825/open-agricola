import { defineOccupationCard } from '../card-source';
import type { CardImpl } from '../registry';
import { gainLeaf } from '../helpers/pay-gain-node';
import { createEventQuery } from '../../events/query';
import { getCardDefinition } from '../catalog';
const CARD_ID = 'OLD_E149_MasterBaker';
const cardImpl = { listeners: [{
            id: CARD_ID + '-bake', cardIds: [CARD_ID], actions: ['bake-bread'], phases: ['after'], scope: 'any', handler: context => {
                const baked = createEventQuery(context.actionEvents ?? []).filter('resource.exchanged', e => (e.paid.grain ?? 0) > 0).length > 0;
                if (!baked)
                    return;
                const owner = context.ownerPlayer ?? context.player;
                if (owner.id === context.player.id) {
                    if (context.sourceCard === CARD_ID)
                        return;
                    return {
                        sourceCard: CARD_ID, flow: gainLeaf(CARD_ID, { food: 1 })
                    };
                }
                if (![...owner.improvements, ...owner.minorPlayed].some(id => getCardDefinition(id)?.isBaking))
                    return;
                return {
                    sourceCard: CARD_ID, flow: {
                        type: 'leaf', actionId: 'bake-bread', sourceCard: CARD_ID, optional: true
                    }
                };
            }
        }] } satisfies CardImpl;
export const OLD_E149_MasterBaker = defineOccupationCard({
    meta: {
        "id": "OLD_E149_MasterBaker",
        "originalId": "E149_MasterBaker",
        "gameEdition": "classic",
        "name": "高级烘焙师",
        "deck": "E",
        "number": 149,
        "desc": [
            "每当有其他玩家执行\"烤面包\"行动时，如果你有<BAKE>符号发展卡，你获得1次\"烤面包\"行动。如果你自己执行了1次\"烤面包\"行动（没有使用此卡），你额外获得1份食物。"
        ],
        "cost": {},
        "vp": 0,
        "prerequisite": "",
        "players": "1+",
        "passing": false,
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E149.png",
        "locales": {
            "zh": {
                "name": "高级烘焙师",
                "desc": [
                    "每当有其他玩家执行\"烤面包\"行动时，如果你有<BAKE>符号发展卡，你获得1次\"烤面包\"行动。如果你自己执行了1次\"烤面包\"行动（没有使用此卡），你额外获得1份食物。"
                ],
                "prerequisite": ""
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E149_MasterBaker_impl = OLD_E149_MasterBaker.impl;
