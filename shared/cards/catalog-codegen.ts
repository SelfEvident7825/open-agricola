/** Keep catalog generation and Workshop PR patches on the same bounded array layout. */
export function renderCatalogDefinitionBatches(definitions: readonly string[]): string {
  const batchSize = 100
  const batches: string[] = []
  const names: string[] = []
  for (let offset = 0; offset < definitions.length; offset += batchSize) {
    const name = `batch${names.length}`
    names.push(name)
    batches.push(`const ${name}: readonly GeneratedCatalogCardDefinition[] = [\n${
      definitions.slice(offset, offset + batchSize).join('\n')
    }\n]`)
  }
  const catalog = `export const catalogCardDefinitions: readonly GeneratedCatalogCardDefinition[] = [${
    names.map(name => `...${name}`).join(', ')
  }]`
  return [...batches, catalog].join('\n')
}
