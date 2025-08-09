import { memo } from 'react'
import { View, StyleSheet } from 'react-native'
import { Shapes, Sizes, Colors } from '@/constants/theme'

export default memo(function TaskItemSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.skeletonTextShort} />
        <View style={styles.skeletonCircle} />
      </View>
      <View style={styles.chipContainer}>
        <View style={[styles.chip, styles.skeletonText]} />
        <View style={[styles.chipError, styles.skeletonText]} />
      </View>

      <View style={[styles.skeletonText, { width: '60%', marginVertical: Sizes.spacing.s5 }]} />

      <View style={styles.footer}>
        <View style={styles.avatarGroup}>
          <View style={styles.skeletonCircleSmall} />
          <View style={styles.skeletonCircleSmall} />
          <View style={styles.skeletonCircleSmall} />
        </View>
        <View style={styles.commentsContainer}>
          <View style={[styles.skeletonTextShort, { width: 40, height: 14 }]} />
        </View>
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Shapes.rounded.md,
    padding: Sizes.spacing.s15,
    marginBottom: Sizes.spacing.s11
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  skeletonTextShort: {
    width: 80,
    height: 16,
    backgroundColor: Colors.secondary + '50',
    borderRadius: 4
  },
  skeletonText: {
    height: 14,
    backgroundColor: Colors.secondary + '50',
    borderRadius: 4,
    flex: 1
  },
  skeletonCircle: {
    width: 31,
    height: 31,
    borderRadius: 31 / 2,
    backgroundColor: Colors.secondary + '50'
  },
  chipContainer: {
    flexDirection: 'row',
    marginVertical: Sizes.spacing.s5
  },
  chip: {
    flex: 1,
    borderRadius: Shapes.rounded.sm,
    padding: Sizes.spacing.s5,
    marginRight: Sizes.spacing.s11
  },
  chipError: {
    flex: 1,
    borderRadius: Shapes.rounded.sm,
    padding: Sizes.spacing.s5,
    marginRight: Sizes.spacing.s11
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Sizes.spacing.s21
  },
  avatarGroup: {
    flexDirection: 'row'
  },
  skeletonCircleSmall: {
    width: 31,
    height: 31,
    borderRadius: 31 / 2,
    backgroundColor: Colors.secondary + '50',
    marginRight: -Sizes.spacing.s7
  },
  commentsContainer: {
    alignItems: 'center',
    flexDirection: 'row'
  }
})
