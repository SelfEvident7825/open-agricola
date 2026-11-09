import { defineMinorCard } from "../card-source";
import type {
  CardListenerRegistration,
  CardListenerContext,
} from "../card-listeners";
import type { ActionHookResult } from "../../actions/hooks";
import { gainLeaf } from "../helpers/pay-gain-node";
import type { CardImpl } from "../registry";

const CARD_ID = "OLD_I79_WoodCart";
const isWoodAccumulationSpace = (context: CardListenerContext): boolean =>
  (context.space?.gainPerRound?.wood ?? 0) > 0;

const listener: CardListenerRegistration = {
  id: "OLD_I79_WoodCart-wood-cart-before-collect",
  cardIds: [CARD_ID],
  phases: ["before"],
  actionSpaces: "all",
  handler: (context: CardListenerContext): ActionHookResult | void => {
    if (!isWoodAccumulationSpace(context)) return;
    return { flow: gainLeaf(CARD_ID, { wood: 2 }), sourceCard: CARD_ID };
  },
};

const cardImpl = {
  listeners: [listener],
  reaches: [] as readonly string[],
} satisfies CardImpl;

export const OLD_I79_WoodCart = defineMinorCard({
  meta: {
    id: "OLD_I79_WoodCart",
    name: "木头推车",
    deck: "I",
    number: 79,
    category: "BUILDING_RESOURCE_PROVIDER",
    desc: [
      "每当你从行动格上获得木头时，额外获得2根木头。（5人局版图“芦+石+木”和通过卡牌获得的木头不算）",
    ],
    cost: {
      wood: 3,
    },
    prerequisite: "3 Occupations",
    occupationPrerequisites: {
      min: 3,
    },
    originalId: "I79_WoodCart",
    gameEdition: "classic",
    vp: 0,
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: "/card-art/classic/I79.png",
    locales: {
      zh: {
        name: "木头推车",
        desc: [
          "每当你从行动格上获得木头时，额外获得2根木头。（5人局版图“芦+石+木”和通过卡牌获得的木头不算）",
        ],
        prerequisite: "职业×3",
      },
    },
  },
  impl: cardImpl,
});

export const OLD_I79_WoodCart_impl = OLD_I79_WoodCart.impl;
