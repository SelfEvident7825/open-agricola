import type { CardImpl } from '../registry';
import { getCardDefinition } from '../catalog';
import { getCardStack, pushToCardStack, readCardExtraData } from './card-state';
/** Old plows spend a whole use (two extra fields), and cannot combine on one visit. */
export const classicPlow = (cardId: string, uses: number): CardImpl => ({
    effect: {
        id: cardId, onBuy: (_state, player) => { pushToCardStack(player, cardId, Array(uses * 2).fill('field')); }
    },
    listeners: [{
            id: cardId + '-plow', cardIds: [cardId], actionSpaces: ['farmland', 'cultivation'], phases: ['before'],
            handler: context => {
                const useId = context.actionSpaceUse?.useId;
                if (!useId || getCardStack(context.player, cardId).length < 2)
                    return;
                if (context.player.minorPlayed.some(id => getCardDefinition(id)?.plowEffect && readCardExtraData(context.player, id, 'plowUse') === useId))
                    return;
                return {
                    sourceCard: cardId, flow: {
                        type: 'seq', optional: true, children: [
                            {
                                type: 'leaf', actionId: 'special-effect', sourceCard: cardId, params: {
                                    kind: 'set-extra-data', key: 'plowUse', value: useId
                                }
                            },
                            {
                                type: 'leaf', actionId: 'pop-card-stack', sourceCard: cardId
                            },
                            {
                                type: 'leaf', actionId: 'pop-card-stack', sourceCard: cardId
                            },
                            {
                                type: 'leaf', actionId: 'plow', sourceCard: cardId
                            },
                            {
                                type: 'leaf', actionId: 'plow', sourceCard: cardId, optional: true
                            },
                        ]
                    }
                };
            },
        }],
});
