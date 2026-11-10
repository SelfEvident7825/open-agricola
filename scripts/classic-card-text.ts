/** Normalize legacy English resource words while preserving named actions and phrases. */
export const normalizeClassicDescription = (text: string): string => text
  .split(/(<[^>]+>|__[^_]+__|"[^"]+"|\b(?:wood|clay|stone)(?:\/(?:wood|clay|stone))* (?:houses?|rooms?)\b|\bwooden (?:houses?|rooms?)\b|\bfield (?:phase|worker)\b|\bRiding Stables\b)/gi)
  .map((part, index) => index % 2 === 1 ? part : part.replace(
    /\b(fields?|fences?|stables?|wood)\b/gi,
    word => `<${word.replace(/s$/i, '').toUpperCase()}>`,
  ))
  .join('')
