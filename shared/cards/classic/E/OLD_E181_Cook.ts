import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { registerHarvestFeedingRequirementModifier } from '../../../actions/helpers/harvest-feeding-requirement'
const CARD_ID = 'OLD_E181_Cook'
registerHarvestFeedingRequirementModifier(
  CARD_ID,
  ({ familySize, newbornCount }) => -Math.min(3, Math.max(0, familySize - newbornCount - 2)),
)
const cardImpl = { effect: { id: CARD_ID } } satisfies CardImpl
export const OLD_E181_Cook = defineOccupationCard({
  meta: {
    id: 'OLD_E181_Cook',
    originalId: 'E181_Cook',
    gameEdition: 'classic',
    name: '厨师',
    deck: 'E',
    number: 181,
    desc: ['每个丰收时节的喂养阶段，你的第3、4、5个家庭成员各只需喂养1份食物。'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '4+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/E/E181.png',
  },
  impl: cardImpl,
})
export const OLD_E181_Cook_impl = OLD_E181_Cook.impl
