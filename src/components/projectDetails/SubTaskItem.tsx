import { memo, useCallback } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Typo from '@/components/shared/Typo'
import { Colors, Sizes } from '@/constants/theme'
import Icon from '../icons/Icon'

type Props = {
  id: string
  text: string
  completed: boolean
  onToggle: (id: string, completed: boolean) => void
}

const SubtaskItem = memo(function SubtaskItem({
  id,
  text,
  completed,
  onToggle
}: Props) {
  const handleToggle = useCallback(() => {
    onToggle(id, !completed)
  }, [id, completed, onToggle])

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleToggle}
      activeOpacity={0.7}
    >
      <View style={styles.checkbox}>
        {completed
          ? <Icon.CheckCircle size={21} color={Colors.secondary} />
          : <Icon.Circle size={21} />}
      </View>
      <Typo
        size={17}
        color={completed ? 'secondary' : 'primary'}
        style={{
          maxWidth: '90%',
          textDecorationLine: completed ? 'line-through' : 'none'
        }}
      >
        {text}
      </Typo>
    </TouchableOpacity>
  )
})

export default SubtaskItem

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Sizes.spacing.s7,
    paddingHorizontal: Sizes.spacing.s7,
    backgroundColor: 'transparent'
  },
  checkbox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Sizes.spacing.s9,
    marginTop: 1.5
  }
})
