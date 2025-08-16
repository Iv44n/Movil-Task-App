import { memo } from 'react'
import { View, StyleSheet, TextStyle } from 'react-native'
import Typo from '../shared/Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'

interface TaskChipProps {
  text: string
  color?: TextStyle['color']
  backgroundColor?: TextStyle['color']
}

const TaskChip = memo(function TaskChip({
  text,
  color = 'primary',
  backgroundColor
}: TaskChipProps) {
  const chipStyle = [
    styles.chip,
    backgroundColor && { backgroundColor }
  ]

  return (
    <View style={chipStyle}>
      <Typo size={13} weight='500' color={color}>
        {text}
      </Typo>
    </View>
  )
})

const styles = StyleSheet.create({
  chip: {
    borderRadius: Shapes.rounded.sm,
    paddingHorizontal: Sizes.spacing.s15,
    paddingVertical: Sizes.spacing.s5,
    marginRight: Sizes.spacing.s11
  }
})

export default TaskChip
