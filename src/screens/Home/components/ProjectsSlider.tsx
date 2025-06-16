import React, { useCallback, useState } from 'react'
import { Animated, StyleSheet, NativeSyntheticEvent, NativeScrollEvent, Pressable, View } from 'react-native'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import ProjectCard from './ProjectCard'
import Typo from '@/components/Typo'

const projects = [
  { title: 'Analytics Dashboard', category: 'Web Design', progress: 60, color: Colors.yellow },
  { title: 'Task Manager', category: 'Mobile Design', progress: 30, color: Colors.green },
  { title: 'Data Analytics For Dashboard & Reports', category: 'Interface Design', progress: 50, color: '#FFE0B2' },    // light orange
  { title: 'Data Analytics', category: 'Interface Design', progress: 50, color: '#B2DFDB' },                             // light teal
  { title: 'E-Commerce Admin Panel', category: 'Web Design', progress: 75, color: '#F8BBD0' },                           // light pink
  { title: 'Fitness Tracker App', category: 'Mobile Design', progress: 20, color: '#BBDEFB' },                           // light blue
  { title: 'Inventory Management System', category: 'Interface Design', progress: 45, color: '#D1C4E9' },                // light purple
  { title: 'Social Media Dashboard', category: 'Web Design', progress: 90, color: '#B2EBF2' },                          // light cyan
  { title: 'Note-Taking App', category: 'Mobile Design', progress: 55, color: '#C5CAE9' },                              // light indigo
  { title: 'Finance Tracking Tool', category: 'Interface Design', progress: 35, color: '#FFCDD2' }                      // light coral
]

export default function ProjectsSlider() {
  const [showAddButton, setShowAddButton] = useState<boolean>(false)

  const handleScrollEnd = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x

    if (x < 20 && !showAddButton) setShowAddButton(true)
    if (x > 20 && showAddButton) setShowAddButton(false)

  }, [showAddButton, setShowAddButton])

  return (
    <View>
      <Animated.ScrollView
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
          projects.map((project, index) => (
            <ProjectCard
              key={index}
              {...project}
            />
          ))
        }
      </Animated.ScrollView>
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
  }
})
