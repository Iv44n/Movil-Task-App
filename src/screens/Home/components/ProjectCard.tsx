import ArrowRightUpIcon from '@/components/icons/ArrowRightUpIcon'
import Typo from '@/components/Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import { Project } from '@/types/project'
import { CapitalizeWords } from '@/utils/utils'
import { Link } from 'expo-router'
import { Pressable, StyleSheet, View } from 'react-native'

export default function ProjectCard({ category, bgColor, ...info }: Project) {
  const words = info.name.trim().split(' ').filter(Boolean).map(CapitalizeWords) || []

  let [firstWord = '', ...rest] = words

  if (rest.length > 0 && rest[0].length < 4) {
    firstWord = `${firstWord} ${rest[0]}`
    rest = rest.slice(1)
  }

  const progressPercentage = !info.details?.totalTasks || info.details?.totalTasks === 0
    ? 0
    : (info.details?.completedTasks / info.details?.totalTasks) * 100

  return(
    <View style={[styles.mainCard, { backgroundColor: bgColor }]}>
      <View>
        <Typo
          size={11}
          fontWeight='medium'
          color={Colors.textSecondary}
        >
          Progress
        </Typo>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progressPercentage}%` }
              ]}
            />
          </View>
          <Typo
            size={11}
            fontWeight='semiBold'
            color={Colors.textBlack}
            style={{ marginBottom: Sizes.spacing.s3 }}
          >
            {progressPercentage}%
          </Typo>
        </View>
      </View>

      <View style={styles.footerCard}>
        <View style={styles.projectInfo}>
          <View>
            <Typo
              color={Colors.textBlack}
              size={23}
            >
              {firstWord}
            </Typo>
            <Typo
              size={23}
              fontWeight='bold'
              color={Colors.textBlack}
              style={{ maxWidth: Sizes.width.w225 - 100 }}
              textProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
            >
              {rest.join(' ')}
            </Typo>
          </View>
          <Typo
            size={15}
            color={Colors.textSecondary}
            fontWeight='medium'
            textProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
          >
            {category.name}
          </Typo>
        </View>
        <Link
          href={`project/${info.projectId}`}
          asChild
        >
          <Pressable style={styles.arrowButton}>
            <ArrowRightUpIcon color={Colors.textPrimary} />
          </Pressable>
        </Link>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainCard: {
    width: Sizes.width.w225,
    paddingHorizontal: Sizes.spacing.s17,
    paddingVertical: Sizes.spacing.s21,
    height: Sizes.height.h191,
    borderRadius: Shapes.rounded.medium,
    justifyContent: 'space-around',
    marginRight: Sizes.spacing.s11
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.spacing.s9
  },
  progressBarBackground: {
    width: '60%',
    height: Sizes.height.h5,
    backgroundColor: Colors.textSecondary,
    borderRadius: Shapes.rounded.medium
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.background,
    borderRadius: Shapes.rounded.medium
  },
  footerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  projectInfo: {
    gap: Sizes.spacing.s5
  },
  arrowButton: {
    backgroundColor: Colors.background,
    borderRadius: Shapes.rounded.full,
    padding: Sizes.spacing.s9
  }
})
