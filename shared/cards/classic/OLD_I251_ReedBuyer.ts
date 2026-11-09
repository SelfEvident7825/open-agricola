import { defineOccupationCard } from "../card-source";
import type { CardImpl } from "../registry";
import { sumActionSpaceMovedToTriggerPlayer } from "../helpers/event-provenance";
import { readCardExtraData } from "../helpers/card-state";
const CARD_ID = "OLD_I251_ReedBuyer";

const cardImpl = {
  listeners: [
    {
      id: CARD_ID + "-buy",
      cardIds: [CARD_ID],
      actionSpaces: "all",
      phases: ["immediatelyAfter"],
      scope: "any",
      handler: (context) => {
        const owner = context.ownerPlayer ?? context.player,
          actor = context.player;
        if (sumActionSpaceMovedToTriggerPlayer(context, "reed") < 1) return;
        if (
          readCardExtraData<number>(owner, CARD_ID, "seenRound") ===
          context.state.round
        )
          return;
        return {
          sourceCard: CARD_ID,
          flow: {
            type: "seq",
            children: [
              {
                type: "leaf",
                actionId: "special-effect",
                sourceCard: CARD_ID,
                params: {
                  kind: "set-extra-data",
                  key: "seenRound",
                  value: context.state.round,
                },
              },
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
                    targetPlayerId: actor.id,
                    params: { food: 1 },
                  },
                  {
                    type: "leaf",
                    actionId: "gain",
                    sourceCard: CARD_ID,
                    params: {
                      reed: 1,
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
export const OLD_I251_ReedBuyer = defineOccupationCard({
  meta: {
    id: "OLD_I251_ReedBuyer",
    originalId: "I251_ReedBuyer",
    gameEdition: "classic",
    name: "购苇商",
    deck: "I",
    number: 251,
    desc: [
      "每回合第一次有玩家从行动格上获得至少1捆芦苇时，你可以支付该玩家1份食物，该玩家必须给你1捆芦苇并从游戏供应区获得1份食物。（通过卡牌获得的芦苇不算）",
    ],
    cost: {},
    vp: 0,
    prerequisite: "",
    players: "3+",
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: "/card-art/classic/I251.png",
    locales: {
      zh: {
        name: "购苇商",
        desc: [
          "每回合第一次有玩家从行动格上获得至少1捆芦苇时，你可以支付该玩家1份食物，该玩家必须给你1捆芦苇并从游戏供应区获得1份食物。（通过卡牌获得的芦苇不算）",
        ],
        prerequisite: "",
      },
    },
  },
  impl: cardImpl,
});
export const OLD_I251_ReedBuyer_impl = OLD_I251_ReedBuyer.impl;
