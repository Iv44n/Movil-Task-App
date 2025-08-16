import { useCallback, useEffect, useMemo, useState } from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useDatabase } from '@nozbe/watermelondb/react'
import { Q } from '@nozbe/watermelondb'
import AddTaskModal from '@/components/projectDetails/AddTaskModal'
import FloatingButton from '@/components/projectDetails/FloatingButton'
import Header from '@/components/projectDetails/Header'
import OptionsModal from '@/components/projectDetails/OptionsModal'
import ProjectInfo from '@/components/projectDetails/ProjectInfo'
import ProjectTabs from '@/components/projectDetails/ProjectTabs'
import ScreenWrapper from '@/components/ScreenWrapper'
import { Priority, StatusTask } from '@/constants/constants'
import { TABLE_NAMES } from '@/lib/schema'
import i18n from '@/i18n'
import { Project, Task } from '@/models'
import { formatProjectName } from '@/utils/utils'
import { ProjectContext } from '@/context/ProjectContext'
import { Alert } from 'react-native'
import { useAuth } from '@/hooks/auth/useAuth'

type Status = StatusTask | 'all'

type FormData = {
  title: string
  priority: Priority
  startDate: Date | null
  dueDate: Date | null
}

export default function ProjectLayout() {
  const { id: projectId } = useLocalSearchParams() as { id?: string }
  const router = useRouter()
  const db = useDatabase()
  const { user } = useAuth()
  const userId = user?.id

  if (!projectId || !userId) throw new Error('Project ID or User ID is required')

  const [showOptions, setShowOptions] = useState(false)
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [project, setProject] = useState<Project | null>(null)
  const [tab, setTab] = useState<Status>('all')

  const projectQuery = useMemo(
    () => db.collections
      .get<Project>(TABLE_NAMES.PROJECTS)
      .query(Q.where('id', projectId), Q.take(1)),
    [db, projectId]
  )

  useEffect(() => {
    const subscription = projectQuery.observe().subscribe((projects) => {
      setProject(projects[0] ?? null)
    })

    return () => subscription.unsubscribe()
  }, [projectQuery])

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/(protected)/(tabs)')
    }
  }, [router])

  const handleTabChange = useCallback((newTab: Status) => {
    setTab(newTab)
  }, [])

  const handleOptionsClose = useCallback(() => {
    setShowOptions(false)
  }, [])

  const handleEdit = useCallback(() => {
    setShowOptions(false)
    // TODO: Navigate to edit
  }, [])

  const handleDelete = useCallback(async() => {
    try {
      setShowOptions(false)
      await project?.deleteProject()
      handleBack()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete project'
      Alert.alert('Error', message)
      console.error('Project deletion error on component ProjectLayout:', error)
    }
  }, [project, handleBack])

  const handleAddTaskModalClose = useCallback(() => {
    setShowAddTaskModal(false)
  }, [])

  const handleAddTask = useCallback(async ({ title, priority, startDate, dueDate }: FormData) => {
    try {
      await db.write(async () => {
        await db.collections.get<Task>(TABLE_NAMES.TASKS).create(t => {
          t.userId = userId
          t.title = title
          t.priority = priority
          t.status = StatusTask.PENDING
          t.projectId = projectId
          t.startDate = startDate
          t.dueDate = dueDate
        })
      })
      await project?.updateProject({
        taskCount: project?.taskCount + 1
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add task'
      Alert.alert('Error', message)
      console.error('Task creation error on component ProjectLayout:', error)
    }
  }, [db, projectId, userId, project])

  const { firstPart, remaining } = useMemo(
    () => formatProjectName(project?.name || ''),
    [project?.name]
  )

  const projectColor = project?.color || ''

  if (!project) {
    return null
  }

  return (
    <ScreenWrapper>
      <Header
        title={i18n.t('projectDetails.headerTitle')}
        onBack={handleBack}
        onOptions={() => setShowOptions(true)}
      />

      <ProjectInfo
        firstPart={firstPart}
        remaining={remaining}
        description={project?.description}
      />

      <ProjectTabs
        tab={tab}
        onChange={handleTabChange}
        color={projectColor}
      />

      <ProjectContext.Provider
        value={{
          projectTasks: project.tasks,
          tab,
          colorTheme: projectColor        }}
      >
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' }
          }}
        />
      </ProjectContext.Provider>

      <OptionsModal
        visible={showOptions}
        onClose={handleOptionsClose}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FloatingButton
        onPress={() => setShowAddTaskModal(true)}
        color={projectColor}
      />

      <AddTaskModal
        colorTheme={projectColor}
        visible={showAddTaskModal}
        onAddTask={handleAddTask}
        onClose={handleAddTaskModalClose}
      />
    </ScreenWrapper>
  )
}
