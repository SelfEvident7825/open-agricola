import { defineMinorCard } from "../card-source";
import type { CardImpl } from "../registry";
import { sumActionSpaceMovedToTriggerPlayer } from "../helpers/event-provenance";
import { gainLeaf, payGainActionFlow } from "../helpers/pay-gain-node";
const CARD_ID = "OLD_I82_WoodenCrane";

const cardImpl = {
  listeners: [
    {
      id: CARD_ID + "-stone",
      cardIds: [CARD_ID],
      actionSpaces: "all",
      phases: ["after"],
      handler: (context) => {
        if (
          !((context.space.gainPerRound.stone ?? 0) > 0) ||
          sumActionSpaceMovedToTriggerPlayer(context, "stone") < 1
        )
          return;
        return {
          sourceCard: CARD_ID,
          flow: {
            type: "or",
            children: [
              gainLeaf(CARD_ID, { stone: 1 }),
              payGainActionFlow({
                cardId: CARD_ID,
                cost: { food: 1 },
                gain: { stone: 2 },
                choiceLabelKey: "ui.interactionResourceExchange",
              }),
            ],
          },
        };
      },
    },
  ],
} satisfies CardImpl;
export const OLD_I82_WoodenCrane = defineMinorCard({
  meta: {
    id: "OLD_I82_WoodenCrane",
    originalId: "I82_WoodenCrane",
    gameEdition: "classic",
    name: "木吊车",
    deck: "I",
    number: 82,
    desc: ["每当你使用石头积累行动格时，可以支付0/1份食物额外获得1/2个石头。"],
    cost: {
      wood: 3,
    },
    vp: 1,
    prerequisite: "",
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: "/card-art/classic/I82.png",
    locales: {
      zh: {
        name: "木吊车",
        desc: [
          "每当你使用石头积累行动格时，可以支付0/1份食物额外获得1/2个石头。",
        ],
        prerequisite: "",
      },
    },
  },
  impl: cardImpl,
});
export const OLD_I82_WoodenCrane_impl = OLD_I82_WoodenCrane.impl;
