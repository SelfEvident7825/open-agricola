import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import type { CardExchange } from '../../../contract/cards'

const CARD_ID = 'OLD_K285_Tinsmith'
const cardImpl = {
  reaches: ['OLD_I66_VillageWell'],
  listeners: [{
    id: CARD_ID + '-exchanges',
    cardIds: [CARD_ID],
    actions: ['compute-exchanges'],
    phases: ['computeExchanges'],
    handler: ({ state, extraData }) => {
      if (!['anytime', 'harvest'].includes(String(extraData?.window))) return
      const wellBuilt = state.players.some(player =>
        player.improvements.includes('Major_Well') ||
        player.improvements.includes('Major_Well2') ||
        player.minorPlayed.includes('OLD_I66_VillageWell'),
      )
      const extraExchanges: CardExchange[] = [{ from: { clay: 1 }, to: { food: 1 }, triggers: ['anytime'] }]
      if (wellBuilt) extraExchanges.push({ from: { clay: 2 }, to: { food: 3 }, triggers: ['anytime'] })
      return { sourceCard: CARD_ID, extraExchanges }
    },
  },],
} satisfies CardImpl

export const OLD_K285_Tinsmith = defineOccupationCard({
  meta: {
    id: 'OLD_K285_Tinsmith',
    originalId: 'K285_Tinsmith',
    gameEdition: 'classic',
    name: '锡匠',
    deck: 'K',
    number: 285,
    desc: [
      '任意时刻，你可以将1块砖转化为1份食物。如果有人打出了A10水井/I66村中水井，则你可以将2块砖转化为3份食物。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '1+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K285.png',
  },
  impl: cardImpl,
})
