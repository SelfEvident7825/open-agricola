import { defineOccupationCard } from '../card-source';
import type { CardImpl } from '../registry';
const CARD_ID = 'OLD_E216_AnimalKeeper';
const cardImpl = { effect: {
        id: CARD_ID, onComputeAnimalZones: (_player, zones) => {
            for (const zone of zones)
                if (zone.zoneType === 'pasture')
                    zone.allowedAnimalType = null;
        }
    } } satisfies CardImpl;
export const OLD_E216_AnimalKeeper = defineOccupationCard({
    meta: {
        "id": "OLD_E216_AnimalKeeper",
        "originalId": "E216_AnimalKeeper",
        "gameEdition": "classic",
        "name": "动物管理员",
        "deck": "E",
        "number": 216,
        "desc": [
            "你的每个圈地可以饲养不同种类的动物。(K145林间牧场除外)"
        ],
        "cost": {},
        "vp": 0,
        "prerequisite": "",
        "players": "4+",
        "passing": false,
        "extraVp": false,
        "implemented": true,
        "artUrl": "/card-art/classic/E216.png",
        "locales": {
            "zh": {
                "name": "动物管理员",
                "desc": [
                    "你的每个圈地可以饲养不同种类的动物。(K145林间牧场除外)"
                ],
                "prerequisite": ""
            }
        }
    },
    impl: cardImpl,
});
export const OLD_E216_AnimalKeeper_impl = OLD_E216_AnimalKeeper.impl;
