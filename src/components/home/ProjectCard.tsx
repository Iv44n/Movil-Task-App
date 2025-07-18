import Icon from '@/components/icons/Icon'
import Typo from '@/components/shared/Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import useCategories from '@/hooks/data/useCategories'
import { formatProjectName } from '@/utils/utils'
import { observer } from '@legendapp/state/react'
import { Link } from 'expo-router'
import { Pressable, StyleSheet, View } from 'react-native'
import ProjectProgressBar from './ProjectProgressBar'

interface ProjectCardProps {
  taskCount: number
  name: string
  color: string
  categoryId: string
  completedTasks: number
  id: string
}

export default observer(function ProjectCard({
  taskCount,
  completedTasks,
  name,
  color,
  id,
  categoryId
}: ProjectCardProps) {
  const { firstPart, remaining } = formatProjectName(name)
  const categoryName = useCategories().getCategoryById(categoryId)?.name
  const progressPercentage = taskCount === 0 ? 0 : Math.round((completedTasks / taskCount) * 100)

  return (
    <View style={[styles.mainCard, { backgroundColor: color || Colors.primary }]}>
      <View>
        <Typo
          size={11}
          weight='500'
          color='secondary'
        >
          Progress
        </Typo>
        <ProjectProgressBar progress={progressPercentage} />
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
              {firstPart}
            </Typo>
            <Typo
              size={23}
              weight='700'
              color='black'
              ellipsizeMode='tail'
              numberOfLines={1}
            >
              {remaining}
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
            <Icon.ArrowRightUp color={Colors.primary} />
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
    height: '100%',
    borderRadius: Shapes.rounded.md,
    justifyContent: 'space-around',
    marginRight: Sizes.spacing.s11
  },
  footerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  projectInfo: {
    gap: Sizes.spacing.s7,
    maxWidth: Sizes.width.w225 - 100
  },
  arrowButton: {
    backgroundColor: Colors.background,
    borderRadius: Shapes.rounded.circle,
    padding: Sizes.spacing.s9
  }
})
