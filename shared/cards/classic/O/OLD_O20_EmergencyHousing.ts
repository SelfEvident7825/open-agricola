// Generated classic import. Remove this line before manually porting a card.
import { defineMinorCard } from '../../card-source'
export const OLD_O20_EmergencyHousing = defineMinorCard({
  meta: {
    id: 'OLD_O20_EmergencyHousing',
    originalId: 'O20_EmergencyHousing',
    gameEdition: 'classic',
    name: '临时住宅',
    deck: 'O',
    number: 20,
    desc: [
      '你的一个你已建造的马厩失去其原有功能，并可以容纳1名家庭成员。计分时该马厩仍然视作马厩。',
    ],
    cost: {
      wood: 1,
      reed: 1,
    },
    vp: 0,
    prerequisite: '1马厩',
    passing: false,
    extraVp: false,
    implemented: false,
    artUrl: '/assets/classic/O/O20.png',
    locales: {
      zh: {
        name: '临时住宅',
        desc: [
          '你的一个你已建造的马厩失去其原有功能，并可以容纳1名家庭成员。计分时该马厩仍然视作马厩。',
        ],
        prerequisite: '1马厩',
      },
    },
  },
})
