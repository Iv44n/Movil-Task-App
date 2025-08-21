import format from './formatDate'

const isPast = (date: string | Date) => {
  if (typeof date === 'string') {
    return new Date(date) < new Date()
  }
  return date < new Date()
}

const isToday = (date: string | Date) => {
  if (typeof date === 'string') {
    return new Date(date).toDateString() === new Date().toDateString()
  }
  return date.toDateString() === new Date().toDateString()
}

const todayStart = () => {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return now
}

const todayEnd = () => {
  const now = new Date()
  now.setHours(23, 59, 59, 999)
  return now
}

export { format, isPast, isToday, todayStart, todayEnd }
