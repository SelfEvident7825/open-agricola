import { defineMinorCard } from "../card-source";
import type { CardImpl } from "../registry";

const CARD_ID = "OLD_I102_WildlifeReserve";

const cardImpl = {
  effect: {
    id: CARD_ID,
    onComputeAnimalZones: (player, zones) => {
      const pipe = player.occupationPlayed.includes("OLD_E29_ShepherdsPipe");
      const trough = player.minorPlayed.includes("OLD_E59_DrinkingTrough");
      zones.push({
        id: "card:" + CARD_ID,
        zoneType: "card",
        cardId: CARD_ID,
        capacity: 3 + (pipe ? 2 : 0) + (trough ? 2 : 0),
        animalType: null,
        animalCount: 0,
        allowedAnimalType: null,
        ...(pipe ? { reservedCapacity: { sheep: 2 } } : {}),
      });
    },
    getInvalidAnimals: (player, _zone, meeples) => {
      const counts = { sheep: 0, boar: 0, cattle: 0 };
      let free = player.minorPlayed.includes("OLD_E59_DrinkingTrough") ? 2 : 0;
      let sheep = player.occupationPlayed.includes("OLD_E29_ShepherdsPipe")
        ? 2
        : 0;
      return meeples.filter((m) => {
        if (!(m.type in counts)) return true;
        const key = m.type as keyof typeof counts;
        if (counts[key]++ === 0) return false;
        if (key === "sheep" && sheep > 0) {
          sheep--;
          return false;
        }
        if (free > 0) {
          free--;
          return false;
        }
        return true;
      });
    },
  },
  reaches: ["OLD_E29_ShepherdsPipe", "OLD_E59_DrinkingTrough"],
} satisfies CardImpl;

export const OLD_I102_WildlifeReserve = defineMinorCard({
  meta: {
    id: "OLD_I102_WildlifeReserve",
    name: "野生保护区",
    deck: "I",
    number: 102,
    category: "FARM_PLANNER",
    desc: [
      "你可以在此卡上饲养至多1只羊+1只猪+1只牛。(可被E29兽角笛和E59饮水槽扩充容量)",
    ],
    cost: {
      wood: 2,
    },
    animalHolder: true,
    vp: 1,
    prerequisite: "2 Occupations",
    occupationPrerequisites: {
      min: 2,
    },
    originalId: "I102_WildlifeReserve",
    gameEdition: "classic",
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: "/card-art/classic/I102.png",
    locales: {
      zh: {
        name: "野生保护区",
        desc: [
          "你可以在此卡上饲养至多1只羊+1只猪+1只牛。(可被E29兽角笛和E59饮水槽扩充容量)",
        ],
        prerequisite: "职业×2",
      },
    },
  },
  impl: cardImpl,
});

export const OLD_I102_WildlifeReserve_impl = OLD_I102_WildlifeReserve.impl;
