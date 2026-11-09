import { defineOccupationCard } from "../card-source";
import type { CardImpl } from "../registry";
import { gainLeaf } from "../helpers/pay-gain-node";
const CARD_ID = "OLD_I246_MilkingHand";

const cardImpl = {
  effect: {
    id: CARD_ID,
    onHarvestFieldPhase: (_state, player) =>
      player.resources.cattle > 0
        ? gainLeaf(CARD_ID, {
            food: Math.min(3, Math.ceil(player.resources.cattle / 2)),
          })
        : undefined,
    computeBonusScore: (_state, player) =>
      Math.floor(player.resources.cattle / 2),
  },
} satisfies CardImpl;
export const OLD_I246_MilkingHand = defineOccupationCard({
  meta: {
    id: "OLD_I246_MilkingHand",
    originalId: "I246_MilkingHand",
    gameEdition: "classic",
    name: "挤奶工",
    deck: "I",
    number: 246,
    desc: [
      "每个丰收时节的收割阶段，若你有1/3/5+头牛，则你获得1/2/3份食物。游戏结束时，你每拥有2头牛便能额外获得1分。",
    ],
    cost: {},
    vp: 0,
    prerequisite: "",
    players: "3+",
    passing: false,
    extraVp: true,
    implemented: true,
    artUrl: "/card-art/classic/I246.png",
    locales: {
      zh: {
        name: "挤奶工",
        desc: [
          "每个丰收时节的收割阶段，若你有1/3/5+头牛，则你获得1/2/3份食物。游戏结束时，你每拥有2头牛便能额外获得1分。",
        ],
        prerequisite: "",
      },
    },
  },
  impl: cardImpl,
});
export const OLD_I246_MilkingHand_impl = OLD_I246_MilkingHand.impl;
