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

export { isPast, isToday }
