import { memo, useState, useCallback } from 'react'
import { View, StyleSheet, TextInput } from 'react-native'
import ColorPicker, { Swatches, HueSlider, Panel1 } from 'reanimated-color-picker'
import { Colors, Shapes, Sizes, Typography } from '@/constants/theme'
import Typo from '@/components/Typo'
import { runOnJS } from 'react-native-reanimated'
import ActionButton from '@/components/ActionButton'

interface ColorPickerCardProps {
  initialColor?: string
  colors?: { id: number, color: string }[]
  onCancel?: () => void
  onConfirm?: (color: string) => void
}

function ColorPickerCard({
  initialColor = '#ff0000',
  colors = [],
  onCancel,
  onConfirm
}: ColorPickerCardProps) {
  const [selectedColor, setSelectedColor] = useState(initialColor)

  const handleColorChange = useCallback((col: { hex: string }) => {
    'worklet'
    runOnJS(setSelectedColor)(col.hex)
  }, [])

  const handleCancel = useCallback(() => {
    onCancel?.()
  }, [onCancel])

  const handleConfirm = useCallback(() => {
    onConfirm?.(selectedColor)
  }, [onConfirm, selectedColor])

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <ColorPicker
          thumbSize={23}
          thumbShape='circle'
          style={styles.picker}
          value={selectedColor}
          onChange={handleColorChange}
          onComplete={handleColorChange}
        >
          <Panel1 style={styles.panel} />
          <View style={styles.sliderContainer}>
            <HueSlider style={styles.slider} />
            {colors.length > 0 && <Swatches colors={colors.map((c) => c.color)} style={styles.swatches} />}
          </View>
        </ColorPicker>

        <View style={styles.body}>
          <View style={styles.hexContainer}>
            <Typo
              fontWeight='medium'
              color={Colors.textPrimary}
              style={styles.hexLabel}
            >
              Hex
            </Typo>
            <TextInput
              style={styles.input}
              value={selectedColor}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.actions}>
          <ActionButton
            label='Cancel'
            style={styles.cancelButton}
            onPress={handleCancel}
            typoProps={{ color: Colors.textPrimary, fontWeight: 'semiBold', size: 15 }}
          />
          <ActionButton
            label='Add'
            style={styles.confirmButton}
            onPress={handleConfirm}
            typoProps={{ fontWeight: 'semiBold', size: 15 }}
          />
        </View>
      </View>
    </View>
  )
}

export default memo(ColorPickerCard)

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Sizes.spacing.s21
  },
  card: {
    width: '100%',
    backgroundColor: Colors.card,
    padding: Sizes.spacing.s15,
    borderRadius: Shapes.rounded.small,
    alignItems: 'center',
    elevation: 3
  },
  picker: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  panel: {
    width: '100%',
    height: Sizes.height.h355,
    borderRadius: Shapes.rounded.small,
    marginBottom: Sizes.spacing.s15
  },
  sliderContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  slider: {
    width: '100%',
    marginBottom: Sizes.spacing.s15,
    borderRadius: Shapes.rounded.small
  },
  swatches: {
    marginBottom: Sizes.spacing.s15,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  body: {
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: Sizes.spacing.s15
  },
  hexContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  hexLabel: {
    marginRight: Sizes.spacing.s5,
    borderColor: Colors.border,
    borderWidth: 1,
    backgroundColor: Colors.background,
    borderRadius: Shapes.rounded.small,
    paddingHorizontal: Sizes.spacing.s17,
    paddingVertical: Sizes.spacing.s7
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: Sizes.spacing.s15,
    marginBottom: Sizes.spacing.s15
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderColor: Colors.border,
    borderWidth: 1,
    width: '48%'
  },
  confirmButton: {
    width: '48%'
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    fontFamily: Typography.fontFamily.medium,
    fontSize: 15.4,
    borderRadius: Shapes.rounded.small,
    paddingHorizontal: Sizes.spacing.s9,
    color: Colors.textPrimary,
    justifyContent: 'space-between'
  }
})
