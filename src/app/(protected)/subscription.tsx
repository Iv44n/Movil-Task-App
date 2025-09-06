import { useCallback } from 'react'
import {
  View,
  Pressable,
  ActivityIndicator,
  Alert,
  StyleSheet
} from 'react-native'
import { PurchasesPackage } from 'react-native-purchases'
import { router } from 'expo-router'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/shared/Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import Icon from '@/components/icons/Icon'
import ActionButton from '@/components/shared/ActionButton'
import useRevenueCat from '@/hooks/useRevenueCat'

const EntitlementId = 'Provement Pro'

export default function SubscriptionScreen() {
  const { offerings, loading, purchase } = useRevenueCat()

  const handlePurchase = useCallback(async (pkg: PurchasesPackage) => {
    try {
      const { customerInfo } = await purchase(pkg)
      if (customerInfo.entitlements.active[EntitlementId]) {
        Alert.alert('¡Éxito!', 'Tu suscripción está activa', [
          {
            text: 'OK', onPress: () => {
              const canBack = router.canGoBack()
              if (canBack) {
                router.back()
              } else {
                router.replace('(protected)')
              }
            }
          }
        ])
      }
    } catch (error: any) {
      if (!error.userCancelled) {
        Alert.alert('Error', 'No se pudo completar la compra')
      }
    }
  }, [purchase])

  const renderPackage = (pkg: PurchasesPackage) => {
    const { product } = pkg

    let periodLabel = ''
    if (product.subscriptionPeriod === 'P1M') periodLabel = 'Mensual'
    if (product.subscriptionPeriod === 'P1Y') periodLabel = 'Anual'
    if (product.subscriptionPeriod === 'P1W') periodLabel = 'Semanal'

    return (
      <Pressable
        key={pkg.identifier}
        style={({ pressed }) => [
          styles.card,
          pressed && { transform: [{ scale: 0.98 }] }
        ]}
        onPress={() => handlePurchase(pkg)}
      >

        <View style={styles.periodBadge}>
          <Typo size={15} weight='700' color='black'>
            {periodLabel}
          </Typo>
        </View>

        <View style={styles.priceContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <Typo size={33} weight='800' color='primary'>
              {product.priceString}
            </Typo>
          </View>

          <View style={{ marginTop: Sizes.spacing.s5 }}>
            <Typo size={15} color='secondary'>
              ≈ {product.pricePerWeekString} por semana
            </Typo>
          </View>
        </View>

        {[
          'Proyectos ilimitados',
          'Tareas ilimitadas',
          'Nuevas características',
          'Soporte prioritario'
        ].map((benefit, idx) => (
          <View key={idx} style={styles.benefitRow}>
            <Icon.Check size={21} color={Colors.primary} />
            <Typo size={15} style={{ marginLeft: Sizes.spacing.s5 }}>
              {benefit}
            </Typo>
          </View>
        ))}

        <ActionButton
          onPress={() => handlePurchase(pkg)}
          typoProps={{ size: 17 }}
          style={{ marginTop: Sizes.spacing.s15 }}
        >
          Suscribirme
        </ActionButton>
      </Pressable>
    )
  }

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size='large' color={Colors.primary} />
        <Typo size={17} color='secondary' style={{ marginTop: Sizes.spacing.s11 }}>
          Cargando planes...
        </Typo>
      </View>
    )
  }

  const hasOfferings = offerings?.current?.availablePackages?.length

  return (
    <ScreenWrapper isScrollable>
      <View style={styles.header}>
        <Typo size={27} weight='800' color='primary'>
          Provement Pro
        </Typo>
        <Typo
          size={15}
          color='secondary'
          style={{ marginTop: Sizes.spacing.s7, textAlign: 'center', lineHeight: 20 }}
        >
          Desbloquea todo el poder de tu productividad con proyectos ilimitados
        </Typo>
      </View>

      {hasOfferings ? (
        offerings?.current?.availablePackages?.map(renderPackage)
      ) : (
        <View style={styles.noSubscriptions}>
          <Typo size={17} color='secondary'>
            No hay planes disponibles por el momento
          </Typo>
        </View>
      )}
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: Sizes.spacing.s33,
    paddingHorizontal: Sizes.spacing.s21
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: Shapes.rounded.xl,
    padding: Sizes.spacing.s21,
    marginBottom: Sizes.spacing.s21
  },
  periodBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.yellow,
    paddingHorizontal: Sizes.spacing.s17,
    paddingVertical: Sizes.spacing.s5,
    borderRadius: Shapes.rounded.xl,
    marginBottom: Sizes.spacing.s17
  },
  priceContainer: {
    marginBottom: Sizes.spacing.s21
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.spacing.s11
  },
  subscribeBtn: {
    marginTop: Sizes.spacing.s21,
    backgroundColor: Colors.yellow,
    paddingVertical: Sizes.spacing.s15,
    borderRadius: Shapes.rounded.lg,
    alignItems: 'center',
    width: '100%'
  },
  noSubscriptions: {
    padding: Sizes.spacing.s21,
    backgroundColor: Colors.card,
    borderRadius: Shapes.rounded.lg,
    alignItems: 'center'
  }
})
