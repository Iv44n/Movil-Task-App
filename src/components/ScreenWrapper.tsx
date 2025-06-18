import { Colors } from '@/constants/theme'
import React from 'react'
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from 'react-native'

interface ScreenWrapperProps {
  children: React.ReactNode
  isScrollable?: boolean
  style?: StyleProp<ViewStyle>
  paddingHorizontal?: number
}

export default function ScreenWrapper({
  children,
  isScrollable = false,
  style
}: ScreenWrapperProps) {
  const containerStyle: StyleProp<ViewStyle> = [
    styles.base,
    style
  ]

  if (isScrollable) {
    return (
      <ScrollView
        style={styles.scrollBackground}
        contentContainerStyle={[{ flexGrow: 1 }, style]}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    )
  }

  return <View style={containerStyle}>{children}</View>
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: Colors.background
  },
  scrollBackground: {
    backgroundColor: Colors.background
  }
})
