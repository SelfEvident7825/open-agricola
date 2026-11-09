import { defineOccupationCard } from '../card-source';
import { readCardExtraData, writeCardExtraData } from '../helpers/card-state';
import { countOccupations } from '../helpers/prerequisites';
import type { CardImpl } from '../registry';
const CARD_ID = 'OLD_E174_Tutor';
const cardImpl = {
    effect: {
        id: CARD_ID,
        onBuy: (_state, player) => {
            writeCardExtraData(player, CARD_ID, 'playedAtCount', countOccupations(player));
        },
        computeBonusScore: (_state, player) => {
            const playedAt = readCardExtraData<number>(player, CARD_ID, 'playedAtCount') ?? 0;
            return Math.max(0, countOccupations(player) - playedAt);
        },
    },
    reaches: [] as readonly string[],
} satisfies CardImpl;
export const OLD_E174_Tutor = defineOccupationCard({
    meta: {
        "id": "OLD_E174_Tutor",
        "name": "家庭教师",
        "deck": "E",
        "number": 174,
        "category": "POINTS_PROVIDER",
        "desc": [
            "游戏结束时，你在此卡之后打出的每个职业都能使你获得1分。"
        ],
        "cost": {},
        "players": "3+",
        "extraVp": true,
        "originalId": "E174_Tutor",
        "gameEdition": "classic",
        "vp": 0,
        "prerequisite": "",
        "passing": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E174.png",
        "locales": {
            "zh": {
                "name": "家庭教师",
                "desc": [
                    "游戏结束时，你在此卡之后打出的每个职业都能使你获得1分。"
                ],
                "prerequisite": ""
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E174_Tutor_impl = OLD_E174_Tutor.impl;
