import { defineMinorCard } from '../card-source';
export const OLD_E20_SimpleFireplace = defineMinorCard({
    meta: {
        "id": "OLD_E20_SimpleFireplace",
        "originalId": "E20_SimpleFireplace",
        "gameEdition": "classic",
        "name": "简易火炉",
        "deck": "E",
        "number": 20,
        "desc": [
            "任意时刻：",
            "[<VEGETABLE> <ARROW> 2 <FOOD>]",
            "[<PIG> <ARROW> 2 <FOOD>]",
            "[<SHEEP> <ARROW> 1 <FOOD>]",
            "[<CATTLE> <ARROW> 3 <FOOD>]",
            "“烤面包”行动:",
            "[<GRAIN> <ARROW> 2 <FOOD>]"
        ],
        "cost": {
            "clay": 1
        },
        "vp": 1,
        "prerequisite": "",
        "passing": false,
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E20.png",
        "locales": {
            "zh": {
                "name": "简易火炉",
                "desc": [
                    "任意时刻：",
                    "[<VEGETABLE> <ARROW> 2 <FOOD>]",
                    "[<PIG> <ARROW> 2 <FOOD>]",
                    "[<SHEEP> <ARROW> 1 <FOOD>]",
                    "[<CATTLE> <ARROW> 3 <FOOD>]",
                    "“烤面包”行动:",
                    "[<GRAIN> <ARROW> 2 <FOOD>]"
                ],
                "prerequisite": ""
            }
        },
        "isCookery": true,
        "isBaking": true,
        "fireplaceIdentity": true,
        "exchanges": [
            {
                "from": {
                    "vegetable": 1
                },
                "to": {
                    "food": 2
                },
                "triggers": [
                    "anytime"
                ]
            },
            {
                "from": {
                    "boar": 1
                },
                "to": {
                    "food": 2
                },
                "triggers": [
                    "anytime"
                ]
            },
            {
                "from": {
                    "sheep": 1
                },
                "to": {
                    "food": 1
                },
                "triggers": [
                    "anytime"
                ]
            },
            {
                "from": {
                    "cattle": 1
                },
                "to": {
                    "food": 3
                },
                "triggers": [
                    "anytime"
                ]
            },
            {
                "from": {
                    "grain": 1
                },
                "to": {
                    "food": 2
                },
                "triggers": [
                    "bake-bread"
                ]
            }
        ]
    },
});
