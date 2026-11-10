import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { readCardExtraData } from '../../helpers/card-state'
import { isMinorCardId } from '../../helpers/card-type'
import { constructedRoomMaterial } from '../../helpers/construct-cost'

const CARD_ID = 'OLD_K301_WoodCarver'
const cardImpl = {
  listeners: [{
    id: CARD_ID + '-discount',
    cardIds: [CARD_ID],
    actions: ['construct', 'stables', 'fence', 'improvement'],
    phases: ['computeCosts'],
    handler: context => {
      if (readCardExtraData(context.player, CARD_ID, 'usedRound') === context.state.round) return
      if (context.actionId === 'construct' && constructedRoomMaterial(context) !== 'wood') return
      if (context.actionId === 'improvement' && !isMinorCardId(context.cardId ?? '')) return
      return {
        bonuses: [{
          optional: true,
          // Full-price payment preserves this round's use and must remain selectable.
          choiceAffectsState: true,
          choices: [{ discount: { wood: 1 }, sources: [CARD_ID], minCost: { wood: 1 } }],
          sources: [CARD_ID],
        }],
      }
    },
  }, {
    id: CARD_ID + '-paid',
    cardIds: [CARD_ID],
    actions: ['pay'],
    phases: ['after'],
    handler: context => {
      if (!context.eventQuery.find('resource.paid', event => event.bonusSources?.includes(CARD_ID) === true)) return
      return {
        sourceCard: CARD_ID,
        flow: {
          type: 'leaf',
          actionId: 'special-effect',
          sourceCard: CARD_ID,
          params: { kind: 'set-extra-data', key: 'usedRound', value: context.state.round },
        },
      }
    },
  }],
} satisfies CardImpl

export const OLD_K301_WoodCarver = defineOccupationCard({
  meta: {
    id: 'OLD_K301_WoodCarver',
    originalId: 'K301_WoodCarver',
    gameEdition: 'classic',
    name: '木雕工',
    deck: 'K',
    number: 301,
    desc: ['每回合限1次：你在打次发/扩建木屋/建造马厩/围栅栏时可以少花费1根木头。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '3+',
    passing: false,
    extraVp: true,
    implemented: true,
    artUrl: '/assets/classic/K/K301.png',
    locales: {
      zh: {
        name: '木雕工',
        desc: ['每回合限1次：你在打次发/扩建木屋/建造马厩/围栅栏时可以少花费1根木头。'],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_K301_WoodCarver_impl = OLD_K301_WoodCarver.impl
