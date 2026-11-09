import { defineMinorCard } from "../card-source";
import { queueFutureMeeplesFlow } from "../../actions/effects/internal/future-meeples";
import type { CardImpl } from "../registry";
import { getLogicalFields } from "../helpers/card-field";

const CARD_ID = "OLD_I69_StrawberryPatch";

const cardImpl = {
  prerequisiteCheck: (player) =>
    getLogicalFields(player).filter((field) =>
      field.stacks.some((stack) => stack.kind === "vegetable"),
    ).length >= 2,
  effect: {
    id: CARD_ID,
    onBuy: (state, player) => {
      return queueFutureMeeplesFlow(state, {
        cardId: CARD_ID,
        playerId: player.id,
        startRound: state.round + 1,
        count: 3,
        resources: { food: 1 },
      });
    },
  },
  reaches: [] as readonly string[],
} satisfies CardImpl;

export const OLD_I69_StrawberryPatch = defineMinorCard({
  meta: {
    id: "OLD_I69_StrawberryPatch",
    name: "草莓园",
    deck: "I",
    number: 69,
    category: "FOOD_PROVIDER",
    desc: [
      "打出此卡时，在之后的3个回合行动格上各放1份食物。这些回合开始时，你获得对应的食物。此卡牌打出条件“菜田×2”包括卡牌田。",
    ],
    cost: {},
    vp: 2,
    prerequisite: "菜田×2",
    originalId: "I69_StrawberryPatch",
    gameEdition: "classic",
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: "/card-art/classic/I69.png",
    locales: {
      zh: {
        name: "草莓园",
        desc: [
          "打出此卡时，在之后的3个回合行动格上各放1份食物。这些回合开始时，你获得对应的食物。此卡牌打出条件“菜田×2”包括卡牌田。",
        ],
        prerequisite: "菜田×2",
      },
    },
  },
  impl: cardImpl,
});

export const OLD_I69_StrawberryPatch_impl = OLD_I69_StrawberryPatch.impl;
