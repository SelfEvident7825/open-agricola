import { definePlayerActionCard } from "../card-source";
import type { CardImpl } from "../registry";
import {
  registerPlayerActionSpace,
  createPlayerActionSpaces,
  definePlayerActionSpaceFlow,
} from "../player-action-space";
const CARD_ID = "OLD_I230_ClayDigger";

const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state) => {
      for (const space of createPlayerActionSpaces(state)) {
        if (!state.actionSpaces.some((s) => s.id === space.id)) {
          state.actionSpaces.push(space);
          if (space.id === CARD_ID) space.resources.clay = 3;
        }
      }
    },
  },
} satisfies CardImpl;
export const OLD_I230_ClayDigger = definePlayerActionCard({
  meta: {
    id: "OLD_I230_ClayDigger",
    originalId: "I230_ClayDigger",
    gameEdition: "classic",
    name: "挖土工",
    deck: "I",
    number: 230,
    desc: [
      "本卡将作为额外的窑洞行动格3人游戏中[1砖积累行动格]。打出此卡时，立即在此卡上补充3砖。从下回合开始，每回合将积累1个砖头放在此卡上。其他玩家使用此行动格前，必须先付给你3份食物。",
    ],
    cost: {},
    vp: 0,
    prerequisite: "",
    players: "4+",
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: "/card-art/classic/I230.png",
    locales: {
      zh: {
        name: "挖土工",
        desc: [
          "本卡将作为额外的窑洞行动格3人游戏中[1砖积累行动格]。打出此卡时，立即在此卡上补充3砖。从下回合开始，每回合将积累1个砖头放在此卡上。其他玩家使用此行动格前，必须先付给你3份食物。",
        ],
        prerequisite: "",
      },
    },
    playerActionCardType: "occupation",
  },
  impl: cardImpl,
});
export const OLD_I230_ClayDigger_impl = OLD_I230_ClayDigger.impl;
registerPlayerActionSpace({
  cardId: CARD_ID,
  access: "all",
  gainPerRound: { clay: 1 },
  createDefinition: (ownerId) =>
    definePlayerActionSpaceFlow({
      id: CARD_ID,
      nameKey: "cards." + CARD_ID + ".name",
      descriptionKey: "cards." + CARD_ID + ".desc",
      canBeExecutedByPlayer: (_state, player) =>
        player.id === ownerId || player.resources.food >= 3,
      flowFactory: ({ player }) =>
        player.id === ownerId
          ? { type: "leaf" as const, actionId: "collect" }
          : {
              type: "seq",
              children: [
                {
                  type: "leaf",
                  actionId: "gain",
                  sourceCard: CARD_ID,
                  params: {
                    food: 3,
                    payerId: player.id,
                    recipientPlayerId: ownerId,
                  },
                },
                { type: "leaf" as const, actionId: "collect" },
              ],
            },
    }),
});
