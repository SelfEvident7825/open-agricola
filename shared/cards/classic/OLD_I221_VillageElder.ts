import { defineOccupationCard } from "../card-source";
import type { CardImpl } from "../registry";
import { gainLeaf } from "../helpers/pay-gain-node";
const CARD_ID = "OLD_I221_VillageElder";

const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state) => {
      const left = 14 - state.round;
      const wood =
        left >= 9 ? 4 : left >= 6 ? 3 : left >= 3 ? 2 : left >= 1 ? 1 : 0;
      return wood ? gainLeaf(CARD_ID, { wood }) : undefined;
    },
    computeSharedPostScore: (state) => {
      const max = Math.max(
        ...state.players.map(
          (p) => p.minorPlayed.length + p.improvements.length,
        ),
      );
      return state.players
        .filter((p) => p.minorPlayed.length + p.improvements.length === max)
        .map((p) => ({ playerId: p.id, score: 3 }));
    },
  },
} satisfies CardImpl;
export const OLD_I221_VillageElder = defineOccupationCard({
  meta: {
    id: "OLD_I221_VillageElder",
    originalId: "I221_VillageElder",
    gameEdition: "classic",
    name: "村长",
    deck: "I",
    number: 221,
    desc: [
      "打出此卡时，若距离游戏结束还有1/3/6/9个完整回合，则你立即获得1/2/3/4根木头。游戏结束时，打出发展卡最多的玩家都额外获得3分。",
    ],
    cost: {},
    vp: 0,
    prerequisite: "",
    players: "1+",
    passing: false,
    extraVp: true,
    implemented: true,
    artUrl: "/card-art/classic/I221.png",
    locales: {
      zh: {
        name: "村长",
        desc: [
          "打出此卡时，若距离游戏结束还有1/3/6/9个完整回合，则你立即获得1/2/3/4根木头。游戏结束时，打出发展卡最多的玩家都额外获得3分。",
        ],
        prerequisite: "",
      },
    },
  },
  impl: cardImpl,
});
export const OLD_I221_VillageElder_impl = OLD_I221_VillageElder.impl;
