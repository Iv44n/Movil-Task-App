import { useMemo, memo } from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions
} from 'react-native'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import { BlurView } from 'expo-blur'

export default memo(function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { width: SCREEN_WIDTH } = useWindowDimensions()

  const TAB_BAR_HEIGHT = Sizes.height.h57 + Sizes.spacing.s5
  const TAB_BAR_WIDTH  = Sizes.width.w131 - Sizes.spacing.s7

  const tabs = useMemo(() => state.routes.map((route, index) => {
    const isFocused = state.index === index
    const { options } = descriptors[route.key]
    const icon = options.tabBarIcon?.({
      focused: isFocused,
      color: isFocused ? Colors.textBlack : Colors.textPrimary,
      size: 23
    })

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true
      })
      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name, route.params)
      }
    }

    const onLongPress = () => {
      navigation.emit({ type: 'tabLongPress', target: route.key })
    }

    return { key: route.key, icon, onPress, onLongPress }
  }), [state.routes, state.index, descriptors, navigation])

  return (
    <BlurView
      tint='dark'
      intensity={100}
      style={[
        styles.container,
        {
          width: TAB_BAR_WIDTH,
          height: TAB_BAR_HEIGHT,
          left: (SCREEN_WIDTH - TAB_BAR_WIDTH) / 2,
          bottom: Sizes.spacing.s17
        }
      ]}
    >
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.key}
          onPress={tab.onPress}
          onLongPress={tab.onLongPress}
          style={styles.tab}
          activeOpacity={0.7}
        >
          {tab.icon}
        </TouchableOpacity>
      ))}
    </BlurView>
  )
})

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'row',
    alignSelf: 'center',
    borderRadius: Shapes.rounded.large,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden'
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Sizes.spacing.s5
  }
})
