import { defineOccupationCard } from '../card-source';
import type { CardListenerRegistration, CardListenerContext } from '../card-listeners';
import type { ActionHookPhase, ActionHookResult } from '../../actions/hooks';
import { isCardFlagged } from '../helpers/card-state';
import type { CardImpl } from '../registry';
const CARD_ID = 'OLD_E151_MasterBuilder';
const FREE_SINGLE_ROOM_CONTEXT = {
    maxRooms: 1,
    exactCost: { max: 1 },
    trueAction: false,
    cancelPolicy: 'forbidCancel',
};
const anytimeListener: CardListenerRegistration = {
    id: 'OLD_E151_MasterBuilder-master-builder-anytime',
    cardIds: [CARD_ID],
    actions: ['anytime'],
    phases: ['anytime' as ActionHookPhase],
    preScoring: true,
    handler: (context: CardListenerContext): ActionHookResult | void => {
        if (isCardFlagged(context.player, CARD_ID))
            return;
        if (context.player.rooms < 5)
            return;
        return {
            flow: {
                type: 'seq',
                children: [
                    {
                        type: 'leaf',
                        actionId: 'construct',
                        sourceCard: CARD_ID,
                        actionContext: FREE_SINGLE_ROOM_CONTEXT,
                    },
                    {
                        type: 'leaf', actionId: 'special-effect', sourceCard: CARD_ID, params: {
                            kind: 'set-flag', flag: true
                        }
                    },
                ],
            },
            sourceCard: CARD_ID,
        };
    },
};
const cardImpl = {
    listeners: [anytimeListener],
    reaches: [] as readonly string[],
} satisfies CardImpl;
export const OLD_E151_MasterBuilder = defineOccupationCard({
    meta: {
        "id": "OLD_E151_MasterBuilder",
        "name": "建筑大师",
        "deck": "E",
        "number": 151,
        "category": "FARM_PLANNER",
        "desc": [
            "限1次：一旦你拥有不少于5间房屋，你可以随时再免费扩建1间房屋。"
        ],
        "cost": {},
        "players": "1+",
        "implemented": true,
        "originalId": "E151_MasterBuilder",
        "gameEdition": "classic",
        "vp": 0,
        "prerequisite": "",
        "passing": false,
        "extraVp": false,
        "artUrl": "/card-art/classic/E151.png",
        "locales": {
            "zh": {
                "name": "建筑大师",
                "desc": [
                    "限1次：一旦你拥有不少于5间房屋，你可以随时再免费扩建1间房屋。"
                ],
                "prerequisite": ""
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E151_MasterBuilder_impl = OLD_E151_MasterBuilder.impl;
