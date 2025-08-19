import { Colors, Shapes, Sizes } from '@/constants/theme'
import Typo from '@/components/shared/Typo'
import { DimensionValue, StyleSheet, View } from 'react-native'

interface ProgressBarProps {
  readonly progress: number
  readonly progressBarBackground?: string,
  readonly progressBarFill?: string
  readonly progressTextColor?: string
  readonly maxWidth?: DimensionValue
}

export default function ProgressBar({ progress, progressBarBackground, progressBarFill, progressTextColor, maxWidth }: ProgressBarProps) {
  return (
    <View style={styles.progressBarContainer}>
      <View style={[
        styles.progressBarBackground,
        {
          backgroundColor: progressBarBackground ?? Colors.secondary,
          maxWidth: maxWidth ?? '55%'
        }
      ]}
      >
        <View style={[
          styles.progressBarFill,
          { width: `${progress}%`, backgroundColor: progressBarFill ?? Colors.black }
        ]}
        />
      </View>
      <Typo
        size={11.5}
        weight='600'
        forceColor={progressTextColor ?? Colors.black}
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
    alignItems: 'center'
  },
  progressBarBackground: {
    flex: 1,
    height: Sizes.height.h5 - 1,
    borderRadius: Shapes.rounded.base,
    marginRight: Sizes.spacing.s7
  },
  progressBarFill: {
    height: '100%',
    borderRadius: Shapes.rounded.base
  },
  progressText: {
    marginBottom: '0.9%'
  }
})
