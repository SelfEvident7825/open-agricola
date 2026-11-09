import path from 'node:path'
import ts from 'typescript'

/** Preserve module targets when a card is copied into a different deck directory. */
export function relocateCardImports(code: string, sourcePath: string, targetPath: string): string {
  const source = ts.createSourceFile(sourcePath, code, ts.ScriptTarget.Latest, true)
  const replacements: Array<{ start: number; end: number; text: string }> = []
  const visit = (node: ts.Node) => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const parent = node.parent
      const isModule =
        ((ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent)) &&
          parent.moduleSpecifier === node) ||
        ts.isExternalModuleReference(parent) ||
        (ts.isLiteralTypeNode(parent) && ts.isImportTypeNode(parent.parent)) ||
        (ts.isCallExpression(parent) &&
          parent.arguments[0] === node &&
          (parent.expression.kind === ts.SyntaxKind.ImportKeyword ||
            (ts.isIdentifier(parent.expression) && parent.expression.text === 'require')))
      if (isModule && /^\.\.?\//.test(node.text)) {
        const relative = path
          .relative(path.dirname(targetPath), path.resolve(path.dirname(sourcePath), node.text))
          .split(path.sep)
          .join('/')
        replacements.push({
          start: node.getStart(source),
          end: node.getEnd(),
          text: JSON.stringify(relative.startsWith('.') ? relative : `./${relative}`),
        })
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
  for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
    code = code.slice(0, replacement.start) + replacement.text + code.slice(replacement.end)
  }
  return code
}
