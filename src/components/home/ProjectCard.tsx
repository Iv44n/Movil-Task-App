import { memo, useEffect, useMemo, useState } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Link } from 'expo-router'
import Icon from '@/components/icons/Icon'
import Typo from '@/components/shared/Typo'
import ProjectProgressBar from './ProjectProgressBar'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import { formatProjectName } from '@/utils/utils'
import i18n from '@/i18n'
import { useDatabase } from '@nozbe/watermelondb/react'
import { Category } from '@/models'
import { TABLE_NAMES } from '@/lib/schema'
import { Q } from '@nozbe/watermelondb'

interface ProjectCardProps {
  taskCount: number
  name: string
  color: string
  categoryId: string
  completedTasks: number
  id: string
}

const ProjectCard = memo<ProjectCardProps>(function ProjectCard({
  taskCount,
  completedTasks,
  name,
  color,
  id,
  categoryId
}) {
  const db = useDatabase()
  const [categoryName, setCategoryName] = useState<string>('')

  useEffect(() => {
    const sb = db.collections
      .get<Category>(TABLE_NAMES.CATEGORIES)
      .query(
        Q.where('id', categoryId),
        Q.take(1)
      )
      .observeWithColumns(['name'])
      .subscribe((category) => setCategoryName(category?.[0].name ?? ''))

    return () => sb.unsubscribe()
  }, [categoryId, db])

  const { firstPart, remaining } = useMemo(() => formatProjectName(name), [name])
  const progressPercentage = useMemo(() =>
    taskCount === 0 ? 0 : Math.round((completedTasks / taskCount) * 100),
  [taskCount, completedTasks]
  )

  const cardStyle = useMemo(() => [
    styles.mainCard,
    { backgroundColor: color || Colors.primary }
  ], [color])

  return (
    <View style={cardStyle}>
      <View>
        <Typo size={11} weight='500' color='secondary'>
          {i18n.t('home.card.progress')}
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
            style={styles.categoryText}
            ellipsizeMode='tail'
            numberOfLines={1}
          >
            {categoryName}
          </Typo>
        </View>

        <Link href={`project/${id}`} asChild>
          <TouchableOpacity activeOpacity={0.7} style={styles.arrowButton}>
            <Icon.ArrowRightUp color={Colors.primary} />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  )
})

export default ProjectCard

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
  footerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  projectInfo: {
    gap: Sizes.spacing.s7,
    maxWidth: Sizes.width.w225 - 100
  },
  categoryText: {
    maxWidth: Sizes.width.w225 - 100
  },
  arrowButton: {
    backgroundColor: Colors.background,
    borderRadius: Shapes.rounded.circle,
    padding: Sizes.spacing.s9
  }
})
