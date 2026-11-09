import { defineOccupationCard } from "../card-source";
import type { CardImpl } from "../registry";
import { registerHarvestCountModifier } from "../../actions/helpers/harvest-count-registry";
const CARD_ID = "OLD_I226_Gardener";

const cardImpl = {} satisfies CardImpl;
export const OLD_I226_Gardener = defineOccupationCard({
  meta: {
    id: "OLD_I226_Gardener",
    originalId: "I226_Gardener",
    gameEdition: "classic",
    name: "园丁",
    deck: "I",
    number: 226,
    desc: ["每当你收割蔬菜时，改为从游戏供应区获得蔬菜，你的蔬菜留在田地上。"],
    cost: {},
    vp: 0,
    prerequisite: "",
    players: "1+",
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: "/card-art/classic/I226.png",
    locales: {
      zh: {
        name: "园丁",
        desc: [
          "每当你收割蔬菜时，改为从游戏供应区获得蔬菜，你的蔬菜留在田地上。",
        ],
        prerequisite: "",
      },
    },
  },
  impl: cardImpl,
});
export const OLD_I226_Gardener_impl = OLD_I226_Gardener.impl;
registerHarvestCountModifier(CARD_ID, ({ player, field }) =>
  player.occupationPlayed?.includes(CARD_ID) &&
  field.stacks.at(-1)?.kind === "vegetable"
    ? { delta: 0, tags: ["retain-harvested-crops"], sources: [CARD_ID] }
    : undefined,
);
