import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import Typo from '@/components/shared/Typo'
import ScreenWrapper from '@/components/ScreenWrapper'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import Icon from '@/components/icons/Icon'
import i18n from '@/i18n'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LANG_STORAGE_KEY, languages } from '@/constants/constants'

type LanguageType = typeof languages[number]

type LanguageItemProps = {
  item: LanguageType
  isSelected: boolean
  isLast: boolean
  onPress: (value: string) => void
}

const LanguageItem = React.memo(function LanguageItem({
  item,
  isSelected,
  isLast,
  onPress
}: LanguageItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(item.value)}
      style={[styles.item, isLast && styles.lastItem]}
    >
      <View style={styles.languageInfo}>
        <Typo weight='400' size={15}>
          {item.label}
        </Typo>
      </View>
      {isSelected && (
        <View style={styles.checkContainer}>
          <Icon.CheckCircle color={Colors.green} size={23} />
        </View>
      )}
    </TouchableOpacity>
  )
})

export default function Language() {
  const [locale, setLocale] = useState<string>(() => i18n.locale)
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(LANG_STORAGE_KEY)
        if (mounted && saved) {
          i18n.locale = saved
          setLocale(saved)
        }
      } catch (err) {
        console.error('Failed to load language', err)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const handleLanguageChange = useCallback(async (language: string) => {
    try {
      await AsyncStorage.setItem(LANG_STORAGE_KEY, language)
      i18n.locale = language
      setLocale(language)
    } catch (err) {
      console.error('Failed to save language', err)
    }
  }, [])

  const selectedLanguage = useMemo(
    () => languages.find(lang => lang.value === locale),
    [locale]
  )

  const renderItem = useCallback(
    ({ item, index }: { item: LanguageType; index: number }) => (
      <LanguageItem
        item={item}
        isSelected={item.value === locale}
        isLast={index === languages.length - 1}
        onPress={handleLanguageChange}
      />
    ),
    [locale, handleLanguageChange]
  )

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Icon.ArrowLeft color={Colors.primary} size={23} />
        </TouchableOpacity>
        <View>
          <Typo weight='700' size={21} style={styles.headerTexts}>
            {i18n.t('profile.menu.language.routePage.title')}
          </Typo>
          <Typo size={15} color='secondary' style={styles.headerTexts}>
            {i18n.t('profile.menu.language.routePage.subtitle')}
          </Typo>
        </View>
      </View>

      {selectedLanguage && (
        <View style={styles.selectedContainer}>
          <Typo weight='600' size={13} color='secondary' style={styles.sectionTitle}>
            {i18n.t('profile.menu.language.routePage.currentLanguage')}
          </Typo>
          <View style={styles.selectedLanguage}>
            <View style={styles.languageInfo}>
              <Typo weight='500' size={15}>
                {selectedLanguage.label}
              </Typo>
            </View>
          </View>
        </View>
      )}

      <View style={styles.availableContainer}>
        <Typo weight='600' size={13} color='secondary' style={styles.sectionTitle}>
          {i18n.t('profile.menu.language.routePage.availableLanguages')}
        </Typo>
        <View style={styles.listContainer}>
          <FlatList
            data={languages}
            renderItem={renderItem}
            keyExtractor={(item) => item.value}
            showsVerticalScrollIndicator={false}
            extraData={locale}
          />
        </View>
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  header: {
    marginBottom: Sizes.spacing.s21,
    paddingTop: Sizes.spacing.s5,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  },
  backButton: {
    borderRadius: Shapes.rounded.circle,
    borderColor: Colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Sizes.spacing.s11,
    paddingVertical: Sizes.spacing.s11,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTexts: {
    textAlign: 'right'
  },
  selectedContainer: {
    marginBottom: Sizes.spacing.s21
  },
  availableContainer: {
    flex: 1
  },
  sectionTitle: {
    marginBottom: Sizes.spacing.s9,
    paddingHorizontal: Sizes.spacing.s3
  },
  selectedLanguage: {
    backgroundColor: Colors.card,
    borderRadius: Shapes.rounded.base,
    paddingVertical: Sizes.spacing.s11,
    paddingHorizontal: Sizes.spacing.s15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  listContainer: {
    backgroundColor: Colors.card,
    borderRadius: Shapes.rounded.base,
    overflow: 'hidden'
  },
  item: {
    paddingVertical: Sizes.spacing.s11,
    paddingHorizontal: Sizes.spacing.s15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border
  },
  lastItem: {
    borderBottomWidth: 0
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  checkContainer: {
    marginLeft: Sizes.spacing.s15
  }
})
