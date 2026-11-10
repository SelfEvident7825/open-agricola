import { describe, expect, it } from 'vitest'
import { minorImprovementCards, occupationCards, classicMinors, classicOccupations } from '../../shared/cards/catalog'
import { createMajorImprovementSupply, standardMajorImprovementIds } from '../../shared/cards/major/supply'
import { createMoorSpecialActionCards } from '../../shared/moor/special-action-cards'
import { moorStartCardIds } from '../../shared/moor/start-cards'
import { PARENT_CARD_IDS } from '../../shared/parents'
import { seasonIds } from '../../shared/seasons/types'
import type { EncyclopediaSourceKind } from '../../shared/contract/card-encyclopedia'
import { buildEncyclopediaEntries } from '../card-encyclopedia/catalog'
import { loadEncyclopediaSources, type OrdinaryCardSource } from '../card-encyclopedia/sources'

const playerCounts = [1, 2, 3, 4, 5, 6]
const unique = (ids: readonly string[]) => [...new Set(ids)].sort()

const publishedIdentities: Record<EncyclopediaSourceKind, string[]> = {
  card: unique([...minorImprovementCards, ...occupationCards, ...classicMinors, ...classicOccupations].map((card) => card.id)),
  major: unique([
    ...standardMajorImprovementIds,
    ...playerCounts.flatMap((count) => [false, true].flatMap((enableFarmersOfTheMoor) =>
      (createMajorImprovementSupply(count, { enableFarmersOfTheMoor }) ?? []).flatMap((stack) => stack.cardIds))),
  ]),
  parent: unique(PARENT_CARD_IDS),
  moorSpecialAction: unique(playerCounts.flatMap((count) => createMoorSpecialActionCards(count).map((card) => card.id))),
  moorStart: unique(moorStartCardIds),
  season: unique(seasonIds),
}

const sources = loadEncyclopediaSources()
const entries = buildEncyclopediaEntries(sources)

describe('card encyclopedia catalog membership (D1)', () => {
  it.each(Object.entries(publishedIdentities))('lists exactly the published %s identities', (kind, expected) => {
    expect(expected.length).toBeGreaterThan(0)
    expect(unique(entries.filter((entry) => entry.sourceKind === kind).map((entry) => entry.sourceId))).toEqual(expected)
  })

  it.each([
    ['card:A004_Baseboards', 'card', 'A004_Baseboards'],
    ['major:Major_CookingHearth1', 'major', 'Major_CookingHearth1'],
    ['parent:PR01', 'parent', 'PR01'],
    ['moorSpecialAction:moor-special-1-3-work-market', 'moorSpecialAction', 'moor-special-1-3-work-market'],
    ['moorStart:moor-start-1', 'moorStart', 'moor-start-1'],
    ['season:winter', 'season', 'winter'],
  ])('keys %s by its source kind and stable source id', (key, sourceKind, sourceId) => {
    expect(entries.filter((entry) => entry.key === key).map((entry) => [entry.sourceKind, entry.sourceId])).toEqual([[sourceKind, sourceId]])
  })

  it('gives every entry a unique key', () => {
    expect(new Set(entries.map((entry) => entry.key)).size).toBe(entries.length)
    expect(entries.length).toBe(Object.values(publishedIdentities).reduce((total, ids) => total + ids.length, 0))
  })

  it('drops community, workshop, stub and unsupported-expansion cards fed through the ordinary source', () => {
    expect(sources.ordinaryCards.some((card) => card.id === 'CUSTOM_FixtureHarvester')).toBe(true)
    const counterexample = (id: string, deck: string, kind: OrdinaryCardSource['kind']): OrdinaryCardSource =>
      ({ id, name: id, deck, number: 1, desc: ['not an official card'], cost: { wood: 1 }, kind })
    const contaminated = buildEncyclopediaEntries({
      ...sources,
      ordinaryCards: [
        ...sources.ordinaryCards,
        counterexample('CUSTOM_CommunityHelper', 'community', 'minor'),
        counterexample('CUSTOM_WorkshopDraft', 'CUSTOM', 'occupation'),
        counterexample('STUB_BeforeBakeGainClay', 'STUB', 'minor'),
        counterexample('F001_FutureExpansion', 'F', 'minor'),
      ],
    })
    expect(contaminated.map((entry) => entry.key)).toEqual(entries.map((entry) => entry.key))
    expect(entries.filter((entry) => /CUSTOM_|STUB_/.test(entry.sourceId))).toEqual([])
  })

  it('marks classic reference-only cards and keeps their original printed number', () => {
    const classic = entries.filter(entry => entry.group === 'classic')
    expect(classic).toHaveLength(1024)
    expect(classic.filter(entry => entry.availableInGame)).toHaveLength(342)
    for (const [deck, expected] of [['E', 126], ['I', 91], ['K', 91]] as const) {
      const cards = classic.filter(entry => new RegExp(`^OLD_${deck}\\d`).test(entry.sourceId))
      expect(cards, `${deck} source deck`).toHaveLength(expected)
      expect(cards.every(entry => entry.availableInGame), `${deck} native availability`).toBe(true)
    }
    expect(classic.filter(entry => entry.availableInGame === false)).toHaveLength(682)
    expect(classic.find(entry => entry.sourceId === 'OLD_E30_Canoe')?.displayNumber).toBe('E30')
  })
})
