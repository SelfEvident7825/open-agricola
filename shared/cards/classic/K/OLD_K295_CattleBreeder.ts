import { defineOccupationCard } from '../../card-source'
import type { CardImpl } from '../../registry'
import { gainLeaf } from '../../helpers/pay-gain-node'
import { breedLeaf } from '../../../actions/effects/breed'

const CARD_ID = 'OLD_K295_CattleBreeder'
const cardImpl = {
  effect: {
    id: CARD_ID,
    onBuy: () => gainLeaf(CARD_ID, { cattle: 1 }),
    onAfterRoundEnd: state => state.round === 12 ? breedLeaf(CARD_ID, ['cattle']) : undefined,
  },
} satisfies CardImpl

export const OLD_K295_CattleBreeder = defineOccupationCard({
  meta: {
    id: 'OLD_K295_CattleBreeder',
    originalId: 'K295_CattleBreeder',
    gameEdition: 'classic',
    name: '野牛哺育师',
    deck: 'K',
    number: 295,
    desc: ['打出时立即获得1头牛。在第12回合结束时，你的牛将会进行一次繁殖。（需有饲养空间）'],
    cost: {},
    vp: 0,
    prerequisite: '',
    players: '3+',
    passing: false,
    extraVp: false,
    implemented: true,
    artUrl: '/assets/classic/K/K295.png',
  },
  impl: cardImpl,
})

export const OLD_K295_CattleBreeder_impl = OLD_K295_CattleBreeder.impl
