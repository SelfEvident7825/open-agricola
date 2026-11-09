import { defineOccupationCard } from "../card-source";
import type { CardImpl } from "../registry";
import { readCardExtraData } from "../helpers/card-state";
import { getExtraRoomCapacity } from "../card-effects";
import { familySize } from "../../domain/player";
const CARD_ID = "OLD_I233_FarmSteward";

const eligible = (context: import("../card-listeners").CardListenerContext) =>
  context.player.houseType !== "wood" &&
  readCardExtraData(context.player, CARD_ID, "used") !== true &&
  context.actionContext?.skipRoomCheck !== true &&
  context.actionContext?.checkedReplaceAction !== true &&
  context.player.workers.some(
    (w) => !w.isActive && !w.removedFromSupply && !w.supplyUse,
  ) &&
  context.player.rooms + getExtraRoomCapacity(context.player) <=
    familySize(context.player);
const cardImpl = {
  listeners: [
    {
      id: CARD_ID + "-growth",
      cardIds: [CARD_ID],
      actions: ["family-growth"],
      phases: ["computeReplace"],
      handler: (context) => {
        if (!eligible(context)) return;
        return {
          sourceCard: CARD_ID,
          decline: true,
          alternativeFlow: {
            type: "seq",
            children: [
              {
                type: "leaf",
                actionId: "family-growth",
                sourceCard: CARD_ID,
                actionContext: { skipRoomCheck: true },
              },
              {
                type: "leaf",
                actionId: "special-effect",
                sourceCard: CARD_ID,
                params: { kind: "set-extra-data", key: "used", value: true },
              },
            ],
          },
        };
      },
    },
    {
      id: CARD_ID + "-doable",
      cardIds: [CARD_ID],
      actions: ["family-growth"],
      phases: ["isDoable"],
      handler: (context) => (eligible(context) ? { doable: true } : undefined),
    },
  ],
} satisfies CardImpl;
export const OLD_I233_FarmSteward = defineOccupationCard({
  meta: {
    id: "OLD_I233_FarmSteward",
    originalId: "I233_FarmSteward",
    gameEdition: "classic",
    name: "农场干事",
    deck: "I",
    number: 233,
    desc: [
      "限一次：一旦你的房屋等级是砖屋/石屋，你的下一次“生娃”行动可以当做“生娃(无需空房间)”行动执行。",
    ],
    cost: {},
    vp: 0,
    prerequisite: "",
    players: "1+",
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: "/card-art/classic/I233.png",
    locales: {
      zh: {
        name: "农场干事",
        desc: [
          "限一次：一旦你的房屋等级是砖屋/石屋，你的下一次“生娃”行动可以当做“生娃(无需空房间)”行动执行。",
        ],
        prerequisite: "",
      },
    },
  },
  impl: cardImpl,
});
export const OLD_I233_FarmSteward_impl = OLD_I233_FarmSteward.impl;
