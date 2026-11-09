import { defineMinorCard } from "../card-source";
import type { CardImpl } from "../registry";

const CARD_ID = "OLD_I73_Guest";

const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (state, player) => {
      if (state.round >= 14) return;
      const nextId = String(
        Math.max(
          0,
          ...player.workers.map((w) => Number(w.id)).filter(Number.isFinite),
        ) + 1,
      );
      player.workers.push({
        id: nextId,
        isActive: false,
        isNewborn: false,
        removedFromSupply: true,
        supplyUse: {
          sourceCard: CARD_ID,
          disposition: "remove-from-game",
          status: "temporary",
          availableFromRound: state.round + 1,
          returnRound: state.round + 1,
        },
      });
    },
  },
} satisfies CardImpl;
export const OLD_I73_Guest = defineMinorCard({
  meta: {
    id: "OLD_I73_Guest",
    originalId: "I73_Guest",
    gameEdition: "classic",
    name: "客人",
    deck: "I",
    number: 73,
    desc: [
      "立即获得1名食客。该食客可以在下回合派遣，回合结束时退还。使用后请将此卡交给下家，此卡将加入他的手牌。",
    ],
    cost: {
      food: 2,
    },
    vp: 0,
    prerequisite: "",
    passing: true,
    extraVp: false,
    implemented: true,
    artUrl: "/card-art/classic/I73.png",
    locales: {
      zh: {
        name: "客人",
        desc: [
          "立即获得1名食客。该食客可以在下回合派遣，回合结束时退还。使用后请将此卡交给下家，此卡将加入他的手牌。",
        ],
        prerequisite: "",
      },
    },
  },
  impl: cardImpl,
});
export const OLD_I73_Guest_impl = OLD_I73_Guest.impl;
