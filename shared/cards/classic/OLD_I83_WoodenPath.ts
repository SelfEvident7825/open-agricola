import { defineMinorCard } from "../card-source";
import type { CardImpl } from "../registry";

const CARD_ID = "OLD_I83_WoodenPath";

const cardImpl = {
  reaches: ["OLD_I83_WoodenPath", "OLD_I89_ClayPath", "OLD_I94_PavedRoad"],
  effect: {
    id: CARD_ID,
    computeBonusScore: (state) =>
      state.players.some((p) =>
        p.minorPlayed.some((id) =>
          ["OLD_I89_ClayPath", "OLD_I94_PavedRoad"].includes(id),
        ),
      )
        ? 0
        : 2,
  },
} satisfies CardImpl;
export const OLD_I83_WoodenPath = defineMinorCard({
  meta: {
    id: "OLD_I83_WoodenPath",
    originalId: "I83_WoodenPath",
    gameEdition: "classic",
    name: "木板路",
    deck: "I",
    number: 83,
    desc: [
      "游戏结束时，拥有最有价值道路的玩家获得2分。(I94石板路>I89砖头路>I83木板路)",
    ],
    cost: {
      wood: 1,
    },
    vp: 0,
    prerequisite: "",
    passing: false,
    extraVp: true,
    implemented: true,
    artUrl: "/card-art/classic/I83.png",
    locales: {
      zh: {
        name: "木板路",
        desc: [
          "游戏结束时，拥有最有价值道路的玩家获得2分。(I94石板路>I89砖头路>I83木板路)",
        ],
        prerequisite: "",
      },
    },
  },
  impl: cardImpl,
});
export const OLD_I83_WoodenPath_impl = OLD_I83_WoodenPath.impl;
