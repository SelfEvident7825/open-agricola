import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { gainLeaf } from '../../helpers/pay-gain-node'
import { sumActionSpaceMovedToTriggerPlayer } from '../../helpers/event-provenance'

const CARD_ID = 'OLD_K297_SheepFarmer'
const cardImpl = {
  listeners: [{
    id: CARD_ID + '-sheep',
    cardIds: [CARD_ID],
    actions: ['collect', 'gain'],
    phases: ['after'],
    handler: context => sumActionSpaceMovedToTriggerPlayer(context, 'sheep') > 0
      ? { sourceCard: CARD_ID, flow: gainLeaf(CARD_ID, { sheep: 1 }) }
      : undefined,
  }],
} satisfies CardImpl

export const OLD_K297_SheepFarmer = defineOccupationCard({
  meta: {
    id: 'OLD_K297_SheepFarmer',
    originalId: 'K297_SheepFarmer',
    gameEdition: 'classic',
    name: '养羊专业户',
    deck: 'K',
    number: 297,
    desc: [
      '每当你从行动格上获得羊时，你额外获得1只羊。（通过卡牌获得的羊不算）除繁殖阶段外，你可以随时把3只羊换成1只猪+1头牛，即使没有多余饲养空间。',
    ],
    cost: {},
    exchanges: [{ from: { sheep: 3 }, to: { boar: 1, cattle: 1 }, triggers: ['anytime'] }],
    vp: 0,
    prerequisite: '',
    players: '4+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K297.png',
    locales: {
      zh: {
        name: '养羊专业户',
        desc: [
          '每当你从行动格上获得羊时，你额外获得1只羊。（通过卡牌获得的羊不算）除繁殖阶段外，你可以随时把3只羊换成1只猪+1头牛，即使没有多余饲养空间。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_K297_SheepFarmer_impl = OLD_K297_SheepFarmer.impl
