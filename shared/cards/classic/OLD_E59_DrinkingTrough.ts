import { defineMinorCard } from '../card-source';
import type { CardImpl } from '../registry';
const CARD_ID = 'OLD_E59_DrinkingTrough';
const cardImpl = {
    effect: {
        id: CARD_ID,
        computePastureCapacityModifiers: () => [{
                sourceCard: CARD_ID,
                kind: 'additive',
                apply: (capacity) => capacity + 2,
            }],
    },
    reaches: [] as readonly string[],
} satisfies CardImpl;
export const OLD_E59_DrinkingTrough = defineMinorCard({
    meta: {
        "id": "OLD_E59_DrinkingTrough",
        "name": "饮水槽",
        "deck": "E",
        "number": 59,
        "category": "FARM_PLANNER",
        "desc": [
            "每个圈地（无论是否有马厩）可以多容纳2只动物。可扩充容量：E58兽笼、I102野生保护区、G070畜栏。不可扩充容量：BI05私家动物园、E208马厩管理员、E306驯兽师、WM013西部牛仔、FR105改革家、NL064牧羊人。"
        ],
        "cost": {
            "wood": 2
        },
        "originalId": "E59_DrinkingTrough",
        "gameEdition": "classic",
        "vp": 1,
        "prerequisite": "",
        "passing": false,
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E59.png",
        "locales": {
            "zh": {
                "name": "饮水槽",
                "desc": [
                    "每个圈地（无论是否有马厩）可以多容纳2只动物。可扩充容量：E58兽笼、I102野生保护区、G070畜栏。不可扩充容量：BI05私家动物园、E208马厩管理员、E306驯兽师、WM013西部牛仔、FR105改革家、NL064牧羊人。"
                ],
                "prerequisite": ""
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E59_DrinkingTrough_impl = OLD_E59_DrinkingTrough.impl;
