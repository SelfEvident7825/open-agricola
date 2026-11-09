import { definePlayerActionCard } from "../card-source";
import type { CardImpl } from "../registry";
import {
  registerPlayerActionSpace,
  createPlayerActionSpaces,
  definePlayerActionSpaceFlow,
} from "../player-action-space";
import { gainLeaf, bonusVpLeaf } from "../helpers/pay-gain-node";
const CARD_ID = "OLD_I337_ClayDeposit";

const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state) => {
      for (const space of createPlayerActionSpaces(state)) {
        if (!state.actionSpaces.some((s) => s.id === space.id)) {
          state.actionSpaces.push(space);
        }
      }
    },
  },
} satisfies CardImpl;
export const OLD_I337_ClayDeposit = definePlayerActionCard({
  meta: {
    id: "OLD_I337_ClayDeposit",
    originalId: "I337_ClayDeposit",
    gameEdition: "classic",
    name: "黏土矿床",
    deck: "I",
    number: 337,
    desc: [
      "（+ ）此卡是所有玩家都能使用的额外行动格。其他玩家使用时必须先支付给你1份食物，然后获得5个砖头。你使用时获得5个砖头/2分。",
    ],
    cost: {},
    vp: 0,
    prerequisite: "3 Occupations",
    occupationPrerequisites: {
      min: 3,
    },
    passing: false,
    extraVp: true,
    implemented: true,
    artUrl: "/card-art/classic/I337.png",
    locales: {
      zh: {
        name: "黏土矿床",
        desc: [
          "（+ ）此卡是所有玩家都能使用的额外行动格。其他玩家使用时必须先支付给你1份食物，然后获得5个砖头。你使用时获得5个砖头/2分。",
        ],
        prerequisite: "职业×3",
      },
    },
    playerActionCardType: "minor",
  },
  impl: cardImpl,
});
export const OLD_I337_ClayDeposit_impl = OLD_I337_ClayDeposit.impl;
registerPlayerActionSpace({
  cardId: CARD_ID,
  access: "all",
  createDefinition: (ownerId) =>
    definePlayerActionSpaceFlow({
      id: CARD_ID,
      nameKey: "cards." + CARD_ID + ".name",
      descriptionKey: "cards." + CARD_ID + ".desc",
      canBeExecutedByPlayer: (_state, player) =>
        player.id === ownerId || player.resources.food >= 1,
      flowFactory: ({ player }) =>
        player.id === ownerId
          ? {
              type: "or" as const,
              children: [
                gainLeaf(CARD_ID, { clay: 5 }),
                bonusVpLeaf(CARD_ID, 2),
              ],
            }
          : {
              type: "seq",
              children: [
                {
                  type: "leaf",
                  actionId: "gain",
                  sourceCard: CARD_ID,
                  params: {
                    food: 1,
                    payerId: player.id,
                    recipientPlayerId: ownerId,
                  },
                },
                gainLeaf(CARD_ID, { clay: 5 }),
              ],
            },
    }),
});
