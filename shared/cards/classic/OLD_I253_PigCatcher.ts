import { defineOccupationCard } from "../card-source";
import type { CardImpl } from "../registry";
import { sumActionSpaceMovedToTriggerPlayer } from "../helpers/event-provenance";
import { returnToSpaceThenGainFlow } from "../helpers/pay-gain-node";
const CARD_ID = "OLD_I253_PigCatcher";

const cardImpl = {
  listeners: [
    {
      id: CARD_ID + "-boar",
      cardIds: [CARD_ID],
      actionSpaces: "all",
      phases: ["after"],
      handler: (context) =>
        sumActionSpaceMovedToTriggerPlayer(context, "wood") >= 2
          ? returnToSpaceThenGainFlow({
              cardId: CARD_ID,
              cost: { wood: 2 },
              gain: { boar: 1 },
              choiceLabelKey: "ui.interactionResourceExchange",
            })
          : undefined,
    },
  ],
} satisfies CardImpl;
export const OLD_I253_PigCatcher = defineOccupationCard({
  meta: {
    id: "OLD_I253_PigCatcher",
    originalId: "I253_PigCatcher",
    gameEdition: "classic",
    name: "捕猪人",
    deck: "I",
    number: 253,
    desc: [
      "每当你从一个行动格上获得至少2根木头后，你可以支付2根木头来换1头猪。将所支付的木头放在对应的行动格上。（通过卡牌获得的木头不算）",
    ],
    cost: {},
    vp: 0,
    prerequisite: "",
    players: "3+",
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: "/card-art/classic/I253.png",
    locales: {
      zh: {
        name: "捕猪人",
        desc: [
          "每当你从一个行动格上获得至少2根木头后，你可以支付2根木头来换1头猪。将所支付的木头放在对应的行动格上。（通过卡牌获得的木头不算）",
        ],
        prerequisite: "",
      },
    },
  },
  impl: cardImpl,
});
export const OLD_I253_PigCatcher_impl = OLD_I253_PigCatcher.impl;
