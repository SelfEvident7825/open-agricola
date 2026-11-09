import { defineOccupationCard } from "../card-source";
import type { CardImpl } from "../registry";

const CARD_ID = "OLD_I241_ClayPlasterer";

const cardImpl = {
  modifiers: [
    {
      type: "trade",
      cardId: CARD_ID,
      appliesTo: ["construct"],
      scope: "unit",
      groupId: "classic-room-base",
      groupMax: 1,
      groupScope: "unit",
      from: {},
      to: { clay: 2 },
      conditions: { houseTypeClay: 1 },
    },
  ],
  listeners: [
    {
      id: CARD_ID + "-renovate",
      cardIds: [CARD_ID],
      actions: ["renovate-house"],
      phases: ["computeCosts"],
      handler: (context) =>
        context.player.houseType === "wood"
          ? {
              trades: [
                {
                  from: {},
                  to: { clay: Math.max(0, context.player.rooms - 1) },
                  max: 1,
                  sourceId: CARD_ID,
                  groupId: "classic-renovation-base",
                  groupMax: 1,
                },
              ],
            }
          : undefined,
    },
  ],
} satisfies CardImpl;
export const OLD_I241_ClayPlasterer = defineOccupationCard({
  meta: {
    id: "OLD_I241_ClayPlasterer",
    originalId: "I241_ClayPlasterer",
    gameEdition: "classic",
    name: "墙土修补工",
    deck: "I",
    number: 241,
    desc: [
      "你将木屋翻修成砖屋的总费用改为1块砖头+1捆芦苇。你扩建每间砖屋所需的费用改为3块砖头+2捆芦苇。",
    ],
    cost: {},
    vp: 0,
    prerequisite: "",
    players: "1+",
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: "/card-art/classic/I241.png",
    locales: {
      zh: {
        name: "墙土修补工",
        desc: [
          "你将木屋翻修成砖屋的总费用改为1块砖头+1捆芦苇。你扩建每间砖屋所需的费用改为3块砖头+2捆芦苇。",
        ],
        prerequisite: "",
      },
    },
  },
  impl: cardImpl,
});
export const OLD_I241_ClayPlasterer_impl = OLD_I241_ClayPlasterer.impl;
