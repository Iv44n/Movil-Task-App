import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Animated,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
  ScrollView,
  View
} from 'react-native'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import ProjectCard from '@/components/home/ProjectCard'
import Typo from '@/components/shared/Typo'
import { Database } from '@/lib/database.types'
import useProjects from '@/hooks/data/useProjects'
import { observer } from '@legendapp/state/react'
import { BlurView } from 'expo-blur'

export type ProjectType = Database['public']['Tables']['projects']['Row']

function AddProjectButton({ setShowAddProjectModal }: { readonly setShowAddProjectModal: (value: boolean) => void }) {
  return (
    <BlurView tint='dark' intensity={100} style={styles.blurContainer}>
      <Pressable onPress={() => setShowAddProjectModal(true)} style={styles.addButton}>
        <Typo size={29} weight='500'>
          +
        </Typo>
      </Pressable>
    </BlurView>
  )
}

function EmptyState({ setShowAddProjectModal }: { readonly setShowAddProjectModal: (value: boolean) => void }) {
  return (
    <Pressable onPress={() => setShowAddProjectModal(true)} style={styles.emptyContainer}>
      <View style={styles.emptyContent}>
        <Typo size={17} weight='500' color='secondary' style={styles.emptyText}>
          You have no projects
        </Typo>
        <Typo
          size={15}
          weight='400'
          color='primary'
          style={styles.emptyLinkText}
        >
          Tap to create one
        </Typo>
      </View>
    </Pressable>
  )
}

export default observer(function ProjectsSlider({ setShowAddProjectModal }: { setShowAddProjectModal: (value: boolean) => void }) {
  const { projects } = useProjects()
  const [showAdd, setShowAdd] = useState(false)
  const scrollRef = useRef<ScrollView>(null)

  useEffect(() => {
    if (projects.length === 0) {
      scrollRef.current?.scrollTo({ x: 0, animated: true })
    }
  }, [projects])

  const onScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x
      setShowAdd(x < 10)
    },
    []
  )

  if (!projects || projects.length === 0) {
    return <EmptyState setShowAddProjectModal={setShowAddProjectModal} />
  }

  return (
    <Animated.ScrollView
      ref={scrollRef}
      horizontal
      scrollEventThrottle={16}
      showsHorizontalScrollIndicator={false}
      onScrollEndDrag={onScrollEnd}
      contentContainerStyle={styles.sliderContainer}
    >
      {showAdd && <AddProjectButton setShowAddProjectModal={setShowAddProjectModal} />}
      {projects.map((proj) => (
        <ProjectCard
          key={proj.id}
          taskCount={proj.task_count}
          completedTasks={proj.completed_tasks}
          name={proj.name}
          color={proj.color}
          id={proj.id}
          categoryId={proj.category_id}
        />
      ))}
    </Animated.ScrollView>
  )
})

const styles = StyleSheet.create({
  sliderContainer: {
    alignItems: 'center'
  },
  blurContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Sizes.spacing.s11
  },
  addButton: {
    flex: 1,
    width: Sizes.width.w33,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Shapes.rounded.md,
    borderWidth: 1,
    borderColor: Colors.border
  },
  emptyContainer: {
    height: Sizes.height.h191,
    borderRadius: Shapes.rounded.md,
    borderWidth: 1,
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
