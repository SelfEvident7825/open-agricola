import { defineOccupationCard } from "../card-source";
import type { CostModifier } from "../../contract/types";
import type { CardListenerRegistration } from "../card-listeners";
import type { ActionHookPhase } from "../../actions/hooks";
import type { CardImpl } from "../registry";
import { PaymentSolver } from "../../actions/payment";

const CARD_ID = "OLD_I243_Bricklayer";
/**
 * C122 Bricklayer — Each improvement and each renovation cost you 1 clay less.
 * Each room costs you 2 clay less.
 *
 * Reference: onPlayerComputeCardCosts (improvements -1 clay),
 * onPlayerComputeCostsConstruct (rooms -2 clay),
 * onPlayerComputeCostsRenovation (-1 clay).
 */

const improvementCostListener: CardListenerRegistration = {
  id: "C122-bricklayer-costs-improvement",
  cardIds: [CARD_ID],
  phases: ["computeCosts" as ActionHookPhase],
  actions: ["improvement"],
  deriveCardCostCandidate: (_context, candidate) =>
    PaymentSolver.discountCardCostCandidate(candidate, CARD_ID, { clay: 1 }),
};

const cardImpl = {
  listeners: [improvementCostListener],
  modifiers: [
    {
      type: "trade",
      cardId: CARD_ID,
      appliesTo: ["construct"],
      scope: "unit",
      from: {},
      to: { clay: 2 },
    },
    {
      type: "bonus",
      cardId: CARD_ID,
      appliesTo: ["renovation"],
      discount: { clay: 1 },
      optional: false,
    },
  ] as CostModifier[],
  reaches: [] as readonly string[],
} satisfies CardImpl;

export const OLD_I243_Bricklayer = defineOccupationCard({
  meta: {
    id: "OLD_I243_Bricklayer",
    originalId: "I243_Bricklayer",
    gameEdition: "classic",
    name: "砌砖工",
    deck: "I",
    number: 243,
    desc: [
      "发展卡和翻修房屋所需的砖头费用都减少1，扩建每间房屋所需的砖头费用都减少2。",
    ],
    cost: {},
    vp: 0,
    prerequisite: "",
    players: "1+",
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: "/card-art/classic/I243.png",
    locales: {
      zh: {
        name: "砌砖工",
        desc: [
          "发展卡和翻修房屋所需的砖头费用都减少1，扩建每间房屋所需的砖头费用都减少2。",
        ],
        prerequisite: "",
      },
    },
  },
  impl: cardImpl,
});
export const OLD_I243_Bricklayer_impl = OLD_I243_Bricklayer.impl;
