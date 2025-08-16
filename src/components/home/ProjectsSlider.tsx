import { memo, useCallback, useEffect, useState } from 'react'
import { VirtualizedList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { BlurView } from 'expo-blur'
import ProjectCard from '@/components/home/ProjectCard'
import Typo from '@/components/shared/Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import { Project } from '@/models'
import i18n from '@/i18n'
import { useDatabase } from '@nozbe/watermelondb/react'
import { TABLE_NAMES } from '@/lib/schema'
import { Q } from '@nozbe/watermelondb'

interface ProjectsSliderProps {
  userId: string
  setShowAddProjectModal: (value: boolean) => void
}

const AddProjectButton = memo<{ onPress: () => void }>(({ onPress }) => (
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
))
AddProjectButton.displayName = 'AddProjectButton'

const EmptyState = memo<{ onPress: () => void }>(({ onPress }) => (
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
))
EmptyState.displayName = 'EmptyState'

const ProjectsSlider = memo<ProjectsSliderProps>(({ setShowAddProjectModal, userId }) => {
  const db = useDatabase()
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    const subscription = db.collections
      .get<Project>(TABLE_NAMES.PROJECTS)
      .query(
        Q.where('user_id', userId),
        Q.sortBy('created_at', Q.desc)
      )
      .observe()
      .subscribe(setProjects)

    return () => subscription.unsubscribe()
  }, [db, userId])

  const handleAddPress = useCallback(() => {
    setShowAddProjectModal(true)
  }, [setShowAddProjectModal])

  const renderProject = useCallback(({ item }: { item: Project }) => (
    <ProjectCard
      taskCount={0}
      completedTasks={0}
      name={item.name}
      color={item.color}
      id={item.id}
      categoryId={item.categoryId}
    />
  ), [])

  const keyExtractor = useCallback((item: Project) => item.id, [])
  const getItemCount = useCallback((data: Project[]) => data.length, [])
  const getItem = useCallback((data: Project[], index: number) => data[index], [])
  const getItemLayout = useCallback((_: unknown, index: number) => ({
    length: Sizes.width.w225 + Sizes.spacing.s11,
    offset: (Sizes.width.w225 + Sizes.spacing.s11) * index,
    index
  }), [])

  if (projects.length === 0) {
    return <EmptyState onPress={handleAddPress} />
  }

  return (
    <View style={styles.sliderContainer}>
      <VirtualizedList
        horizontal
        data={projects}
        renderItem={renderProject}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        getItemCount={getItemCount}
        getItem={getItem}
        ListHeaderComponent={<AddProjectButton onPress={handleAddPress} />}
        showsHorizontalScrollIndicator={false}
        removeClippedSubviews
        maxToRenderPerBatch={5}
        windowSize={10}
        initialNumToRender={3}
        scrollEventThrottle={16}
        updateCellsBatchingPeriod={50}
      />
    </View>
  )
})
ProjectsSlider.displayName = 'ProjectsSlider'

export default ProjectsSlider

const styles = StyleSheet.create({
  sliderContainer: {
    alignItems: 'center',
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
