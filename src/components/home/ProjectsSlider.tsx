import { useCallback, useRef, useState } from 'react'
import {
  Animated,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
  ScrollView,
  View
} from 'react-native'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import ProjectCard from '@/components/home/ProjectCard'
import Typo from '@/components/shared/Typo'
import { For, use$, Memo } from '@legendapp/state/react'
import { BlurView } from 'expo-blur'
import { projects$ } from '@/store/projects.store'

function AddProjectButton({ setShowAddProjectModal }: { readonly setShowAddProjectModal: (value: boolean) => void }) {
  return (
    <BlurView tint='dark' intensity={100} style={styles.blurContainer}>
      <TouchableOpacity activeOpacity={0.7} onPress={() => setShowAddProjectModal(true)} style={styles.addButton}>
        <Typo size={29} weight='500'>
          +
        </Typo>
      </TouchableOpacity>
    </BlurView>
  )
}

function EmptyState({ setShowAddProjectModal }: { readonly setShowAddProjectModal: (value: boolean) => void }) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => setShowAddProjectModal(true)} style={styles.emptyContainer}>
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
    </TouchableOpacity>
  )
}

export default function ProjectsSlider({ setShowAddProjectModal }: { setShowAddProjectModal: (value: boolean) => void }) {
  const [showAdd, setShowAdd] = useState(false)
  const scrollRef = useRef<ScrollView>(null)
  const projectsLength = use$(() => Object.keys(projects$.get(true) || {}).length)

  const onScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x
      setShowAdd(x < 10)
    },
    []
  )

  if (projectsLength === 0) {
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

      <For
        each={projects$}
        optimized
        sortValues={(a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()}
        item={({ item$, id }) => (
          <Memo key={id}>
            {() => (
              <ProjectCard
                taskCount={item$.task_count.get()}
                completedTasks={item$.completed_tasks.get()}
                name={item$.name.get()}
                color={item$.color.get()}
                id={item$.id.get()}
                categoryId={item$.category_id.get()}
              />
            )}
          </Memo>
        )}
      />
    </Animated.ScrollView>
  )
}

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
