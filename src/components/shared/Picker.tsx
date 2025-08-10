import React, { useState, ReactNode, memo, useCallback, useMemo } from 'react'
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  LayoutRectangle,
  Keyboard,
  StyleProp,
  ViewStyle,
  TextProps,
  TextStyle
} from 'react-native'
import { Colors, Sizes, Shapes } from '@/constants/theme'
import Typo, { TypoProps } from './Typo'
import Icon from '../icons/Icon'

// PickerItem interface
interface PickerItemProps {
  label: string
  value: string
  isSelected?: boolean
  isFirst?: boolean
  isLast?: boolean
  style?: StyleProp<ViewStyle>
  icon?: ReactNode
  textProps?: TextProps
  textStyle?: TextStyle
  typoProps?: Partial<Omit<TypoProps, 'children'>>
  iconPosition?: 'left' | 'right'
  handleIconPress?: () => void
}

// PickerProps interface
interface PickerProps {
  selectedValue?: string
  onValueChange: (value: string) => void
  placeholder?: string
  children: ReactNode
  style?: StyleProp<ViewStyle>
  triggerStyle?: StyleProp<ViewStyle>
  triggerIcon?: ReactNode
  dropdownStyle?: StyleProp<ViewStyle>
}

const ItemOption = memo<PickerItemProps & {
  onSelect?: (value: string) => void
}>(({ label, value, style, icon, textProps, textStyle, typoProps, isSelected, isFirst, isLast, iconPosition = 'left', onSelect, handleIconPress }) => {
      const defaultTypo: Omit<TypoProps, 'children'> = {
        size: 15,
        color: 'primary',
        ellipsizeMode: 'tail',
        numberOfLines: 1
      }

      const finalTypo = { ...defaultTypo, ...typoProps, textProps: { ...defaultTypo, ...textProps } }

      const handlePress = useCallback(() => {
        if (onSelect) onSelect(value)
      }, [onSelect, value])

      return (
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.option,
            isSelected && styles.optionSelected,
            isFirst && styles.optionFirst,
            isLast && styles.optionLast,
            style
          ]}
          onPress={handlePress}
        >
          {icon && iconPosition === 'left' && <TouchableOpacity onPress={handleIconPress}>{icon}</TouchableOpacity>}
          <Typo {...finalTypo} style={textStyle}>
            {label}
          </Typo>
          {icon && iconPosition === 'right' && <TouchableOpacity onPress={handleIconPress}>{icon}</TouchableOpacity>}
        </TouchableOpacity>
      )
    })

ItemOption.displayName = 'ItemOption'

type PickerComponent = React.FC<PickerProps> & {
  Item: React.FC<PickerItemProps>
}

const Picker: PickerComponent = ({
  selectedValue,
  onValueChange,
  placeholder = 'Select an option',
  children,
  style,
  triggerStyle,
  triggerIcon,
  dropdownStyle
}) => {
  const [open, setOpen] = useState(false)
  const [layout, setLayout] = useState<LayoutRectangle | null>(null)

  const items: PickerItemProps[] = useMemo(
    () =>
      React.Children.toArray(children)
        .filter(
          (c): c is React.ReactElement<PickerItemProps> =>
            React.isValidElement(c) && (c.type as any).displayName === 'PickerItem'
        )
        .map(child => ({ ...(child.props as PickerItemProps) })),
    [children]
  )

  const toggleOpen = useCallback(() => {
    Keyboard.dismiss()
    setOpen(o => !o)
  }, [])

  const handleSelect = useCallback((value: string) => {
    onValueChange(value)
    setOpen(false)
  }, [onValueChange])

  return (
    <View style={style}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.trigger, triggerStyle]}
        onPress={toggleOpen}
        onLayout={({ nativeEvent }) => setLayout(nativeEvent.layout)}
      >
        <Typo
          size={15}
          color={selectedValue ? 'primary' : 'secondary'}
          ellipsizeMode='tail'
          numberOfLines={1}
        >
          {selectedValue || placeholder}
        </Typo>
        {triggerIcon ?? (
          <Icon.AltArrowDown
            size={20}
            color={Colors.secondary}
            style={[styles.chevron, open && styles.chevronUp]}
          />
        )}
      </TouchableOpacity>

      {open && layout && (
        <View
          style={[
            styles.dropdownWrapper,
            {
              top: layout.y + layout.height + Sizes.spacing.s3,
              left: layout.x - 1.2,
              maxWidth: Sizes.width.w225,
              minWidth: Sizes.width.w131,
              zIndex: 1000,
              maxHeight: Sizes.height.h191
            },
            dropdownStyle
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {
              items.map(item => (
                <ItemOption
                  key={item.value}
                  {...item}
                  onSelect={handleSelect}
                />
              ))
            }
          </ScrollView>
        </View>
      )}
    </View>
  )
}

// Subcomponente <Picker.Item/>
const PickerItem: React.FC<PickerItemProps> = () => null
PickerItem.displayName = 'PickerItem'
Picker.Item = PickerItem

export default Picker

const styles = StyleSheet.create({
  trigger: {
    borderRadius: Shapes.rounded.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Sizes.spacing.s13,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    backgroundColor: Colors.card
  },
  chevron: {
    transform: [{ rotate: '0deg' }]
  },
  chevronUp: {
    translateY: -Sizes.spacing.s3,
    transform: [{ rotate: '180deg' }]
  },
  dropdownWrapper: {
    position: 'absolute',
    borderColor: Colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: Colors.background,
    borderRadius: Shapes.rounded.sm
  },
  option: {
    paddingVertical: Sizes.spacing.s7,
    paddingHorizontal: Sizes.spacing.s15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Sizes.spacing.s21
  },
  optionFirst: {
    borderTopLeftRadius: Shapes.rounded.sm,
    borderTopRightRadius: Shapes.rounded.sm
  },
  optionLast: {
    borderBottomLeftRadius: Shapes.rounded.sm,
    borderBottomRightRadius: Shapes.rounded.sm
  },
  optionSelected: {
    backgroundColor: Colors.card
  }
})
