import { defineOccupationCard } from '../card-source';
export const OLD_E186_ClaySeller = defineOccupationCard({
    meta: {
        "id": "OLD_E186_ClaySeller",
        "originalId": "E186_ClaySeller",
        "gameEdition": "classic",
        "name": "售土商",
        "deck": "E",
        "number": 186,
        "desc": [
            "任意时刻，你可以把砖头转化成以下物品：2砖头 → 1羊/1芦苇3砖头 → 1猪/1石头4砖头 → 1牛动物可以立即被转换成食物，即使你没有饲养空间。"
        ],
        "cost": {},
        "vp": 0,
        "prerequisite": "",
        "players": "3+",
        "passing": false,
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E186.png",
        "locales": {
            "zh": {
                "name": "售土商",
                "desc": [
                    "任意时刻，你可以把砖头转化成以下物品：2砖头 → 1羊/1芦苇3砖头 → 1猪/1石头4砖头 → 1牛动物可以立即被转换成食物，即使你没有饲养空间。"
                ],
                "prerequisite": ""
            }
        },
        "exchanges": [
            {
                "from": {
                    "clay": 2
                },
                "to": {
                    "sheep": 1
                },
                "triggers": [
                    "anytime"
                ]
            },
            {
                "from": {
                    "clay": 2
                },
                "to": {
                    "reed": 1
                },
                "triggers": [
                    "anytime"
                ]
            },
            {
                "from": {
                    "clay": 3
                },
                "to": {
                    "boar": 1
                },
                "triggers": [
                    "anytime"
                ]
            },
            {
                "from": {
                    "clay": 3
                },
                "to": {
                    "stone": 1
                },
                "triggers": [
                    "anytime"
                ]
            },
            {
                "from": {
                    "clay": 4
                },
                "to": {
                    "cattle": 1
                },
                "triggers": [
                    "anytime"
                ]
            }
        ]
    },
});
