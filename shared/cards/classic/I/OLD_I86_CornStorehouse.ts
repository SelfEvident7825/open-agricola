import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import type { ActionFlow } from '../../../contract/types'
const CARD_ID = 'OLD_I86_CornStorehouse'
const sow = (): ActionFlow => ({
  type: 'leaf',
  actionId: 'sow',
  optional: true,
  sourceCard: CARD_ID,
  actionContext: { cropType: 'grain', sowStackDelta: -1 },
})
const cardImpl = {
  effect: { id: CARD_ID, onEndHarvestFieldPhase: () => sow() },
  listeners: [
    {
      id: CARD_ID + '-private-field',
      cardIds: [CARD_ID],
      actions: ['reap'],
      phases: ['after'],
      handler: (context) =>
        context.actionContext?.trigger &&
        (context.actionContext.trigger as { phase?: string }).phase === 'private-field-phase'
          ? { sourceCard: CARD_ID, flow: sow() }
          : undefined,
    },
  ],
} satisfies CardImpl
export const OLD_I86_CornStorehouse = defineMinorCard({
  meta: {
    id: 'OLD_I86_CornStorehouse',
    originalId: 'I86_CornStorehouse',
    gameEdition: 'classic',
    name: '谷仓',
    deck: 'I',
    number: 86,
    desc: [
      '每个丰收时节的收割阶段后，你可以在你的空田上播种小麦，如此播种时每列小麦少放置1份小麦。可触发I86谷仓效果：I92肥料、FR005艺术花园、G061历书、G118冬季花园、NL047早熟麦。不可触发I86谷仓效果：G115养鱼场、G080秋收盛宴、WM014轮耕农、NL104小麦收割工。',
    ],
    cost: {},
    vp: 1,
    prerequisite: '',
    passing: false,
    extraVp: true,
    implemented: true,
    artUrl: '/assets/classic/I/I86.png',
    altCosts: [
      {
        wood: 2,
        reed: 2,
      },
      {
        clay: 2,
        reed: 2,
      },
    ],
  },
  impl: cardImpl,
})
export const OLD_I86_CornStorehouse_impl = OLD_I86_CornStorehouse.impl
