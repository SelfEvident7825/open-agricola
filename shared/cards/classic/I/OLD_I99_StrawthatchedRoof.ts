import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { getLogicalFields } from '../../helpers/card-field'
const CARD_ID = 'OLD_I99_StrawthatchedRoof'

const cardImpl = {
  prerequisiteCheck: (player) =>
    getLogicalFields(player).filter((f) => f.stacks.some((s) => s.kind === 'grain')).length >= 3,
  modifiers: [
    {
      type: 'remove-resource',
      cardId: CARD_ID,
      appliesTo: ['construct', 'renovation'],
      resources: ['reed'],
    },
  ],
} satisfies CardImpl
export const OLD_I99_StrawthatchedRoof = defineMinorCard({
  meta: {
    id: 'OLD_I99_StrawthatchedRoof',
    originalId: 'I99_StrawthatchedRoof',
    gameEdition: 'classic',
    name: '麦造屋顶',
    deck: 'I',
    number: 99,
    desc: ['从现在起，你建造房屋和翻修房屋时都不再需要芦苇了。此卡牌打出条件“麦田×3”包括卡牌田。'],
    cost: {},
    vp: 1,
    prerequisite: '3 Grain Fields',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I99.png',
    locales: {
      zh: {
        name: '麦造屋顶',
        desc: [
          '从现在起，你建造房屋和翻修房屋时都不再需要芦苇了。此卡牌打出条件“麦田×3”包括卡牌田。',
        ],
        prerequisite: '麦田×3',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_I99_StrawthatchedRoof_impl = OLD_I99_StrawthatchedRoof.impl
