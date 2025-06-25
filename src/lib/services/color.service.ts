import { AppError } from '@/errors/AppError'
import { ColorRepository } from '../repositories/color.repository'

export const ColorService = {
  createColor: async ({ userId, color }: { userId: number, color: string }) => {
    try {
      return await ColorRepository.createColor({ userId, color })
    } catch (error: any) {
      if(error instanceof AppError) {
        throw error
      }
      throw new AppError(error.message, 'AddColorError', 'ADD_COLOR_ERROR')
    }
  },
  getAllColors: async (userId: number) => {
    try {
      return ColorRepository.getAllColors(userId)
    } catch (error: any) {
      if(error instanceof AppError) {
        throw error
      }
      throw new AppError(error.message, 'GetColorsError', 'GET_COLORS_ERROR')
    }
  }
}
