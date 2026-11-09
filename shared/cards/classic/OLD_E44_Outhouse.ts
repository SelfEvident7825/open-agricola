import { defineMinorCard } from '../card-source';
import type { CardImpl } from '../registry';
import { countOccupations } from '../helpers/prerequisites';
const cardImpl = { prerequisiteCheck: (player, state) => !!state?.players.some(other => other.id !== player.id && countOccupations(other) <= 1) } satisfies CardImpl;
export const OLD_E44_Outhouse = defineMinorCard({
    meta: {
        "id": "OLD_E44_Outhouse",
        "originalId": "E44_Outhouse",
        "gameEdition": "classic",
        "name": "无水厕所",
        "deck": "E",
        "number": 44,
        "desc": [
            "至少有1个其他玩家的职业数量≤1时，你才能打出此卡。"
        ],
        "cost": {
            "wood": 1,
            "clay": 1
        },
        "vp": 2,
        "prerequisite": "见下文",
        "passing": false,
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E44.png",
        "locales": {
            "zh": {
                "name": "无水厕所",
                "desc": [
                    "至少有1个其他玩家的职业数量≤1时，你才能打出此卡。"
                ],
                "prerequisite": "见下文"
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E44_Outhouse_impl = OLD_E44_Outhouse.impl;
