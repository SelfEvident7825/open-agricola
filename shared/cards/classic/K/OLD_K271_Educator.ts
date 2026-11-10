import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { countTriggerCardsAs } from '../../helpers/trigger-snapshot'

const CARD_ID = 'OLD_K271_Educator'
const cardImpl = {
  listeners: [{
    id: CARD_ID + '-opponent-occupation',
    cardIds: [CARD_ID],
    actions: ['occupation'],
    phases: ['after'],
    scope: 'opponent',
    handler: (context) => {
      const owner = context.ownerPlayer
      if (!owner || owner.occupationHand.length === 0) return
      return {
        sourceCard: CARD_ID,
        flow: {
          type: 'leaf',
          actionId: 'occupation',
          sourceCard: CARD_ID,
          targetPlayerId: owner.id,
          optional: true,
          params: { exactCost: { food: countTriggerCardsAs(context, owner, 'occupation') >= 3 ? 2 : 3 } },
        },
      }
    },
  }],
} satisfies CardImpl

export const OLD_K271_Educator = defineOccupationCard({
  meta: {
    id: 'OLD_K271_Educator',
    originalId: 'K271_Educator',
    gameEdition: 'classic',
    name: '教育家',
    deck: 'K',
    number: 271,
    desc: [
      '每当其他玩家打出一张职业卡时，你可以支付3份食物来打出一张职业卡。从你的第4张职业卡开始，改为2食物。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K271.png',
    locales: {
      zh: {
        name: '教育家',
        desc: [
          '每当其他玩家打出一张职业卡时，你可以支付3份食物来打出一张职业卡。从你的第4张职业卡开始，改为2食物。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})
