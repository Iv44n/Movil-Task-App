import ArrowRightUpIcon from '@/components/icons/ArrowRightUpIcon'
import Typo from '@/components/shared/Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import useCategories from '@/hooks/data/useCategories'
import { CapitalizeWords } from '@/utils/utils'
import { observer } from '@legendapp/state/react'
import { Link } from 'expo-router'
import { Pressable, StyleSheet, View } from 'react-native'

interface ProjectCardProps {
  task_count: number
  name: string
  color: string
  category_id: string
  id: string
}

export default observer(function ProjectCard({ task_count, name, color, id, category_id }: ProjectCardProps) {
  const words = name.trim().split(' ').filter(Boolean).map(CapitalizeWords) || []
  const categoryName = useCategories().getCategoryById(category_id)?.name

  let [firstWord = '', ...rest] = words

  if (rest.length > 0 && rest[0].length < 4) {
    firstWord = `${firstWord} ${rest[0]}`
    rest = rest.slice(1)
  }

  const progressPercentage = task_count === 0
    ? 0
    : (task_count / task_count) * 100

  return(
    <View style={[styles.mainCard, { backgroundColor: color }]}>
      <View>
        <Typo
          size={11}
          weight='500'
          color='secondary'
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
            weight='600'
            color='black'
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
              color='black'
              size={23}
              ellipsizeMode='tail'
              numberOfLines={1}
            >
              {firstWord}
            </Typo>
            <Typo
              size={23}
              weight='700'
              color='black'
              ellipsizeMode='tail'
              numberOfLines={1}
            >
              {rest.join(' ')}
            </Typo>
          </View>
          <Typo
            size={15}
            color='secondary'
            weight='500'
            style={{ maxWidth: Sizes.width.w225 - 100 }}
            ellipsizeMode='tail'
            numberOfLines={1}
          >
            {categoryName}
          </Typo>
        </View>
        <Link
          href={`project/${id}`}
          asChild
        >
          <Pressable style={styles.arrowButton}>
            <ArrowRightUpIcon color={Colors.primary} />
          </Pressable>
        </Link>
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  mainCard: {
    width: Sizes.width.w225,
    paddingHorizontal: Sizes.spacing.s17,
    paddingVertical: Sizes.spacing.s21,
    height: Sizes.height.h191,
    borderRadius: Shapes.rounded.md,
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
    backgroundColor: Colors.secondary,
    borderRadius: Shapes.rounded.md
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.background,
    borderRadius: Shapes.rounded.md
  },
  footerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  projectInfo: {
    gap: Sizes.spacing.s5,
    maxWidth: Sizes.width.w225 - 100
  },
  arrowButton: {
    backgroundColor: Colors.background,
    borderRadius: Shapes.rounded.circle,
    padding: Sizes.spacing.s9
  }
})
