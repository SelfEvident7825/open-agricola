import { defineOccupationCard } from "../card-source";
import type {
  CardListenerRegistration,
  CardListenerContext,
} from "../card-listeners";
import type { ActionHookResult } from "../../actions/hooks";
import type { CardImpl } from "../registry";
import { isTravelingPlayersSpaceId } from "../helpers/action-space-categories";

const CARD_ID = "OLD_I249_Puppeteer";
/**
 * C152 Puppeteer:
 * Each time another player uses the Traveling Players accumulation space,
 * you can pay them 1 food to play 1 occupation for free.
 * Players 3+.
 */
const listener: CardListenerRegistration = {
  id: "OLD_I249_Puppeteer-puppeteer-opponent-traveling-players",
  cardIds: [CARD_ID],
  actionSpaces: "all",
  phases: ["after"],
  scope: "opponent",
  handler: (context: CardListenerContext): ActionHookResult | void => {
    if (!isTravelingPlayersSpaceId(context.space?.id)) return;
    const triggerPlayerId = context.triggerPlayer?.id ?? context.player.id;
    return {
      flow: {
        type: "seq",
        optional: true,
        children: [
          {
            type: "leaf",
            actionId: "pay",
            params: { food: 1 },
            sourceCard: CARD_ID,
          },
          {
            type: "leaf",
            actionId: "gain",
            params: { food: 1, recipientPlayerId: triggerPlayerId },
            sourceCard: CARD_ID,
          },
          {
            type: "leaf",
            actionId: "occupation",
            sourceCard: CARD_ID,
            params: { exactCost: {} },
          },
        ],
      },
      sourceCard: CARD_ID,
    };
  },
};

const cardImpl = {
  listeners: [listener],
  reaches: [] as readonly string[],
} satisfies CardImpl;

export const OLD_I249_Puppeteer = defineOccupationCard({
  meta: {
    id: "OLD_I249_Puppeteer",
    name: "木偶艺人",
    deck: "I",
    number: 249,
    category: "ACTIONS_BOOSTER",
    desc: [
      "每当其他玩家使用卖艺积累行动格时，你可以支付1份食物来打出一张职业卡。",
    ],
    cost: {},
    players: "3+",
    evenMoreSet: true,
    originalId: "I249_Puppeteer",
    gameEdition: "classic",
    vp: 0,
    prerequisite: "",
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: "/card-art/classic/I249.png",
    locales: {
      zh: {
        name: "木偶艺人",
        desc: [
          "每当其他玩家使用卖艺积累行动格时，你可以支付1份食物来打出一张职业卡。",
        ],
        prerequisite: "",
      },
    },
  },
  impl: cardImpl,
});

export const OLD_I249_Puppeteer_impl = OLD_I249_Puppeteer.impl;
