import { defineOccupationCard } from "../card-source";
import type { CardImpl } from "../registry";
import { gainLeaf } from "../helpers/pay-gain-node";
const CARD_ID = "OLD_I229_Sycophant";

const cardImpl = {
  effect: {
    id: CARD_ID,
    permitsActionSpaceEntry: (_state, owner, actor, spaceId) =>
      spaceId !== "grain-seeds" ||
      actor.id === owner.id ||
      actor.resources.food >= 1,
  },
  listeners: [
    {
      id: CARD_ID + "-tax",
      cardIds: [CARD_ID],
      actionSpaces: ["grain-seeds"],
      phases: ["before"],
      scope: "any",
      handler: (context) => {
        const owner = context.ownerPlayer ?? context.player;
        return {
          sourceCard: CARD_ID,
          flow: {
            type: "seq",
            children: [
              ...(owner.id === context.player.id
                ? []
                : [
                    {
                      type: "leaf" as const,
                      actionId: "gain",
                      sourceCard: CARD_ID,
                      params: {
                        food: 1,
                        payerId: context.player.id,
                        recipientPlayerId: owner.id,
                      },
                    },
                  ]),
              { ...gainLeaf(CARD_ID, { food: 1 }), targetPlayerId: owner.id },
            ],
          },
        };
      },
    },
  ],
} satisfies CardImpl;
export const OLD_I229_Sycophant = defineOccupationCard({
  meta: {
    id: "OLD_I229_Sycophant",
    originalId: "I229_Sycophant",
    gameEdition: "classic",
    name: "谄言者",
    deck: "I",
    number: 229,
    desc: [
      "每当其他玩家使用小麦种子行动格前，必须先支付给你1份食物，同时你从游戏供应区获得1份食物。每当你使用小麦种子行动格时，你额外获得1份食物。",
    ],
    cost: {},
    vp: 0,
    prerequisite: "",
    players: "1+",
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: "/card-art/classic/I229.png",
    locales: {
      zh: {
        name: "谄言者",
        desc: [
          "每当其他玩家使用小麦种子行动格前，必须先支付给你1份食物，同时你从游戏供应区获得1份食物。每当你使用小麦种子行动格时，你额外获得1份食物。",
        ],
        prerequisite: "",
      },
    },
  },
  impl: cardImpl,
});
export const OLD_I229_Sycophant_impl = OLD_I229_Sycophant.impl;
