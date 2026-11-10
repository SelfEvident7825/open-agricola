import { describe, expect, it } from 'vitest'
import { normalizeClassicDescription } from '../classic-card-text'

describe('classic card description import', () => {
  it('normalizes the legacy PI resource words without changing the harvest phase', () => {
    expect(normalizeClassicDescription(
      'In the field phase of each harvest, if you have at least 2/4/6/7 fields, you get 1/2/3/4 <FOOD>.',
    )).toBe('In the field phase of each harvest, if you have at least 2/4/6/7 <FIELD>, you get 1/2/3/4 <FOOD>.')
    expect(normalizeClassicDescription('Pay wood for fences around unfenced stables.'))
      .toBe('Pay <WOOD> for <FENCE> around unfenced <STABLE>.')
  })

  it('preserves action references, named cards, house materials and existing icons', () => {
    const text = '__space:farmland|Farmland__ __Wood__ "Wood Collector" Riding Stables; '
      + 'wood houses, wooden rooms, wood/clay/stone rooms, field worker, <FIELD> <WOOD> 木头。'
    expect(normalizeClassicDescription(text)).toBe(text)
  })

  it('is idempotent when generated descriptions are imported again', () => {
    const text = normalizeClassicDescription('Plow 2 fields, build a stable, or take wood.')
    expect(normalizeClassicDescription(text)).toBe(text)
  })
})
