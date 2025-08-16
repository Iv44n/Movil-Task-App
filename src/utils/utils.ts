export const CapitalizeWords = (w: string) =>
  w.length > 0 ? w[0].toUpperCase() + w.slice(1) : ''

export function formatProjectName(name: string): { firstPart: string; remaining: string } {
  const words = name.trim().split(' ').filter(Boolean).map(CapitalizeWords)
  if (words.length === 0) return { firstPart: '', remaining: '' }

  let [firstWord = '', ...rest] = words

  if (rest.length > 0 && firstWord.length < 5 && rest[0].length < 7) {
    firstWord = `${firstWord} ${rest[0]}`
    rest = rest.slice(1)
  }

  return {
    firstPart: firstWord,
    remaining: rest.join(' ')
  }
}
