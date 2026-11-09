import { defineOccupationCard } from "../card-source";
import type { CardImpl } from "../registry";
import type { GameState, PlayerState } from "../../contract/types";
import { openRoundForSpace } from "../../actions/helpers/placement-availability";
const CARD_ID = "OLD_I238_Chamberlain";
const reveal = (state: GameState, player: PlayerState) => {
  if (state.round < 11) return;
  for (const space of state.actionSpaces) {
    const round = openRoundForSpace(state, space);
    if (round > state.round)
      space.exclusiveUse = {
        playerId: player.id,
        sourceCardId: CARD_ID,
        untilRound: round,
      };
  }
};
const cardImpl = {
  effect: { id: CARD_ID, onBuy: reveal, onRoundStart: reveal },
} satisfies CardImpl;
export const OLD_I238_Chamberlain = defineOccupationCard({
  meta: {
    id: "OLD_I238_Chamberlain",
    originalId: "I238_Chamberlain",
    gameEdition: "classic",
    name: "内侍",
    deck: "I",
    number: 238,
    desc: [
      "在第11回合开始时（如果在11回合后打出，则改为打出时），翻开剩下的回合行动格。只有你能使用这些行动格，其他玩家必须等到对应回合才能使用。",
    ],
    cost: {},
    vp: 0,
    prerequisite: "",
    players: "1+",
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: "/card-art/classic/I238.png",
    locales: {
      zh: {
        name: "内侍",
        desc: [
          "在第11回合开始时（如果在11回合后打出，则改为打出时），翻开剩下的回合行动格。只有你能使用这些行动格，其他玩家必须等到对应回合才能使用。",
        ],
        prerequisite: "",
      },
    },
  },
  impl: cardImpl,
});
export const OLD_I238_Chamberlain_impl = OLD_I238_Chamberlain.impl;
