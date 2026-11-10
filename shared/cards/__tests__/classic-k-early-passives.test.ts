import { describe, expect, it } from 'vitest'
import { createInitialState } from '../../session/state-bootstrap'
import type { CardEffect } from '../card-effects'
import { installOfficialCardRegistry } from './card-environment'
import { OLD_K276_Constable } from '../classic/K/OLD_K276_Constable'
import { OLD_K282_HouseSteward } from '../classic/K/OLD_K282_HouseSteward'
import { OLD_K287_StorehouseClerk } from '../classic/K/OLD_K287_StorehouseClerk'

installOfficialCardRegistry()

describe(
  'classic K early passive printed thresholds',
  () => {
    it.each([
      [1, 4], [5, 4], [6, 3], [8, 3], [9, 2], [11, 2], [12, 1], [13, 1], [14, 0],
    ])(
      'K276 and K282 grant %i-round wood correctly (%i wood)',
      (round, wood) => {
        const state = createInitialState(7287, { playerCount: 4, gameEdition: 'classic' })
        state.round = round
        for (const card of [OLD_K276_Constable, OLD_K282_HouseSteward]) {
          const effect: CardEffect = card.impl.effect!
          const flow = effect.onBuy!(state, state.players[0]!)
          expect(flow).toEqual(wood ? { type: 'leaf', actionId: 'gain', sourceCard: card.meta.id, params: { wood } } : undefined)
        }
      }
    )
    it.each([['stone', 5], ['reed', 6], ['clay', 7], ['wood', 8]] as const)(
      'K287 checks the %s threshold %i independently',
      (resource, threshold) => {
        const state = createInitialState(7287, { playerCount: 4, gameEdition: 'classic' })
        const owner = state.players[0]!
        const effect: CardEffect = OLD_K287_StorehouseClerk.impl.effect!
        Object.assign(owner.resources, { stone: 0, reed: 0, clay: 0, wood: 0 })
        owner.resources[resource] = threshold - 1
        expect(effect.onBeforeStartOfTurn!(state, owner)).toBeUndefined()
        owner.resources[resource] = threshold
        expect(effect.onBeforeStartOfTurn!(state, owner)).toEqual({
          type: 'leaf',
          actionId: 'gain',
          sourceCard: OLD_K287_StorehouseClerk.meta.id,
          params: { [resource]: 1 },
        })
        expect(owner.resources[resource]).toBe(threshold)
      }
    )
  }
)
