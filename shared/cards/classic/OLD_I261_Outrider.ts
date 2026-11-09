import { defineOccupationCard } from "../card-source";
import type {
  CardListenerContext,
  CardListenerRegistration,
} from "../card-listeners";
import type { ActionHookResult } from "../../actions/hooks";
import { gainLeaf } from "../helpers/pay-gain-node";
import type { CardImpl } from "../registry";

const CARD_ID = "OLD_I261_Outrider";
/**
 * C160 Outrider (Occupation, 4+ players)
 *
 * "Each time before you use the action space on the most recently revealed
 * action space card (after it has been placed on the round space), you get
 * 1 grain."
 *
 * Rule: isListeningTo uses Globals::getLastRevealed to filter to events
 * targeting the most recently revealed action card.
 *
 * In open-agricola the last revealed round action is at
 * state.roundActionOrder[state.round - 1]. We fire before place-farmer when
 * the space being used matches that id.
 */

const listener: CardListenerRegistration = {
  id: "OLD_I261_Outrider-outrider-before-place-farmer",
  cardIds: [CARD_ID],
  phases: ["before"],
  actionSpaces: "all",
  handler: (context: CardListenerContext): ActionHookResult | void => {
    const spaceId = context.space?.id;
    if (!spaceId) return;
    const lastRevealed =
      context.state.roundActionOrder[context.state.round - 1];
    if (!lastRevealed || spaceId !== lastRevealed) return;
    return { flow: gainLeaf(CARD_ID, { grain: 1 }), sourceCard: CARD_ID };
  },
};

const cardImpl = {
  listeners: [listener],
  reaches: [] as readonly string[],
} satisfies CardImpl;

export const OLD_I261_Outrider = defineOccupationCard({
  meta: {
    id: "OLD_I261_Outrider",
    name: "先驱者",
    deck: "I",
    number: 261,
    category: "CROP_PROVIDER",
    desc: ["每当你使用当回合新翻开的那张回合行动卡前，你先获得1份小麦。"],
    cost: {},
    players: "3+",
    originalId: "I261_Outrider",
    gameEdition: "classic",
    vp: 0,
    prerequisite: "",
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: "/card-art/classic/I261.png",
    locales: {
      zh: {
        name: "先驱者",
        desc: ["每当你使用当回合新翻开的那张回合行动卡前，你先获得1份小麦。"],
        prerequisite: "",
      },
    },
  },
  impl: cardImpl,
});

export const OLD_I261_Outrider_impl = OLD_I261_Outrider.impl;
