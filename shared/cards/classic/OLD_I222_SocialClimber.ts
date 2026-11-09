import { defineOccupationCard } from "../card-source";
import type { CardImpl } from "../registry";
import { createEventQuery } from "../../events/query";
import { gainLeaf } from "../helpers/pay-gain-node";
const CARD_ID = "OLD_I222_SocialClimber";

const cardImpl = {
  listeners: [
    {
      id: CARD_ID + "-renovate",
      cardIds: [CARD_ID],
      actions: ["renovate-house"],
      phases: ["after"],
      handler: (context) => {
        const renovated = createEventQuery(context.actionEvents ?? [])
          .filter("farm.renovated")
          .find((e) => e.playerId === context.player.id);
        if (!renovated) return;
        const count = context.state.players.filter((p) =>
          renovated.to === "stone"
            ? p.houseType === "stone"
            : p.houseType !== "wood",
        ).length;
        return count <= 3
          ? {
              sourceCard: CARD_ID,
              flow: gainLeaf(CARD_ID, { stone: 4 - count }),
            }
          : undefined;
      },
    },
  ],
} satisfies CardImpl;
export const OLD_I222_SocialClimber = defineOccupationCard({
  meta: {
    id: "OLD_I222_SocialClimber",
    originalId: "I222_SocialClimber",
    gameEdition: "classic",
    name: "上流生活",
    deck: "I",
    number: 222,
    desc: [
      "每当你翻修后，如果你是本局游戏中第1/2/3位翻修至砖屋/石屋的玩家，则你都能获得3/2/1个石头。",
    ],
    cost: {},
    vp: 0,
    prerequisite: "",
    players: "1+",
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: "/card-art/classic/I222.png",
    locales: {
      zh: {
        name: "上流生活",
        desc: [
          "每当你翻修后，如果你是本局游戏中第1/2/3位翻修至砖屋/石屋的玩家，则你都能获得3/2/1个石头。",
        ],
        prerequisite: "",
      },
    },
  },
  impl: cardImpl,
});
export const OLD_I222_SocialClimber_impl = OLD_I222_SocialClimber.impl;
