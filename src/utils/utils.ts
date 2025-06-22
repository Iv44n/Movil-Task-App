export const CapitalizeWords = (w: string) =>
  w.length > 0 ? w[0].toUpperCase() + w.slice(1) : ''
