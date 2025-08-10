import ScreenWrapper from '@/components/ScreenWrapper'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { memo, useCallback, useState, useRef, useDeferredValue, useEffect } from 'react'
import { formatProjectName } from '@/utils/utils'
import { Alert, InteractionManager, StyleSheet, View } from 'react-native'
import Header from '@/components/projectDetails/Header'
import Typo from '@/components/shared/Typo'
import OptionsModal from '@/components/projectDetails/OptionsModal'
import { Sizes } from '@/constants/theme'
import TaskItem from '@/components/projectDetails/TaskItem'
import FloatingButton from '@/components/projectDetails/FloatingButton'
import AddTaskModal from '@/components/projectDetails/AddTaskModal'
import { use$ } from '@legendapp/state/react'
import { InsertProjectTaskForForm, ProjectTask } from '@/types/ProjectTask'
import { StatusTask } from '@/constants/constants'
import { projectsStore$ } from '@/store/projects.store'
import { projectTasksStore$ } from '@/store/projectTasks.store'
import { useAuth } from '@/hooks/auth/useAuth'
import { LegendList, LegendListRef } from '@legendapp/list'
import ProjectInfo from '@/components/projectDetails/ProjectInfo'
import ProjectTabs from '@/components/projectDetails/ProjectTabs'
import TaskItemSkeleton from '@/components/projectDetails/TaskItemSkeleton'
import i18n from '@/i18n'

type Status = StatusTask | 'all'

const EmptyComponent = memo(({ tab }: { tab: Status }) => {
  const statusMap: Record<StatusTask, string> = {
    [StatusTask.PENDING]: i18n.t('projectDetails.status.plural.pending').toLowerCase(),
    [StatusTask.COMPLETED]: i18n.t('projectDetails.status.plural.completed').toLowerCase()
  }

  const isAll = tab === 'all'
  const statusTranslation = !isAll && statusMap[tab as StatusTask] ? statusMap[tab as StatusTask] : ''

  const mainText = isAll
    ? i18n.t('projectDetails.emptyAll')
    : i18n.t('projectDetails.emptyStatus', { status: statusTranslation })

  return (
    <View style={styles.emptyContainer}>
      <Typo size={15} color='secondary' style={styles.empty}>
        {mainText}
      </Typo>
      <Typo size={13} color='secondary' style={styles.emptySubtext}>
        {i18n.t('projectDetails.emptySubtext')}
      </Typo>
    </View>
  )
})

EmptyComponent.displayName = 'EmptyComponent'

export default memo(function Details() {
  const { id: projectId } = useLocalSearchParams() as { id?: string }
  const router = useRouter()
  const { user } = useAuth()
  const flatListRef = useRef<LegendListRef>(null)

  const [showOptions, setShowOptions] = useState(false)
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [tab, setTab] = useState<Status>('all')
  const deferredTab = useDeferredValue(tab)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setReady(true)
    })
    return () => task.cancel?.()
  }, [])

  const handleBack = useCallback(() => {
    const canGoBack = router.canGoBack()
    if (canGoBack) return router.back()
    router.replace('/(protected)/(tabs)')
  }, [router])

  const { projectTasksStore, projectsStore } = use$(() => ({
    projectTasksStore: projectTasksStore$(user?.id ?? ''),
    projectsStore: projectsStore$(user?.id ?? '')
  }))

  const { projects, updateProject, deleteProject } = projectsStore
  const { projectTasks, createProjectTask, updateProjectTask, deleteProjectTask } = projectTasksStore

  const tasksByProject = use$(() => {
    const map = new Map<string, Map<Status, ProjectTask[]>>()

    if (!projectTasks) return map

    for (const task of Object.values(projectTasks || {})) {
      const pid = task.project_id
      if (!map.has(pid)) {
        map.set(
          pid,
          new Map<Status, ProjectTask[]>([
            ['all', []],
            [StatusTask.PENDING, []],
            [StatusTask.COMPLETED, []]
          ])
        )
      }

      const statusMap = map.get(pid)
      if (!statusMap) continue
      statusMap.get('all')?.push(task)
      statusMap.get(task.status as Status)?.push(task)
    }

    return map
  })

  const filteredTasks = use$(() => {
    if (!projectId) return []
    return tasksByProject.get(projectId)?.get(deferredTab) ?? []
  })

  const projectData = use$(() => {
    if (!projectId || !projects) return null
    const project = projects[projectId]
    if (!project) return null

    const { name: projectName, description, color } = project
    const { firstPart, remaining } = formatProjectName(projectName || '')

    return { project, firstPart, remaining, description, color }
  })

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
        return { completed_tasks: prev.completed_tasks + completedChange }
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
      i18n.t('projectDetails.deleteProjectTitle'),
      i18n.t('projectDetails.deleteProjectMessage'),
      [
        { text: i18n.t('projectDetails.cancel'), style: 'cancel' },
        {
          text: i18n.t('projectDetails.delete'),
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

  const renderTaskItem = useCallback(
    ({ item }: { item: ProjectTask }) => (
      <TaskItem
        task={item}
        colorTheme={projectData?.color}
        onChangeStatus={handleStatusTaskChange}
      />
    ),
    [projectData?.color, handleStatusTaskChange]
  )

  if (!user?.id || !projectId || !projects) {
    return (
      <ScreenWrapper>
        <Header
          title={i18n.t('projectDetails.headerTitle')}
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
          title={i18n.t('projectDetails.headerTitle')}
          onBack={handleBack}
          onOptions={() => setShowOptions(true)}
        />
        <View style={styles.errorContainer}>
          <Typo size={17} weight='500' color='error'>{i18n.t('projectDetails.errorProjectNotFound')}</Typo>
        </View>
      </ScreenWrapper>
    )
  }

  const { firstPart, remaining, description, color } = projectData

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header
          title={i18n.t('projectDetails.headerTitle')}
          onBack={handleBack}
          onOptions={() => setShowOptions(true)}
        />

        <View style={styles.container}>
          <ProjectInfo
            firstPart={firstPart}
            remaining={remaining}
            description={description}
          />

          <ProjectTabs
            tab={tab}
            onChange={handleTabChange}
            color={color}
          />

          {ready ? (
            <LegendList
              ref={flatListRef}
              data={filteredTasks}
              keyExtractor={item => item.id}
              renderItem={renderTaskItem}
              estimatedItemSize={50}
              contentContainerStyle={styles.list}
              ListEmptyComponent={<EmptyComponent tab={tab} />}
              showsVerticalScrollIndicator={false}
              waitForInitialLayout={true}
              recycleItems
            />
          ) : (
            <View style={styles.list}>
              {Array.from({ length: 5 }, (_, index) => (
                <TaskItemSkeleton key={index} />
              ))}
            </View>
          )}
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
  tabBar: {
    flexDirection: 'row',
    marginTop: Sizes.spacing.s21,
    justifyContent: 'space-between'
  },
  tabItem: {
    flex: 1,
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
