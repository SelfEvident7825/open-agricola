import { defineOccupationCard } from '../card-source';
import type { CardListenerRegistration, CardListenerContext } from '../card-listeners';
import type { ActionHookPhase, ActionHookResult } from '../../actions/hooks';
import { gainLeaf } from '../helpers/pay-gain-node';
import { getActionStableConstructions } from '../helpers/construction-events';
import type { Resource } from '../../contract/types';
import type { CardImpl } from '../registry';
const CARD_ID = 'OLD_E213_Stockman';
const listener: CardListenerRegistration = {
    id: 'OLD_E213_Stockman-stockman-after-stables',
    cardIds: [CARD_ID],
    phases: ['after' as ActionHookPhase],
    actions: ['stables'],
    handler: (context: CardListenerContext): ActionHookResult | void => {
        const gains: Partial<Resource> = {};
        for (const { ordinal: i } of getActionStableConstructions(context)) {
            if (i === 2)
                gains.cattle = (gains.cattle ?? 0) + 1;
            if (i === 3)
                gains.boar = (gains.boar ?? 0) + 1;
            if (i === 4)
                gains.sheep = (gains.sheep ?? 0) + 1;
        }
        if (Object.keys(gains).length === 0)
            return;
        return {
            flow: gainLeaf(CARD_ID, gains), sourceCard: CARD_ID
        };
    },
};
const cardImpl = {
    listeners: [listener],
    reaches: [] as readonly string[],
} satisfies CardImpl;
export const OLD_E213_Stockman = defineOccupationCard({
    meta: {
        "id": "OLD_E213_Stockman",
        "name": "牲畜饲养员",
        "deck": "E",
        "number": 213,
        "category": "LIVESTOCK_PROVIDER",
        "desc": [
            "打出此卡后，每当你建造了第2/3/4个马厩时，你立即获得1头牛/1头猪/1只羊。动物可以立即被转换成食物，即使你没有饲养空间。"
        ],
        "cost": {},
        "players": "4+",
        "originalId": "E213_Stockman",
        "gameEdition": "classic",
        "vp": 0,
        "prerequisite": "",
        "passing": false,
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E213.png",
        "locales": {
            "zh": {
                "name": "牲畜饲养员",
                "desc": [
                    "打出此卡后，每当你建造了第2/3/4个马厩时，你立即获得1头牛/1头猪/1只羊。动物可以立即被转换成食物，即使你没有饲养空间。"
                ],
                "prerequisite": ""
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E213_Stockman_impl = OLD_E213_Stockman.impl;
