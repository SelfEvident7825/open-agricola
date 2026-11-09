import { defineOccupationCard } from "../card-source";
import type { CardImpl } from "../registry";
import { sumActionSpaceMovedToTriggerPlayer } from "../helpers/event-provenance";
const CARD_ID = "OLD_I234_WoodBuyer";

const cardImpl = {
  listeners: [
    {
      id: CARD_ID + "-buy",
      cardIds: [CARD_ID],
      actionSpaces: "all",
      phases: ["immediatelyAfter"],
      scope: "opponent",
      handler: (context) => {
        const owner = context.ownerPlayer ?? context.player,
          actor = context.player;
        if (sumActionSpaceMovedToTriggerPlayer(context, "wood") < 1) return;

        return {
          sourceCard: CARD_ID,
          flow: {
            type: "seq",
            children: [
              {
                type: "seq",
                optional: true,
                children: [
                  {
                    type: "leaf",
                    actionId: "gain",
                    sourceCard: CARD_ID,
                    params: {
                      food: 1,
                      payerId: owner.id,
                      recipientPlayerId: actor.id,
                    },
                  },
                  {
                    type: "leaf",
                    actionId: "gain",
                    sourceCard: CARD_ID,
                    params: {
                      wood: 1,
                      payerId: actor.id,
                      recipientPlayerId: owner.id,
                    },
                  },
                ],
              },
            ],
          },
        };
      },
    },
  ],
} satisfies CardImpl;
export const OLD_I234_WoodBuyer = defineOccupationCard({
  meta: {
    id: "OLD_I234_WoodBuyer",
    originalId: "I234_WoodBuyer",
    gameEdition: "classic",
    name: "购木商",
    deck: "I",
    number: 234,
    desc: [
      "每当其他玩家从行动格上获得木头时，你可以支付给他1份食物获得他的1根木头。（通过卡牌获得的木头不算）",
    ],
    cost: {},
    vp: 0,
    prerequisite: "",
    players: "1+",
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: "/card-art/classic/I234.png",
    locales: {
      zh: {
        name: "购木商",
        desc: [
          "每当其他玩家从行动格上获得木头时，你可以支付给他1份食物获得他的1根木头。（通过卡牌获得的木头不算）",
        ],
        prerequisite: "",
      },
    },
  },
  impl: cardImpl,
});
export const OLD_I234_WoodBuyer_impl = OLD_I234_WoodBuyer.impl;
