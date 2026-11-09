import { defineOccupationCard } from '../card-source';
export const OLD_E183_Basketmaker = defineOccupationCard({
    meta: {
        "id": "OLD_E183_Basketmaker",
        "originalId": "E183_Basketmaker",
        "gameEdition": "classic",
        "name": "编筐工",
        "deck": "E",
        "number": 183,
        "desc": [
            "每个丰收时节，你可以将至多1捆芦苇转化为3份食物。"
        ],
        "cost": {},
        "vp": 0,
        "prerequisite": "",
        "passing": false,
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E183.png",
        "locales": {
            "zh": {
                "name": "编筐工",
                "desc": [
                    "每个丰收时节，你可以将至多1捆芦苇转化为3份食物。"
                ],
                "prerequisite": ""
            }
        },
        "exchanges": [
            {
                "from": {
                    "reed": 1
                },
                "to": {
                    "food": 3
                },
                "triggers": [
                    "harvest"
                ],
                "max": 1
            }
        ]
    },
});
