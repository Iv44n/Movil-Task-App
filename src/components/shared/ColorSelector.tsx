import { memo } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Colors, Sizes, Shapes } from '@/constants/theme'
import Icon from '../icons/Icon'
import Typo from '../shared/Typo'
import i18n from '@/i18n'

interface ColorSelectorProps {
  selectedColor: string
  onSelect: (color: string) => void
}

const PROJECT_COLORS = [
  Colors.green,
  Colors.yellow,
  '#F0E4CC',
  '#FFC9E3',
  '#C1E1C1',
  '#AEDFF7',
  '#FFE5B4',
  '#E8F1D4'
]

const ColorSelector = memo(function ColorSelector({
  selectedColor,
  onSelect
}: ColorSelectorProps) {
  return (
    <View>
      <Typo size={14} weight='600' style={styles.sectionTitle}>
        {i18n.t('home.addProjectModal.form.projectColor')}
      </Typo>
      <View style={styles.colorGrid}>
        {PROJECT_COLORS.map((color) => {
          const isSelected = selectedColor === color
          return (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorOption,
                { backgroundColor: color }
              ]}
              onPress={() => onSelect(color)}
              activeOpacity={0.7}
            >
              {isSelected && (
                <View style={styles.colorCheckContainer}>
                  <Icon.Check size={21} color={Colors.black} />
                </View>
              )}
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  sectionTitle: {
    marginBottom: Sizes.spacing.s15,
    color: Colors.primary
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizes.spacing.s11,
    justifyContent: 'space-between'
  },
  colorOption: {
    width: Sizes.spacing.s33,
    height: Sizes.spacing.s33,
    borderRadius: Shapes.rounded.circle,
    alignItems: 'center',
    justifyContent: 'center'
  },
  colorCheckContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: Shapes.rounded.circle,
    width: Sizes.spacing.s21,
    height: Sizes.spacing.s21,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default ColorSelector
