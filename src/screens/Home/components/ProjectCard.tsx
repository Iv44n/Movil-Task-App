import ArrowRightUpIcon from '@/components/icons/ArrowRightUpIcon'
import Typo from '@/components/Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import { Link } from 'expo-router'
import { Pressable, StyleSheet, View } from 'react-native'

interface ProjectCardTypes {
  title: string
  category: string
  progress: number
  color: string
}

export default function ProjectCard(project: ProjectCardTypes) {
  const [first, ...rest] = project.title.split(' ')

  return(
    <View style={[styles.mainCard, { backgroundColor: project.color }]}>
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
                { width: `${project.progress}%` }
              ]}
            />
          </View>
          <Typo
            size={11}
            fontWeight='semiBold'
            color={Colors.textBlack}
            style={{ marginBottom: Sizes.spacing.s3 }}
          >
            {project.progress}%
          </Typo>
        </View>
      </View>

      <View style={styles.footerCard}>
        <View style={styles.projectInfo}>
          <Typo
            size={23}
            fontWeight='bold'
            color={Colors.textBlack}
            style={{ maxWidth: '80%' }}
            textProps={{ ellipsizeMode: 'tail', numberOfLines: 2 }}
          >
            <Typo
              color={Colors.textBlack}
              size={23}
            >
              {first}
            </Typo> {rest.join(' ')}
          </Typo>
          <Typo
            size={15}
            color={Colors.textSecondary}
            fontWeight='medium'
            textProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
          >
            {project.category}
          </Typo>
        </View>
        <Link href='project' asChild>
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
