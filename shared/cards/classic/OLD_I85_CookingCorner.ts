import { defineMinorCard } from "../card-source";
import type { CardImpl } from "../registry";

const cardImpl = {} satisfies CardImpl;
export const OLD_I85_CookingCorner = defineMinorCard({
  meta: {
    id: "OLD_I85_CookingCorner",
    originalId: "I85_CookingCorner",
    gameEdition: "classic",
    name: "烹饪角",
    deck: "I",
    number: 85,
    desc: ["任意时刻：“烤面包”行动"],
    cost: {},
    vp: 3,
    prerequisite: "退还壁炉",
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: "/card-art/classic/I85.png",
    locales: {
      zh: {
        name: "烹饪角",
        desc: ["任意时刻：“烤面包”行动"],
        prerequisite: "退还壁炉",
      },
    },
    returnCards: [
      "Major_CookingHearth1",
      "Major_CookingHearth2",
      "OLD_K128_CookingHearth",
    ],
    isCookery: true,
    isBaking: true,
    exchanges: [
      {
        from: {
          vegetable: 1,
        },
        to: {
          food: 4,
        },
        triggers: ["anytime"],
      },
      {
        from: {
          sheep: 1,
        },
        to: {
          food: 2,
        },
        triggers: ["anytime"],
      },
      {
        from: {
          boar: 1,
        },
        to: {
          food: 3,
        },
        triggers: ["anytime"],
      },
      {
        from: {
          cattle: 1,
        },
        to: {
          food: 4,
        },
        triggers: ["anytime"],
      },
      {
        from: {
          grain: 1,
        },
        to: {
          food: 3,
        },
        triggers: ["bake-bread"],
      },
    ],
  },
  impl: cardImpl,
});
export const OLD_I85_CookingCorner_impl = OLD_I85_CookingCorner.impl;
