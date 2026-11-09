import { expect, it } from 'vitest'
import { relocateCardImports } from '../relocate-card-imports'

it('preserves static, dynamic, re-exported and inline type import targets in nested decks', () => {
  const code = `
    import { defineMinorCard } from '../card-source'
    import './register'
    export { sibling } from './sibling'
    type Flow = import('../../contract/types').ActionFlow
    const lazy = () => import('../helpers/card-state')
    const legacy = require('./compat')
    const external = () => import('typescript')
    const text = "from '../printed-rule'"
  `
  const moved = relocateCardImports(
    code,
    '/repo/shared/cards/A/A001_Source.ts',
    '/repo/shared/cards/classic/E/OLD_E001_Source.ts',
  )

  expect(moved).toContain('from "../../card-source"')
  expect(moved).toContain('import "../../A/register"')
  expect(moved).toContain('from "../../A/sibling"')
  expect(moved).toContain('import("../../../contract/types")')
  expect(moved).toContain('import("../../helpers/card-state")')
  expect(moved).toContain('require("../../A/compat")')
  expect(moved).toContain("import('typescript')")
  expect(moved).toContain('"from \'../printed-rule\'"')
})
