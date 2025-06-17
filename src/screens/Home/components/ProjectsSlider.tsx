import React, { useCallback, useEffect, useState } from 'react'
import { Animated, StyleSheet, NativeSyntheticEvent, NativeScrollEvent, Pressable, View, FlatList, Dimensions, ScrollView } from 'react-native'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import ProjectCard from './ProjectCard'
import Typo from '@/components/Typo'
import useBoundStore from '@/store/useBoundStore'
import { useShallow } from 'zustand/shallow'
import { Project } from '@/types/project'

const SCREEN_WIDTH = Dimensions.get('window').width

export default function ProjectsSlider() {
  const [showAddButton, setShowAddButton] = useState<boolean>(false)
  const { projects, isLoading, getProjects } = useBoundStore(useShallow(state => ({
    projects: state.projects,
    isLoading: state.isLoadingProjects,
    getProjects: state.getProjects
  })))
  const scrollRef = React.useRef<ScrollView>(null)

  useEffect(() => {
    getProjects()
  }, [getProjects])

  useEffect(() => {
    if (projects.length > 0) {
      scrollRef.current?.scrollTo({ x: 0 })
    }
  }, [projects])

  const handleScrollEnd = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x

    if (x < 20 && !showAddButton) setShowAddButton(true)
    if (x > 20 && showAddButton) setShowAddButton(false)

  }, [showAddButton, setShowAddButton])

  const columns = Math.floor(SCREEN_WIDTH / (Sizes.width.w225 + Sizes.spacing.s11)) + 1
  const items = Array.from({ length: columns }, (_, i) => i)

  if (isLoading)
    return (
      <FlatList
        data={items}
        keyExtractor={(i) => i.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={() => (
          <View style={styles.card}>
            <Typo size={17} fontWeight='medium' color={Colors.textSecondary} style={styles.title}>
              Loading...
            </Typo>
          </View>
        )}
      />
    )

  return (
    <View>
      {
        projects.length > 0 ? (
          <Animated.ScrollView
            ref={scrollRef}
            horizontal
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            onScrollEndDrag={handleScrollEnd}
          >
            {showAddButton && (
              <Pressable style={styles.addButton}>
                <Typo size={29} fontWeight='medium'>+</Typo>
              </Pressable>
            )}
            {
              projects.map((project: Project) => (
                <ProjectCard
                  key={project.projectId}
                  {...project}
                />
              ))
            }
          </Animated.ScrollView>
        ) : (
          <Pressable
            style={{
              height: Sizes.height.h191,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: Colors.border,
              borderWidth: 1,
              backgroundColor: Colors.card,
              borderRadius: Shapes.rounded.medium
            }}
          >
            <Typo
              size={17}
              fontWeight='medium'
              color={Colors.textSecondary}
              style={{ marginBottom: Sizes.spacing.s3 }}
            >
              You have no projects
            </Typo>
            <Typo
              size={15}
              fontWeight='regular'
              color={Colors.textPrimary}
              style={{ textDecorationLine: 'underline' }}
            >
              Tap to create one
            </Typo>
          </Pressable>

        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  addButton: {
    width: Sizes.width.w31,
    height: Sizes.height.h191,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Shapes.rounded.medium,
    marginRight: Sizes.spacing.s11,
    borderColor: Colors.border,
    borderWidth: 1
  },
  card: {
    width: Sizes.width.w225,
    height: Sizes.height.h191,
    marginRight: Sizes.spacing.s11,
    borderRadius: Shapes.rounded.medium,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    textAlign: 'center'
  }
})
