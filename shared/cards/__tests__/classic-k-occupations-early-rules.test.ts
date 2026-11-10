import { describe, expect, it } from 'vitest'
import { createInitialState } from '../../session/state-bootstrap'
import { installOfficialCardRegistry } from './card-environment'
import { OLD_K273_BasinMaker } from '../classic/K/OLD_K273_BasinMaker'
import { OLD_K280_Tanner } from '../classic/K/OLD_K280_Tanner'

installOfficialCardRegistry()

describe(
  'classic K early occupation printed bonus thresholds',
  () => {
    it.each([[0, 0], [2, 1], [4, 2], [6, 4], [8, 5], [10, 6], [12, 8]])(
      'K273 scores %i stored wood as %i points, excluding positions 1, 4, 7 and 10',
      (wood, expected) => {
        const state = createInitialState(7273, { playerCount: 4, gameEdition: 'classic' })
        const owner = state.players[0]!
        const card = OLD_K273_BasinMaker
        owner.cardStates[card.meta.id] = { counters: { wood } }
        expect(card.impl.effect!.computeBonusScore!(state, owner, { categories: [] })).toBe(expected)
        expect(owner.cardStates[card.meta.id]!.counters!.wood).toBe(wood)
      },
    )
    it.each([
      [0, 0, 0],
      [1, 1, 0],
      [2, 0, 1],
      [4, 0, 2],
      [6, 0, 3],
      [8, 0, 3],
      [0, 2, 1],
      [0, 3, 2],
      [0, 4, 3],
      [0, 5, 3],
      [6, 4, 6],
    ])(
      'K280 scores %i boars and %i cattle as %i points, with each animal capped independently',
      (boar, cattle, expected) => {
        const state = createInitialState(7280, { playerCount: 4, gameEdition: 'classic' })
        const owner = state.players[0]!
        const card = OLD_K280_Tanner
        owner.cardStates[card.meta.id] = { counters: { boar, cattle } }
        expect(card.impl.effect!.computeBonusScore!(state, owner, { categories: [] })).toBe(expected)
        expect(owner.cardStates[card.meta.id]!.counters).toEqual({ boar, cattle })
      }
    )
  }
)
