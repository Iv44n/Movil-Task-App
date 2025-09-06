import { RevenueCatContext } from '@/context/RevenueCatContext'
import { useContext } from 'react'

export default function useRevenueCat() {
  const ctx = useContext(RevenueCatContext)
  if (!ctx) throw new Error('useRevenueCat must be used inside RevenueCatProvider')
  return ctx
}
