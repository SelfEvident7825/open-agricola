import { defineOccupationCard } from '../../card-source'
import { playerBoard } from '../../../domain'
import { readAnimalCountsForZoneAssignment } from '../../../domain/animal-zones'
import type { CardImpl } from '../../registry'
import { animalKeysForState } from '../../../contract/animals'

const CARD_ID = 'OLD_K274_OrganicFarmer'

const cardImpl = {
  effect: {
    id: CARD_ID,
    enforceReorganizeOnLastHarvest: (state, player) => animalKeysForState(state).some(animal => (player.resources[animal] ?? 0) > 0),
    computeBonusScore: (state, player) => {
      const idx = state.players.findIndex((p) => p.id === player.id)
      if (idx < 0) return 0
      const zones = playerBoard(state, idx).animals.zones()
      return zones.filter(zone => {
        if (zone.zoneType !== 'pasture' && zone.zoneType !== 'card') return false
        const count = Object.values(readAnimalCountsForZoneAssignment(zone)).reduce((sum, value) => sum + (value ?? 0), 0)
        return count > 0 && zone.capacity - count >= 3
      }).length
    },
  },
  reaches: [] as readonly string[],
} satisfies CardImpl

export const OLD_K274_OrganicFarmer = defineOccupationCard({
  meta: {
    id: 'OLD_K274_OrganicFarmer',
    name: '有机农',
    deck: 'K',
    number: 274,
    category: 'POINTS_PROVIDER',
    desc: [
      '游戏结束时，你的每个饲养了至少1只动物，且未使用的容量还足以容纳至少3只动物的圈地都使你额外获得1分。(适用于K145林间牧场、E58兽笼、I102野生保护区)',
    ],
    cost: {},
    players: '1+',
    extraVp: true,
    originalId: 'K274_OrganicFarmer',
    gameEdition: 'classic',
    vp: 0,
    prerequisite: '',
    passing: false,
    implemented: true,
    artUrl: '/assets/classic/K/K274.png',
    locales: {
      zh: {
        name: '有机农',
        desc: [
          '游戏结束时，你的每个饲养了至少1只动物，且未使用的容量还足以容纳至少3只动物的圈地都使你额外获得1分。(适用于K145林间牧场、E58兽笼、I102野生保护区)',
        ],
        prerequisite: '',
      },
    },
  },
  impl: cardImpl,
})

export const OLD_K274_OrganicFarmer_impl = OLD_K274_OrganicFarmer.impl
