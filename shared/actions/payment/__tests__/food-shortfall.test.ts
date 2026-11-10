import { describe, expect, it } from 'vitest'
import type { GameState, PlayerState } from '../../../contract/types'
import { PaymentSolver, type PaymentCtx } from '../index'

function setup(food = 1, wood = 1) {
  const player = {
    id: 'payer', resources: { food, wood, clay: 0, grain: 0, begging: 0 },
    activeModifiers: [], cardStates: {}, stableTiles: [], fenceSegments: [], supplyTokensConsumed: {},
  } as unknown as PlayerState
  return { player, state: { players: [player] } as GameState }
}
const mandatory: PaymentCtx = { actionId: 'pay', costType: 'occupation', foodShortfallToBegging: true }

describe('explicit food shortfall payment policy', () => {
  it('offers and settles only actual food plus begging, without mutating previews or changing ordinary affordability', () => {
    const { player, state } = setup()
    expect(PaymentSolver.computeOptions(state, 0, { food: 3 }, { ...mandatory, foodShortfallToBegging: false })).toEqual([])
    const options = PaymentSolver.computeOptions(state, 0, { food: 3 }, mandatory)
    expect(options).toMatchObject([{ resourcesPaid: { food: 1 }, foodShortfall: 2 }])
    expect(PaymentSolver.describeOptions(state, 0, { food: 3 }, mandatory)[0]!.effectPreview).toMatchObject({
      kind: 'rule', description: { parts: [
        { effectPreview: { kind: 'payment', resourcesPaid: { food: 1 } } },
        { effectPreview: { kind: 'resourceExchange', resourcesGained: { begging: 2 } } },
      ] },
    })
    expect(player.resources).toMatchObject({ food: 1, begging: 0 })
    expect(PaymentSolver.resolvePayment(state, 0, { food: 3 }, mandatory)).toMatchObject({
      type: 'paid', receipt: { resourcesPaid: { food: 1 }, foodShortfall: 2 },
    })
    expect(player.resources).toMatchObject({ food: 0, begging: 2 })
  })

  it('preserves explicit and aggregate food reserves during selection and actual payment', () => {
    const { player, state } = setup(3)
    const context = { ...mandatory, reserveResources: { food: 2 } }
    expect(PaymentSolver.resolvePayment(state, 0, { fee: { food: 4 } }, context)).toMatchObject({
      type: 'paid', receipt: { resourcesPaid: { food: 1 }, foodShortfall: 3 },
    })
    expect(player.resources).toMatchObject({ food: 2, begging: 3 })
    player.resources.food = 3
    player.resources.grain = 1
    const cost = { fee: { food: 4, grain: 1 }, resourceReserve: { resources: ['food', 'grain'] as ('food' | 'grain')[], minimum: 3 } }
    expect(PaymentSolver.resolvePayment(state, 0, cost, mandatory)).toMatchObject({
      type: 'paid', receipt: { resourcesPaid: { food: 0, grain: 1 }, foodShortfall: 4 },
    })
    expect(player.resources).toMatchObject({ food: 3, grain: 0, begging: 7 })
  })

  it('never substitutes begging for other missing goods or borrows food for a conversion', () => {
    const { state, player } = setup(0, 0)
    expect(PaymentSolver.computeOptions(state, 0, { food: 3, wood: 1 }, mandatory)).toEqual([])
    expect(PaymentSolver.computeOptions(state, 0, {
      fee: { clay: 1 }, trades: [{ from: { food: 1 }, to: { clay: 1 }, max: 1 }],
    }, mandatory)).toEqual([])
    expect(player.resources).toMatchObject({ food: 0, wood: 0, clay: 0, begging: 0 })
    player.resources.food = 2
    expect(PaymentSolver.computeOptions(state, 0, {
      fee: { clay: 1 }, trades: [{ from: { food: 1 }, to: { clay: 1 }, max: 1 }],
    }, { ...mandatory, reserveResources: { food: 2 } })).toEqual([])
  })

  it('retains normal discounts and compares both actual goods and begging when pruning', () => {
    const { state, player } = setup()
    expect(PaymentSolver.computeOptions(state, 0, { fees: [{ food: 4 }, { food: 2 }] }, mandatory))
      .toMatchObject([{ resourcesPaid: { food: 1 }, foodShortfall: 1 }])
    const alternatives = PaymentSolver.computeOptions(state, 0, { fees: [{ food: 3 }, { food: 1, wood: 1 }] }, mandatory)
    expect(alternatives).toHaveLength(2)
    expect(alternatives).toEqual(expect.arrayContaining([
      expect.objectContaining({ resourcesPaid: expect.objectContaining({ food: 1, wood: 1 }) }),
      expect.objectContaining({ resourcesPaid: expect.objectContaining({ food: 1 }), foodShortfall: 2 }),
    ]))
    player.activeModifiers = [{ type: 'bonus', cardId: 'TEST_Discount', appliesTo: ['occupation'], discount: { food: 2 } }]
    expect(PaymentSolver.resolvePayment(state, 0, { fee: { food: 4 } }, mandatory)).toMatchObject({
      type: 'paid', receipt: { resourcesPaid: { food: 1 }, foodShortfall: 1, bonusUsed: 'TEST_Discount' },
    })
    expect(player.resources).toMatchObject({ food: 0, begging: 1 })
  })

  it('rejects a stale payment choice when its food and begging quantities have changed', () => {
    const { state, player } = setup()
    const cost = { fees: [{ food: 3 }, { food: 1, wood: 1 }] }
    const offered = PaymentSolver.resolvePayment(state, 0, cost, mandatory)
    expect(offered.type).toBe('request')
    if (offered.type !== 'request' || offered.request.request.kind !== 'choice') throw new Error('Expected payment choice')
    const debt = offered.request.request.options.find(option => option.effectPreview?.kind === 'rule')!
    player.resources.food = 2
    expect(PaymentSolver.resolvePayment(state, 0, cost, { ...mandatory, paymentChoice: debt.value }))
      .toEqual({ type: 'failed', reason: 'invalid-choice' })
    expect(player.resources).toMatchObject({ food: 2, wood: 1, begging: 0 })
  })
})
