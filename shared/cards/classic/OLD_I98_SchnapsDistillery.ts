import { defineMinorCard } from "../card-source";
import type { CardImpl } from "../registry";
import { getLogicalFields } from "../helpers/card-field";
const CARD_ID = "OLD_I98_SchnapsDistillery";

const cardImpl = {
  effect: {
    id: CARD_ID,
    computeBonusScore: (_state, player) =>
      Math.max(
        0,
        Math.min(
          2,
          player.resources.vegetable +
            getLogicalFields(player)
              .flatMap((f) => f.stacks)
              .filter((s) => s.kind === "vegetable")
              .reduce((n, s) => n + s.remaining, 0) -
            4,
        ),
      ),
  },
} satisfies CardImpl;
export const OLD_I98_SchnapsDistillery = defineMinorCard({
  meta: {
    id: "OLD_I98_SchnapsDistillery",
    originalId: "I98_SchnapsDistillery",
    gameEdition: "classic",
    name: "烈酒蒸馏器",
    deck: "I",
    number: 98,
    desc: [
      "每个喂养阶段，你可使用此卡将至多1份蔬菜转化为4份食物。游戏结束时，你的第5和第6份蔬菜各值1分。",
    ],
    cost: {
      stone: 2,
      vegetable: 1,
    },
    vp: 2,
    prerequisite: "",
    passing: false,
    extraVp: true,
    implemented: true,
    artUrl: "/card-art/classic/I98.png",
    locales: {
      zh: {
        name: "烈酒蒸馏器",
        desc: [
          "每个喂养阶段，你可使用此卡将至多1份蔬菜转化为4份食物。游戏结束时，你的第5和第6份蔬菜各值1分。",
        ],
        prerequisite: "",
      },
    },
    exchanges: [
      {
        from: {
          vegetable: 1,
        },
        to: {
          food: 4,
        },
        triggers: ["harvest"],
        max: 1,
      },
    ],
  },
  impl: cardImpl,
});
export const OLD_I98_SchnapsDistillery_impl = OLD_I98_SchnapsDistillery.impl;
