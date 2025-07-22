const isPast = (date: string | Date) => {
  if (typeof date === 'string') {
    return new Date(date) < new Date()
  }
  return date < new Date()
}

const isToday = (date: string | Date) => {
  if (typeof date === 'string') {
    return new Date(date).getDate() === new Date().getDate()
  }
  return date.getDate() === new Date().getDate()
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

export { isPast, isToday, todayStart, todayEnd }
