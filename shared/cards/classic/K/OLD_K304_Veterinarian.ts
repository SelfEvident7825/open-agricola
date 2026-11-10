import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { rollAndCacheCardPick } from '../../helpers/card-random'
import { readCardExtraData, writeCardExtraData } from '../../helpers/card-state'
import { gainLeaf } from '../../helpers/pay-gain-node'

const CARD_ID = 'OLD_K304_Veterinarian'
type BagAnimal = 'sheep' | 'boar' | 'cattle'
const INITIAL_BAG: BagAnimal[] = ['sheep', 'sheep', 'sheep', 'sheep', 'boar', 'boar', 'boar', 'cattle', 'cattle']
const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: (_state, player) => {
      writeCardExtraData(player, CARD_ID, 'bag', [...INITIAL_BAG])
    },
    onRoundStart: (state, player, context) => {
      if (readCardExtraData(player, CARD_ID, 'drawRound') === state.round) return
      const bag = readCardExtraData<BagAnimal[]>(player, CARD_ID, 'bag') ?? []
      if (bag.length < 2) return
      // Ordered pairs sample without replacement; duplicate labels retain their physical weight.
      const pairs = bag.flatMap((first, i) => bag.flatMap((second, j) =>
        i === j ? [] : [[first, second] as const],
      ))
      const draw = rollAndCacheCardPick(
        state, player, CARD_ID, 'draw-' + state.round, pairs, context?.reportProtectedObservation,
      )
      writeCardExtraData(player, CARD_ID, 'drawRound', state.round)
      state.pendingUndoBoundary = true
      if (draw[0] !== draw[1]) return
      const nextBag = [...bag]
      nextBag.splice(nextBag.indexOf(draw[0]), 1)
      writeCardExtraData(player, CARD_ID, 'bag', nextBag)
      return gainLeaf(CARD_ID, { [draw[0]]: 1 })
    },
  },
} satisfies CardImpl

export const OLD_K304_Veterinarian = defineOccupationCard({
  meta: {
    id: 'OLD_K304_Veterinarian',
    originalId: 'K304_Veterinarian',
    gameEdition: 'classic',
    name: '兽医',
    deck: 'K',
    number: 304,
    desc: [
      '打出时在一个袋子里放进4只羊+3只猪+2头牛，每回合开始时，随机抽取两只动物。如果抽出的两只动物相同，则你留下1只，放回1只。如果动物不同，则全部放回。',
    ],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '3+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K304.png',
    locales: {
      zh: {
        name: '兽医',
        desc: [
          '打出时在一个袋子里放进4只羊+3只猪+2头牛，每回合开始时，随机抽取两只动物。如果抽出的两只动物相同，则你留下1只，放回1只。如果动物不同，则全部放回。',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_K304_Veterinarian_impl = OLD_K304_Veterinarian.impl
