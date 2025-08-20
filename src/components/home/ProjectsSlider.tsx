import { memo, useCallback, useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { BlurView } from 'expo-blur'
import ProjectCard from '@/components/home/ProjectCard'
import Typo from '@/components/shared/Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import { Project } from '@/models'
import i18n from '@/i18n'
import { useDatabase } from '@nozbe/watermelondb/react'
import { TABLE_NAMES } from '@/lib/schema'
import { Q } from '@nozbe/watermelondb'
import { LegendList } from '@legendapp/list'

interface ProjectsSliderProps {
  userId: string
  setShowAddProjectModal: (value: boolean) => void
}

const AddProjectButton = memo<{ onPress: () => void }>(function AddProjectButton({ onPress }) {
  return (
    <BlurView tint='dark' intensity={100} style={styles.blurContainer}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={styles.addButton}
        accessibilityLabel={i18n.t('home.addProject')}
      >
        <Typo size={29} weight='500'>+</Typo>
      </TouchableOpacity>
    </BlurView>
  )
})

const EmptyState = memo<{ onPress: () => void }>(function EmptyState({ onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.emptyContainer}
    >
      <View style={styles.emptyContent}>
        <Typo size={17} weight='500' color='secondary' style={styles.emptyText}>
          {i18n.t('home.emptyState.title')}
        </Typo>
        <Typo size={15} weight='400' color='primary' style={styles.emptyLinkText}>
          {i18n.t('home.emptyState.subtitle')}
        </Typo>
      </View>
    </TouchableOpacity>
  )
})

const ProjectsSlider = memo<ProjectsSliderProps>(function ProjectsSlider({ setShowAddProjectModal, userId }) {
  const db = useDatabase()
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    const columns = ['progress_percentage', 'name', 'category_id']

    const subscription = db.collections
      .get<Project>(TABLE_NAMES.PROJECTS)
      .query(
        Q.where('user_id', userId),
        Q.sortBy('created_at', Q.desc)
      )
      .observeWithColumns(columns)
      .subscribe(setProjects)

    return () => subscription.unsubscribe()
  }, [db, userId])

  const handleAddPress = useCallback(() => {
    setShowAddProjectModal(true)
  }, [setShowAddProjectModal])

  const renderProject = useCallback(({ item }: { item: Project }) => (
    <ProjectCard
      progressPercentage={item.progressPercentage}
      name={item.name}
      color={item.color}
      id={item.id}
      categoryId={item.categoryId}
    />
  ), [])

  if (projects.length === 0) {
    return <EmptyState onPress={handleAddPress} />
  }

  return (
    <View style={styles.sliderContainer}>
      <LegendList
        horizontal
        data={projects}
        extraData={projects}
        renderItem={renderProject}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<AddProjectButton onPress={handleAddPress} />}
        showsHorizontalScrollIndicator={false}
        recycleItems
      />
    </View>
  )
})

export default ProjectsSlider

const styles = StyleSheet.create({
  sliderContainer: {
    paddingHorizontal: Sizes.spacing.s3
  },
  blurContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Sizes.spacing.s11
  },
  addButton: {
    height: Sizes.height.h191,
    width: Sizes.width.w33,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Shapes.rounded.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border
  },
  emptyContainer: {
    height: Sizes.height.h191,
    borderRadius: Shapes.rounded.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyContent: {
    alignItems: 'center'
  },
  emptyText: {
    marginBottom: Sizes.spacing.s3
  },
  emptyLinkText: {
    textDecorationLine: 'underline'
  }
})
