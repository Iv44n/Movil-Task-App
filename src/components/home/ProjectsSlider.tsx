import React, { useCallback, useEffect, useState } from 'react'
import { Animated, StyleSheet, NativeSyntheticEvent, NativeScrollEvent, Pressable, View, ScrollView } from 'react-native'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import ProjectCard from '@/components/home/ProjectCard'
import Typo from '@/components/shared/Typo'
import { Link } from 'expo-router'
import { Database } from '@/lib/database.types'
import useProjects from '@/hooks/data/useProjects'
import { observer } from '@legendapp/state/react'

export type ProjectType = Database['public']['Tables']['projects']['Row']

export default observer(function ProjectsSlider() {
  const [showAddButton, setShowAddButton] = useState<boolean>(false)
  const { projects } = useProjects()
  const scrollRef = React.useRef<ScrollView>(null)

  useEffect(() => {
    if (projects.length === 0 && scrollRef.current) {
      scrollRef.current?.scrollTo({ x: 0 })
    }
  }, [projects])

  const handleScrollEnd = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x

    if (x < 10 && !showAddButton) {
      setShowAddButton(true)
    }
    if (x > 10 && showAddButton) setShowAddButton(false)

  }, [showAddButton, setShowAddButton])

  return (
    <View>
      {
        projects && projects.length > 0 ? (
          <Animated.ScrollView
            ref={scrollRef}
            horizontal
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            onScrollEndDrag={handleScrollEnd}
          >
            {showAddButton && (
              <Link
                href='/project/create'
                style={styles.addButton}
                asChild
              >
                <Pressable>
                  <Typo size={29} weight='500'>+</Typo>
                </Pressable>
              </Link>
            )}
            {
              projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  {...project}
                />
              ))
            }
          </Animated.ScrollView>
        ) : (
          <Link
            href='/project/create'
            style={{
              height: Sizes.height.h191,
              borderColor: Colors.border,
              borderWidth: 1,
              borderRadius: Shapes.rounded.md,
              backgroundColor: Colors.card,
              alignItems: 'center',
              justifyContent: 'center'
            }}
            asChild
          >
            <Pressable>
              <Typo
                size={17}
                weight='500'
                color='secondary'
                style={{ marginBottom: Sizes.spacing.s3 }}
              >
                You have no projects
              </Typo>
              <Typo
                size={15}
                weight='400'
                color='primary'
                style={{ textDecorationLine: 'underline' }}
              >
                Tap to create one
              </Typo>
            </Pressable>
          </Link>

        )
      }
    </View>
  )
})

const styles = StyleSheet.create({
  addButton: {
    width: Sizes.width.w31,
    height: Sizes.height.h191,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Shapes.rounded.md,
    marginRight: Sizes.spacing.s11,
    borderColor: Colors.border,
    borderWidth: 1
  },
  card: {
    width: Sizes.width.w225,
    height: Sizes.height.h191,
    marginRight: Sizes.spacing.s11,
    borderRadius: Shapes.rounded.md,
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
