export type GameEdition = 'revised' | 'classic'
export const classicDeckIds = ['E', 'I', 'K', 'WM', 'FR', 'FL', 'WA', 'G', 'Z', 'NL', 'O', 'C', 'PI', 'BI'] as const
export const gameEditionOf = (value: unknown): GameEdition => value === 'classic' ? 'classic' : 'revised'
export const classicSetupError = (raw: Record<string, unknown>): string | null => {
  if (raw.gameEdition !== undefined && raw.gameEdition !== 'classic' && raw.gameEdition !== 'revised') return 'Unknown game edition'
  if (raw.gameEdition !== 'classic') return null
  if ((raw.playerCount ?? raw.maxPlayers ?? 2) !== 4) return 'Classic Agricola currently requires four players'
  if (['enableCommunityDeck', 'enableParentCards', 'enableThroughTheSeasons', 'enableFarmersOfTheMoor'].some(key => raw[key] === true)
    || ['extraMinorIds', 'extraOccupationIds', 'customCardIds'].some(key => Array.isArray(raw[key]) && (raw[key] as unknown[]).length)) return 'Classic Agricola cannot be combined with expansions or custom cards'
  return null
}
