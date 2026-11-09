import { defineMinorCard } from "../card-source";
import type { CardImpl } from "../registry";

const CARD_ID = "OLD_I71_HolidayHouse";

const cardImpl = {
  prerequisiteCheck: (_player, state) => !!state && state.round < 14,
  effect: { id: CARD_ID, blocksWorkerPlacement: (state) => state.round === 14 },
} satisfies CardImpl;
export const OLD_I71_HolidayHouse = defineMinorCard({
  meta: {
    id: "OLD_I71_HolidayHouse",
    originalId: "I71_HolidayHouse",
    gameEdition: "classic",
    name: "度假屋",
    deck: "I",
    number: 71,
    desc: [
      "此卡只能在第13回合/之前打出。在第14回合，你不能派遣任何家庭成员(包括食客)。（准备好连续两次进行丰收时节，即第5次和第6次丰收）",
    ],
    cost: {},
    vp: 8,
    prerequisite: "",
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: "/card-art/classic/I71.png",
    locales: {
      zh: {
        name: "度假屋",
        desc: [
          "此卡只能在第13回合/之前打出。在第14回合，你不能派遣任何家庭成员(包括食客)。（准备好连续两次进行丰收时节，即第5次和第6次丰收）",
        ],
        prerequisite: "",
      },
    },
    altCosts: [
      {
        wood: 3,
        reed: 2,
      },
      {
        clay: 3,
        reed: 2,
      },
    ],
  },
  impl: cardImpl,
});
export const OLD_I71_HolidayHouse_impl = OLD_I71_HolidayHouse.impl;
