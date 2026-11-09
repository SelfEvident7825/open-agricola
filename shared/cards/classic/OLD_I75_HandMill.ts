import { defineMinorCard } from "../card-source";
import type { CardImpl } from "../registry";

const cardImpl = {} satisfies CardImpl;
export const OLD_I75_HandMill = defineMinorCard({
  meta: {
    id: "OLD_I75_HandMill",
    originalId: "I75_HandMill",
    gameEdition: "classic",
    name: "手磨机",
    deck: "I",
    number: 75,
    desc: [
      "每个丰收时节的喂养阶段，你可以将至多2份小麦各转化为2份食物。（这不算作“烤面包”行动）",
    ],
    cost: {
      stone: 1,
    },
    vp: 0,
    prerequisite: "",
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: "/card-art/classic/I75.png",
    locales: {
      zh: {
        name: "手磨机",
        desc: [
          "每个丰收时节的喂养阶段，你可以将至多2份小麦各转化为2份食物。（这不算作“烤面包”行动）",
        ],
        prerequisite: "",
      },
    },
    exchanges: [
      {
        from: {
          grain: 1,
        },
        to: {
          food: 2,
        },
        triggers: ["harvest"],
        max: 2,
      },
    ],
  },
  impl: cardImpl,
});
export const OLD_I75_HandMill_impl = OLD_I75_HandMill.impl;
