// Generated classic import. Remove this line before manually porting a card.
import { defineOccupationCard } from '../../card-source'
import { gainLeaf } from '../../helpers/pay-gain-node'
import type { CardImpl } from '../../registry'
import { getLogicalFields } from '../../helpers/card-field'

const CARD_ID = 'OLD_FR100_PipeSmoker'

const cardImpl = {
  effect: {
    id: CARD_ID,
    onStartHarvest: (_state, player) => {
      const grainFieldCount = getLogicalFields(player).filter((field) =>
        field.stacks.some((stack) => stack.kind === 'grain'),
      ).length
      if (grainFieldCount < 1) return

      return gainLeaf(CARD_ID, { wood: 2 })
    },
  },
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_FR100_PipeSmoker = defineOccupationCard({
  meta: {
    id: 'OLD_FR100_PipeSmoker',
    name: '烟斗客',
    deck: 'FR',
    number: 100,
    category: 'BUILDING_RESOURCES_-_WOOD',
    desc: ['每个丰收时节开始时，如果你有至少1块麦田，你获得2根木头。'],
    cost: {},
    players: '1+',
    originalId: 'FR100_PipeSmoker',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/FR/FR100.png',
  },
  impl: cardImpl,
})

export const OLD_FR100_PipeSmoker_impl = OLD_FR100_PipeSmoker.impl
