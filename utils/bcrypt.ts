import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

export const hashValue = async (value: string) => await bcrypt.hash(value, SALT_ROUNDS)

export const compareValue = async (value: string, hashedValue: string) => await bcrypt.compare(value, hashedValue).catch(() => false)
