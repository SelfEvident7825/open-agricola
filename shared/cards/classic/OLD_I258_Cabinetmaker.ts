import { defineOccupationCard } from "../card-source";
import type { CardImpl } from "../registry";

const cardImpl = {} satisfies CardImpl;
export const OLD_I258_Cabinetmaker = defineOccupationCard({
  meta: {
    id: "OLD_I258_Cabinetmaker",
    originalId: "I258_Cabinetmaker",
    gameEdition: "classic",
    name: "家具匠",
    deck: "I",
    number: 258,
    desc: ["每个丰收时节，你可以将至多1根木头转化为2份食物。"],
    cost: {},
    vp: 0,
    prerequisite: "",
    players: "3+",
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: "/card-art/classic/I258.png",
    locales: {
      zh: {
        name: "家具匠",
        desc: ["每个丰收时节，你可以将至多1根木头转化为2份食物。"],
        prerequisite: "",
      },
    },
    exchanges: [
      {
        from: {
          wood: 1,
        },
        to: {
          food: 2,
        },
        triggers: ["harvest"],
        max: 1,
      },
    ],
  },
  impl: cardImpl,
});
export const OLD_I258_Cabinetmaker_impl = OLD_I258_Cabinetmaker.impl;
