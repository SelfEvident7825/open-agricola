import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { parseCardFile } from './build-cards-manifest'
import { relocateCardImports } from './relocate-card-imports'

type Legacy = {
  id: string
  kind: 'minor' | 'occupation'
  meta: Record<string, unknown>
  methods: Record<string, string>
  path: string
  sha256: string
}
const root = path.resolve(import.meta.dirname, '..')
const source: Legacy[] = JSON.parse(
  fs.readFileSync(path.join(root, 'reference/classic/source-cards.json'), 'utf8'),
)
const matches: Record<string, string> = JSON.parse(
  fs.readFileSync(path.join(root, 'reference/classic/native-matches.json'), 'utf8'),
)
const imageRoot = process.argv[2]
const assetsRoot = process.argv[3]
const out = path.join(root, 'shared/cards/classic')
fs.mkdirSync(out, { recursive: true })
if (imageRoot && (!assetsRoot || !fs.existsSync(path.join(assetsRoot, 'assets')))) {
  throw new Error(
    'Supply the open-agricola-assets checkout as the second argument when importing artwork.',
  )
}
type MigrationReport = {
  id: string
  originalId: string
  kind: string
  source: string
  sourceSha256: string
  status: string
  reusedFrom?: string
  manual?: boolean
}
const reportPath = path.join(root, 'docs/classic/migration-manifest.json')
const previousReports: MigrationReport[] = fs.existsSync(reportPath)
  ? JSON.parse(fs.readFileSync(reportPath, 'utf8'))
  : []
const reports: MigrationReport[] = []
const printed = (v: unknown): string => String(v ?? '').replaceAll('<BREAD>', '<BAKE>')
const cost = (v: unknown): Record<string, number> =>
  Object.fromEntries(
    Object.entries((v ?? {}) as Record<string, unknown>).map(([k, v]) => [
      k === 'pig' ? 'boar' : k,
      Number(v),
    ]),
  )
for (const old of source) {
  const id = `OLD_${old.id}`
  const deck = String(old.meta.deck)
  const target = path.join(out, deck, `${id}.ts`)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  // Hand-written ports survive regeneration. The importer owns only its marked output.
  if (imageRoot) {
    const prefix = old.id.split('_')[0]!
    const candidates = [deck, deck === 'BI' ? 'Bi' : deck].flatMap((d) =>
      [prefix, `${deck}${String(old.meta.number).padStart(3, '0')}`].map((p) =>
        path.join(imageRoot, `deck${d}`, `${p}.png`),
      ),
    )
    const image = candidates.find((p) => fs.existsSync(p))
    if (!image) throw new Error(`Missing artwork: ${old.id}`)
    const artDir = path.join(assetsRoot!, 'assets/classic', deck)
    fs.mkdirSync(artDir, { recursive: true })
    fs.copyFileSync(image, path.join(artDir, `${prefix}.png`))
  }
  if (
    fs.existsSync(target) &&
    !fs.readFileSync(target, 'utf8').startsWith('// Generated classic import.')
  ) {
    const card = parseCardFile(target).metas.find((card) => card.id === id)
    if (!card) throw new Error(`Missing manual card metadata: ${id}`)
    reports.push({
      ...previousReports.find((row) => row.id === id),
      id,
      originalId: old.id,
      kind: old.kind,
      source: old.path,
      sourceSha256: old.sha256,
      status: card.implemented === false ? 'reference-only' : 'native-port',
      manual: true,
    })
    continue
  }
  const mapped = matches[old.id]
  let code = mapped
    ? fs.readFileSync(path.join(root, 'shared/cards', mapped[0]!, `${mapped}.ts`), 'utf8')
    : ''
  const native = mapped
    ? parseCardFile(path.join(root, 'shared/cards', mapped[0]!, `${mapped}.ts`)).metas.find(
        (c) => c.id === mapped,
      )
    : undefined
  const { type: _type, ...base } = native ?? { type: old.kind }
  const originalPrerequisite = printed(old.meta.prerequisite)
  const prerequisite = originalPrerequisite
    .replace(/职业\s*[×xX]\s*(\d+)/g, '$1 Occupations')
    .replace(/麦田\s*[×xX]\s*(\d+)/g, '$1 Grain Fields')
    .replace('木屋阶段', 'Still in Wooden House')
  const meta = {
    ...base,
    id,
    originalId: old.id,
    gameEdition: 'classic',
    name: printed(old.meta.name),
    deck: String(old.meta.deck),
    number: Number(old.meta.number),
    desc: ((old.meta.desc ?? []) as unknown[]).map(printed),
    cost: cost(old.meta.cost),
    vp: Number(old.meta.vp ?? 0),
    prerequisite,
    occupationPrerequisites: old.meta.occupationPrerequisites ?? undefined,
    improvementPrerequisites: old.meta.improvementPrerequisites ?? undefined,
    players: old.meta.players ?? undefined,
    passing: old.meta.passing === true,
    extraVp: old.meta.extraVp === true,
    implemented: !!mapped,
    artUrl: `/assets/classic/${deck}/${old.id.split('_')[0]}.png`,
  }
  if (mapped) {
    const sf = ts.createSourceFile(target, code, ts.ScriptTarget.Latest, true)
    let span: { start: number; end: number } | undefined
    const visit = (n: ts.Node) => {
      if (ts.isPropertyAssignment(n) && n.name.getText(sf) === 'meta')
        span = { start: n.initializer.getStart(sf), end: n.initializer.getEnd() }
      ts.forEachChild(n, visit)
    }
    visit(sf)
    if (!span) throw new Error(`No metadata for ${mapped}`)
    code = code.slice(0, span.start) + JSON.stringify(meta, null, 2) + code.slice(span.end)
    code = code.replaceAll(mapped, id)
    if ((code.match(/\bCARD_ID\b/g) ?? []).length === 1)
      code = code.replace(/^const CARD_ID = .*\n/m, '')
    const prefix = mapped.match(/^([A-E])0*(\d+)_/)
    if (prefix) code = code.replace(new RegExp(`${prefix[1]}0*${prefix[2]}-`, 'gi'), `${id}-`)
    const short = mapped.replace(/^([A-E])0+(\d)/, '$1$2')
    if (short !== mapped) code = code.replaceAll(short, id)
    code = relocateCardImports(code, path.join(root, 'shared/cards', mapped[0]!, `${mapped}.ts`), target)
  } else {
    code = `import { ${old.kind === 'minor' ? 'defineMinorCard' : 'defineOccupationCard'} } from '../../card-source'\nexport const ${id} = ${old.kind === 'minor' ? 'defineMinorCard' : 'defineOccupationCard'}({ meta: ${JSON.stringify(meta, null, 2)} })\n`
  }
  fs.writeFileSync(
    target,
    `// Generated classic import. Remove this line before manually porting a card.\n${code}`,
  )

  reports.push({
    id,
    originalId: old.id,
    kind: old.kind,
    source: old.path,
    sourceSha256: old.sha256,
    status: mapped ? 'native-port' : 'reference-only',
    reusedFrom: mapped,
  })
}
fs.mkdirSync(path.join(root, 'docs/classic'), { recursive: true })
fs.writeFileSync(
  path.join(root, 'docs/classic/migration-manifest.json'),
  JSON.stringify(reports, null, 2) + '\n',
)
console.log(
  `Imported ${reports.length} faces; ${reports.filter((row) => row.status === 'native-port').length} native ports`,
)
