import type { GameState } from "../../contract/types";
import type { CardImpl } from "../registry";
import { getCardDefinition } from "../catalog";
import { getCardStack, pushToCardStack, readCardExtraData } from "./card-state";
export const classicPlowUseTaken = (state: GameState, useId: string): boolean =>
  state.players.some((player) =>
    player.minorPlayed.some(
      (id) =>
        getCardDefinition(id)?.plowEffect &&
        readCardExtraData(player, id, "plowUse") === useId,
    ),
  );
/** Old plows spend a whole use (two extra fields), and cannot combine on one visit. */
export const classicPlow = (
  cardId: string,
  uses: number,
  extraFields = 2,
  spaces = ["farmland", "cultivation"],
): CardImpl => ({
  effect: {
    id: cardId,
    onBuy: (_state, player) => {
      pushToCardStack(player, cardId, Array(uses * extraFields).fill("field"));
    },
  },
  listeners: [
    {
      id: cardId + "-plow",
      cardIds: [cardId],
      actionSpaces: spaces,
      phases: ["before"],
      handler: (context) => {
        const useId = context.actionSpaceUse?.useId;
        if (!useId || getCardStack(context.player, cardId).length < extraFields)
          return;
        if (classicPlowUseTaken(context.state, useId)) return;
        return {
          sourceCard: cardId,
          flow: {
            type: "seq",
            optional: true,
            children: [
              {
                type: "leaf",
                actionId: "special-effect",
                sourceCard: cardId,
                params: {
                  kind: "set-extra-data",
                  key: "plowUse",
                  value: useId,
                },
              },
              ...Array.from({ length: extraFields }, () => ({
                type: "leaf" as const,
                actionId: "pop-card-stack",
                sourceCard: cardId,
              })),
              ...Array.from({ length: extraFields }, (_, i) => ({
                type: "leaf" as const,
                actionId: "plow",
                sourceCard: cardId,
                optional: i > 0,
              })),
            ],
          },
        };
      },
    },
  ],
});
