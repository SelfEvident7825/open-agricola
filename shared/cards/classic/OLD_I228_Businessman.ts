import { defineOccupationCard } from "../card-source";
import type { CardImpl } from "../registry";
import { createEventQuery } from "../../events/query";
const CARD_ID = "OLD_I228_Businessman";

const cardImpl = {
  listeners: [
    {
      id: CARD_ID + "-improvement",
      cardIds: [CARD_ID],
      actionSpaces: ["meeting-place"],
      phases: ["after"],
      handler: (context) =>
        createEventQuery(context.actionEvents ?? [])
          .filter("card.played")
          .some((e) => e.cardType === "minor")
          ? {
              sourceCard: CARD_ID,
              flow: {
                type: "leaf",
                actionId: "improvement",
                optional: true,
                sourceCard: CARD_ID,
              },
            }
          : undefined,
    },
  ],
} satisfies CardImpl;
export const OLD_I228_Businessman = defineOccupationCard({
  meta: {
    id: "OLD_I228_Businessman",
    originalId: "I228_Businessman",
    gameEdition: "classic",
    name: "生意人",
    deck: "I",
    number: 228,
    desc: [
      "每当你使用聚会场所行动格并打出1张次要发展卡后，你可以额外打出1张主要或次要发展卡。",
    ],
    cost: {},
    vp: 0,
    prerequisite: "",
    players: "1+",
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: "/card-art/classic/I228.png",
    locales: {
      zh: {
        name: "生意人",
        desc: [
          "每当你使用聚会场所行动格并打出1张次要发展卡后，你可以额外打出1张主要或次要发展卡。",
        ],
        prerequisite: "",
      },
    },
  },
  impl: cardImpl,
});
export const OLD_I228_Businessman_impl = OLD_I228_Businessman.impl;
