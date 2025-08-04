type TokenMap = Record<string, (date: Date, locale: string) => string>

enum Format {
  Full = 'full',
  Long = 'long',
  Medium = 'medium',
  Short = 'short'
}
const tokenMap: TokenMap = {
  // year
  YY: (d) => d.getFullYear().toString().slice(-2), // 22
  YYYY: (d) => d.getFullYear().toString(), // 2022

  // month
  M: (d) => (d.getMonth() + 1).toString(), // 1
  MM: (d) => String(d.getMonth() + 1).padStart(2, '0'), // 01
  MMM: (d, l) => d.toLocaleString(l, { month: 'short' }), // Jan
  MMMM: (d, l) => d.toLocaleString(l, { month: 'long' }), // January

  // day
  D: (d) => d.getDate().toString(), // 1
  DD: (d) => String(d.getDate()).padStart(2, '0'), // 01
  d: (d) => d.getDay().toString(), // 0 --> 6 (0 = Sunday) --> 6 = Saturday
  ddd: (d, l) => d.toLocaleString(l, { weekday: 'short' }), // Mon
  dddd: (d, l) => d.toLocaleString(l, { weekday: 'long' }), // Monday

  // hour
  h: (d) => {
    const h = d.getHours() % 12 || 12
    return h.toString()
  }, // 2
  hh: (d) => {
    const h = d.getHours() % 12 || 12
    return String(h).padStart(2, '0')
  }, // 02

  // minutes
  m: (d) => d.getMinutes().toString(), // 3
  mm: (d) => String(d.getMinutes()).padStart(2, '0'), // 03

  // seconds
  s: (d) => d.getSeconds().toString(), // 5
  ss: (d) => String(d.getSeconds()).padStart(2, '0'), // 05

  // AM/PM
  a: (d, l) => d.toLocaleTimeString(l, { hour: 'numeric', hour12: true }).split(' ')[1]?.toLowerCase() || '', // am
  A: (d, l) => d.toLocaleTimeString(l, { hour: 'numeric', hour12: true }).split(' ')[1]?.toUpperCase() || '' // AM
}

const formatOptionsMap: Record<Format, Intl.DateTimeFormatOptions> = {
  [Format.Full]: {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  },
  [Format.Long]: {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  },
  [Format.Medium]: {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  },
  [Format.Short]: {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit'
  }
}

interface FormatDate {
  format: Format | string
  locale?: string
}

export default function format(
  date: Date | string,
  options?: FormatDate
): string {
  const d = typeof date === 'string' ? new Date(date) : date

  if (!options?.format) {
    return d.toLocaleDateString(options?.locale)
  }

  const { format: formatKey, locale } = options
  const isKnownFormat = Object.values(Format).includes(formatKey as Format)

  const formatOptions = isKnownFormat
    ? formatOptionsMap[formatKey as Format]
    : undefined

  if (isKnownFormat) {
    return d.toLocaleDateString(locale, formatOptions)
  }

  const sortedTokens = Object.keys(tokenMap).sort((a, b) => b.length - a.length)
  const regex = new RegExp(sortedTokens.join('|'), 'g')

  return formatKey.replace(regex, (match) => {
    const formatter = tokenMap[match]
    return formatter ? formatter(d, options.locale ?? 'en-US') : match
  })
}
