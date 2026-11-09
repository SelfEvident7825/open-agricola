import { canAccommodateAnimalTotals } from '../../../domain/animal-zones'
import { defineMinorCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { getLogicalFields } from '../../helpers/card-field'
import { gainLeaf } from '../../helpers/pay-gain-node'
const CARD_ID = 'OLD_I101_AnimalFeed'

const cardImpl = {
  prerequisiteCheck: (player) =>
    getLogicalFields(player).filter((f) => f.stacks.length > 0).length >= 4,
  effect: {
    id: CARD_ID,
    onBeforeEndGame: (state, player) => {
      const animals = Object.fromEntries(
        (['sheep', 'boar', 'cattle'] as const)
          .filter((a) => player.resources[a] > 0)
          .map((a) => [a, 1]),
      )
      if (
        !Object.keys(animals).length ||
        !canAccommodateAnimalTotals(state, player, {
          sheep: player.resources.sheep + (animals.sheep ?? 0),
          boar: player.resources.boar + (animals.boar ?? 0),
          cattle: player.resources.cattle + (animals.cattle ?? 0),
        })
      )
        return
      return {
        type: 'seq',
        optional: true,
        children: [gainLeaf(CARD_ID, animals)],
      }
    },
    projectInteractionRequest: (_state, _player, request) =>
      request.kind === 'animal-reorg' ? { ...request, anytimeWindow: { allowed: false } } : request,
  },
} satisfies CardImpl
export const OLD_I101_AnimalFeed = defineMinorCard({
  meta: {
    id: 'OLD_I101_AnimalFeed',
    originalId: 'I101_AnimalFeed',
    gameEdition: 'classic',
    name: '畜食槽',
    deck: 'I',
    number: 101,
    desc: [
      '计分阶段前，你每拥有1种动物就额外获得1只该种动物。(I101畜食槽可在E215动物租用人之前发动）（需要饲养空间，不能转化为食物)此卡牌打出条件"已播种田×4"包括卡牌田。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '已播种田×4',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/I/I101.png',
    locales: {
      zh: {
        name: '畜食槽',
        desc: [
          '计分阶段前，你每拥有1种动物就额外获得1只该种动物。(I101畜食槽可在E215动物租用人之前发动）（需要饲养空间，不能转化为食物)此卡牌打出条件"已播种田×4"包括卡牌田。',
        ],
        prerequisite: '已播种田×4',
      },
    },
  },
  impl: cardImpl,
})
export const OLD_I101_AnimalFeed_impl = OLD_I101_AnimalFeed.impl
