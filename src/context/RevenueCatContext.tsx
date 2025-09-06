import React, { createContext, useEffect, useState, useCallback } from 'react'
import Purchases, { LOG_LEVEL, MakePurchaseResult, PurchasesOfferings, PurchasesPackage } from 'react-native-purchases'
import { Platform } from 'react-native'
import { useAuth } from '@clerk/clerk-expo'
import { config } from '@/lib/config'

type RevenueCatContextType = {
  offerings: PurchasesOfferings | null
  isPro: boolean
  loading: boolean
  purchase: (pkg: PurchasesPackage) => Promise<MakePurchaseResult>
  restore: () => Promise<void>
  refresh: () => Promise<void>
}

const EntitlementId = 'Provement Pro'

export const RevenueCatContext = createContext<RevenueCatContextType | undefined>(undefined)

export const RevenueCatProvider = ({ children }: { children: React.ReactNode }) => {
  const { userId } = useAuth()
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null)
  const [isPro, setIsPro] = useState(false)
  const [loading, setLoading] = useState(true)

  // Configure RevenueCat
  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE)

    if (Platform.OS === 'android') {
      Purchases.configure({ apiKey: config.revenueCatAndroidApiKey })
    }
  }, [])

  // Sync user info
  useEffect(() => {
    const sync = async () => {
      if (!userId) {
        await Purchases.logOut()
        setIsPro(false)
        return
      }

      const { customerInfo } = await Purchases.logIn(userId)
      setIsPro(typeof customerInfo.entitlements.active[EntitlementId] !== 'undefined')
    }
    sync()
  }, [userId])

  // Cargar ofertas
  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      const offerings = await Purchases.getOfferings()
      if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
        setOfferings(offerings)
      }
    } catch (err) {
      console.error('Error fetching offerings:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Comprar
  const purchase = useCallback(async (pkg: PurchasesPackage) => {
    const result = await Purchases.purchasePackage(pkg)
    if (result.customerInfo.entitlements.active[EntitlementId]) {
      setIsPro(true)
    }
    return result
  }, [])

  // Restaurar compras
  const restore = useCallback(async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo()
      setIsPro(typeof customerInfo.entitlements.active[EntitlementId] !== 'undefined')
    } catch (error) {
      console.error('Error restoring purchases:', error)
    }
  }, [])

  // Inicial cargar offerings
  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <RevenueCatContext.Provider value={{ offerings, isPro, loading, purchase, restore, refresh }}>
      {children}
    </RevenueCatContext.Provider>
  )
}
