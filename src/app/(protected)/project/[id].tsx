import ScreenWrapper from '@/components/ScreenWrapper'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { memo, useCallback, useState, useMemo, useRef } from 'react'
import { formatProjectName } from '@/utils/utils'
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import Header from '@/components/project/Header'
import Typo from '@/components/shared/Typo'
import OptionsModal from '@/components/project/OptionsModal'
import { Sizes } from '@/constants/theme'
import TaskItem from '@/components/project/TaskItem'
import FloatingButton from '@/components/project/FloatingButton'
import AddTaskModal from '@/components/project/AddTaskModal'
import { use$ } from '@legendapp/state/react'
import { InsertProjectTaskForForm, ProjectTask } from '@/types/ProjectTask'
import { StatusTask } from '@/constants/constants'
import { projectsStore$ } from '@/store/projects.store'
import { projectTasksStore$ } from '@/store/projectTasks.store'
import { useAuth } from '@/hooks/auth/useAuth'

type Status = StatusTask | 'all'

type TabItem = {
  readonly key: Status
  readonly label: string
}

const tabs: TabItem[] = [
  { key: 'all', label: 'All' },
  { key: StatusTask.PENDING, label: 'Pending' },
  { key: StatusTask.COMPLETED, label: 'Completed' }
]

const MemoizedTaskItem = memo(({
  task,
  color,
  onChangeStatus
}: {
  task: ProjectTask
  color: string
  onChangeStatus: (taskId: string) => void
}) => (
  <TaskItem
    task={task}
    colorTheme={color}
    onChangeStatus={onChangeStatus}
  />
))

MemoizedTaskItem.displayName = 'MemoizedTaskItem'

const EmptyComponent = memo(({ tab }: { tab: Status }) => (
  <View style={styles.emptyContainer}>
    <Typo size={15} color='secondary' style={styles.empty}>
      {tab === 'all' ? 'No tasks yet.' : `No ${tab.toLowerCase()} tasks.`}
    </Typo>
    <Typo size={13} color='secondary' style={styles.emptySubtext}>
      Tap the + button to add a task
    </Typo>
  </View>
))

EmptyComponent.displayName = 'EmptyComponent'

export default memo(function Details() {
  const { id: projectId } = useLocalSearchParams() as { id?: string }
  const router = useRouter()
  const { user } = useAuth()
  const flatListRef = useRef<FlatList>(null)

  const [showOptions, setShowOptions] = useState(false)
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [tab, setTab] = useState<Status>('all')

  const projectTasksStore = use$(() => projectTasksStore$(user?.id ?? ''))
  const projectsStore = use$(() => projectsStore$(user?.id ?? ''))

  const handleBack = useCallback(() => {
    const canGoBack = router.canGoBack()
    if (canGoBack) return router.back()
    router.replace('/(protected)/(tabs)')
  }, [router])

  const { projects, updateProject, deleteProject } = projectsStore
  const { projectTasks, createProjectTask, updateProjectTask, deleteProjectTask } = projectTasksStore

  const filteredTasks = useMemo(() => {
    const allTasks = Object.values(projectTasks || {})
    const projectSpecificTasks = allTasks.filter(t => t.project_id === projectId)

    if (tab === 'all') return projectSpecificTasks
    return projectSpecificTasks.filter(t => t.status === tab)
  }, [projectTasks, projectId, tab])

  const projectData = useMemo(() => {
    if (!projectId || !projects) return null
    const project = projects[projectId]
    if (!project) return null

    const { name: projectName, description, color } = project
    const { firstPart, remaining } = formatProjectName(projectName || '')

    return { project, firstPart, remaining, description, color }
  }, [projectId, projects])

  const onAddTask = useCallback((newTask: Omit<InsertProjectTaskForForm, 'project_id'>) => {
    if (!projectId || !createProjectTask || !updateProject) return

    try {
      createProjectTask({
        ...newTask,
        project_id: projectId
      })

      updateProject(projectId, (prev) => ({
        task_count: prev.task_count + 1
      }))

      setShowAddTaskModal(false)

      flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create task'
      Alert.alert('Failed to create task', message)
      console.error('Failed to create task on component Details:', error)
    }
  }, [projectId, createProjectTask, updateProject])

  const handleStatusTaskChange = useCallback((taskId: string) => {
    if (!updateProjectTask || !updateProject || !projectId) return

    const task = projectTasks[taskId]
    if (!task) return

    try {
      const newStatus = task.status === StatusTask.COMPLETED ? StatusTask.PENDING : StatusTask.COMPLETED

      updateProjectTask(taskId, { status: newStatus })
      updateProject(projectId, (prev) => {
        const completedChange = newStatus === StatusTask.COMPLETED ? 1 : -1
        return {
          completed_tasks: prev.completed_tasks + completedChange
        }
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update task'
      Alert.alert('Error', message)
      console.error('Task update error on component Details:', error)
    }
  }, [projectTasks, updateProjectTask, updateProject, projectId])

  const handleDeleteProject = useCallback(() => {
    if (!deleteProject || !deleteProjectTask || !projectId) return

    Alert.alert(
      'Delete Project',
      'Are you sure you want to delete this project? This will also delete all tasks.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            try {
              const taskIds = Object.keys(projectTasks || {})

              taskIds.forEach(taskId => {
                deleteProjectTask(taskId)
              })

              deleteProject(projectId)
              handleBack()
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Failed to delete project'
              Alert.alert('Error', message)
              console.error('Project deletion error on component Details:', error)
            }
          }
        }
      ]
    )
  }, [deleteProjectTask, deleteProject, projectId, handleBack, projectTasks])

  const handleTabChange = useCallback((newTab: Status) => {
    setTab(newTab)
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false })
  }, [])

  const renderTaskItem = useCallback(({ item }: { item: ProjectTask }) => (
    <MemoizedTaskItem
      task={item}
      color={projectData?.color || ''}
      onChangeStatus={handleStatusTaskChange}
    />
  ), [handleStatusTaskChange, projectData?.color])

  const keyExtractor = useCallback((item: ProjectTask) => item.id, [])

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 80,
    offset: 80 * index,
    index
  }), [])

  if (!user?.id || !projectId || !projects) {
    return (
      <ScreenWrapper>
        <Header
          title='Details'
          onBack={handleBack}
          onOptions={() => setShowOptions(true)}
        />
        <View style={styles.errorContainer}>
          <Typo size={17} weight='500' color='error'>
            {!user?.id ? 'Please log in to view project' : 'Project not found'}
          </Typo>
        </View>
      </ScreenWrapper>
    )
  }

  if (!projectData) {
    return (
      <ScreenWrapper>
        <Header
          title='Details'
          onBack={handleBack}
          onOptions={() => setShowOptions(true)}
        />
        <View style={styles.errorContainer}>
          <Typo size={17} weight='500' color='error'>Project not found</Typo>
        </View>
      </ScreenWrapper>
    )
  }

  const { firstPart, remaining, description, color } = projectData

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header
          title='Details'
          onBack={handleBack}
          onOptions={() => setShowOptions(true)}
        />

        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Typo size={23} weight='400' color={remaining ? 'secondary' : 'primary'}>
              {firstPart}
            </Typo>
            {remaining && (
              <Typo size={27} weight='600' color='primary'>
                {remaining}
              </Typo>
            )}
            {description && (
              <Typo
                style={styles.description}
                size={15}
                weight='500'
                color='secondary'
                numberOfLines={3}
              >
                {description}
              </Typo>
            )}
          </View>

          <View style={styles.tabBar}>
            {tabs.map(t => (
              <TouchableOpacity
                key={t.key}
                activeOpacity={0.7}
                onPress={() => handleTabChange(t.key)}
                style={[
                  styles.tabItem,
                  tab === t.key && styles.tabItemActive,
                  { borderBottomColor: color }
                ]}
              >
                <Typo
                  size={15}
                  weight={tab === t.key ? '600' : '400'}
                  color={tab === t.key ? 'primary' : 'secondary'}
                >
                  {t.label}
                </Typo>
              </TouchableOpacity>
            ))}
          </View>

          <FlatList
            ref={flatListRef}
            data={filteredTasks}
            keyExtractor={keyExtractor}
            renderItem={renderTaskItem}
            getItemLayout={getItemLayout}
            contentContainerStyle={styles.list}
            removeClippedSubviews={true}
            initialNumToRender={15}
            maxToRenderPerBatch={15}
            windowSize={10}
            updateCellsBatchingPeriod={50}
            scrollEventThrottle={16}
            ListEmptyComponent={<EmptyComponent tab={tab} />}
          />
        </View>

        <FloatingButton
          onPress={() => setShowAddTaskModal(true)}
          color={color}
        />

        <OptionsModal
          visible={showOptions}
          onClose={() => setShowOptions(false)}
          onEdit={() => {
            setShowOptions(false)
            // Navigate to edit
          }}
          onDelete={handleDeleteProject}
        />

        <AddTaskModal
          colorTheme={color}
          visible={showAddTaskModal}
          onClose={() => setShowAddTaskModal(false)}
          onAddTask={onAddTask}
        />
      </View>
    </ScreenWrapper>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1
  },
  titleSection: {
    marginTop: Sizes.spacing.s15
  },
  description: {
    marginTop: Sizes.spacing.s11
  },
  tabBar: {
    flexDirection: 'row',
    marginTop: Sizes.spacing.s21,
    justifyContent: 'space-between'
  },
  tabItem: {
    flex: 1,
    paddingVertical: Sizes.spacing.s7,
    alignItems: 'center'
  },
  tabItemActive: {
    borderBottomWidth: 2
  },
  list: {
    paddingVertical: Sizes.spacing.s11
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: Sizes.spacing.s21
  },
  empty: {
    textAlign: 'center'
  },
  emptySubtext: {
    textAlign: 'center',
    marginTop: Sizes.spacing.s5
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
