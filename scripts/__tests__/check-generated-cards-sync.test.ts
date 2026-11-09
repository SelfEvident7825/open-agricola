import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { buildRegisterAll } from '../generate-register-all'
import { checkGeneratedCardsSync } from '../check-generated-cards-sync'

const writeSource = (filePath: string, source: string) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, source, 'utf8')
}

describe('checkGeneratedCardsSync', () => {
  it('keeps nested classic decks in the catalog and registers only implemented cards', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'generated-classic-decks-'))
    const cardsRoot = path.join(tmp, 'shared', 'cards')
    try {
      writeSource(
        path.join(cardsRoot, 'classic', 'E', 'OLD_E001_Source.ts'),
        `export const OLD_E001_Source = defineMinorCard({
          meta: { id: 'OLD_E001_Source', name: 'Classic E', deck: 'E', number: 1, desc: [], cost: {}, gameEdition: 'classic' },
          impl: {},
        })`,
      )
      writeSource(
        path.join(cardsRoot, 'classic', 'I', 'OLD_I001_Reference.ts'),
        `export const OLD_I001_Reference = defineOccupationCard({
          meta: { id: 'OLD_I001_Reference', name: 'Classic I', deck: 'I', number: 1, desc: [], cost: {}, gameEdition: 'classic', implemented: false },
        })`,
      )
      writeSource(
        path.join(cardsRoot, 'classic', 'E', '__tests__', 'fixture.ts'),
        `export const TEST_Only = defineMinorCard({ meta: { id: 'TEST_Only' }, impl: {} })`,
      )

      const generated = buildRegisterAll({ repoRoot: tmp })

      expect(generated.catalogDefinitionCount).toBe(2)
      expect(generated.catalogGenerated).toContain('OLD_E001_Source')
      expect(generated.catalogGenerated).toContain('OLD_I001_Reference')
      expect(generated.implCount).toBe(1)
      expect(generated.registerAll).toContain("from './classic/E/OLD_E001_Source'")
      expect(generated.registerAll).not.toContain('OLD_I001_Reference')
      expect(generated.registerAll).not.toContain('TEST_Only')
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true })
    }
  })

  it('reports stale generated Card Source catalog artifacts without rewriting them', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'generated-cards-sync-'))
    const cardsRoot = path.join(tmp, 'shared', 'cards')
    const majorRoot = path.join(cardsRoot, 'major')

    writeSource(
      path.join(cardsRoot, 'A', 'A001_Source.ts'),
      `import { defineMinorCard } from '../card-source'\n` +
      `export const A001_Source = defineMinorCard({\n` +
      `  meta: { id: 'A001_Source', name: 'Source', deck: 'A', number: 1, desc: [], cost: {} },\n` +
      `})\n`,
    )
    writeSource(
      path.join(majorRoot, 'well.ts'),
      `import { defineMajorCard } from '../card-source'\n` +
      `export const Well = defineMajorCard({\n` +
      `  meta: { id: 'Well', name: 'Well', deck: 'major', number: 1, desc: [], cost: {}, vp: 0, extraVp: false },\n` +
      `})\n`,
    )

    const generated = buildRegisterAll({ repoRoot: tmp })
    writeSource(path.join(cardsRoot, 'register-all.ts'), `${generated.registerAll}// stale\n`)
    writeSource(path.join(cardsRoot, 'catalog.generated.ts'), generated.catalogGenerated)
    writeSource(path.join(majorRoot, 'generated.ts'), generated.majorGenerated)
    writeSource(path.join(majorRoot, 'runtime.generated.ts'), generated.majorRuntimeGenerated)

    const result = checkGeneratedCardsSync(tmp)

    expect(result.ok).toBe(false)
    expect(result.staleFiles).toEqual(['shared/cards/register-all.ts'])
    expect(fs.readFileSync(path.join(cardsRoot, 'register-all.ts'), 'utf8')).toContain('// stale')

    fs.rmSync(tmp, { recursive: true, force: true })
  })
})
