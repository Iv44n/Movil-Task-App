import { Colors, Shapes, Sizes } from '@/constants/theme'
import Typo from '@/components/shared/Typo'
import { StyleSheet, View } from 'react-native'

interface ProjectProgressBarProps {
  readonly progress: number
}

export default function ProjectProgressBar({ progress }: ProjectProgressBarProps) {
  return (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>
      <Typo
        size={11}
        weight='600'
        color='black'
        style={styles.progressText}
      >
        {progress}%
      </Typo>
    </View>
  )
}

const styles = StyleSheet.create({
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Sizes.spacing.s5
  },
  progressBarBackground: {
    flex: 1,
    height: '20%',
    maxWidth: '55%',
    backgroundColor: Colors.secondary,
    borderRadius: Shapes.rounded.base,
    marginRight: Sizes.spacing.s7
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.black,
    borderRadius: Shapes.rounded.base
  },
  progressText: {
    marginBottom: 2
  }
})
