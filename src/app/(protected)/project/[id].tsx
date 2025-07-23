import ScreenWrapper from '@/components/ScreenWrapper'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { formatProjectName } from '@/utils/utils'
import { Alert, FlatList, Pressable, StyleSheet, View } from 'react-native'
import Header from '@/components/project/Header'
import Typo from '@/components/shared/Typo'
import OptionsModal from '@/components/project/OptionsModal'
import { Sizes } from '@/constants/theme'
import TaskItem from '@/components/project/TaskItem'
import FloatingButton from '@/components/project/FloatingButton'
import { AddTaskModal } from '@/components/project/AddTaskModalProps'
import { use$ } from '@legendapp/state/react'
import { InsertProjectTaskForForm } from '@/types/ProjectTask'
import { StatusTask } from '@/constants/constants'
import { projects$ } from '@/store/projects.store'
import { projectTasks$ } from '@/store/projectTasks.store'
import { randomUUID } from 'expo-crypto'
import { batch } from '@legendapp/state'

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

export default function Details() {
  const { id: projectId } = useLocalSearchParams() as { id?: string }
  const router = useRouter()
  const [showOptions, setShowOptions] = useState(false)
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [tab, setTab] = useState<Status>('all')

  const allTasks = use$(() =>
    Object.values(projectTasks$.peek() || {})
      .filter(t => t.project_id === projectId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  )

  const filteredTasks = use$(() => {
    const out: typeof allTasks = []

    for (const t of allTasks) {
      if (tab === 'all') {
        out.push(t)
        continue
      }

      if (tab === StatusTask.PENDING || tab === StatusTask.COMPLETED) {
        if (t.status !== tab) continue
      }

      out.push(t)
    }
    return out
  })

  const { name: projectName, description, color } = use$(() =>
    projects$[projectId ?? '']?.get() || {}
  )
  const { firstPart, remaining } = formatProjectName(projectName || '')

  const onAddTask = useCallback((newTask: InsertProjectTaskForForm) => {
    try {
      if (!newTask.title) throw new Error('Title is required')
      if (!projectId) throw new Error('Project ID is required')

      batch(() => {
        const newTaskId = randomUUID()
        const result = projectTasks$[newTaskId].assign({
          id: newTaskId,
          project_id: projectId,
          ...newTask
        })

        projectTasks$.set(prev => ({ [newTaskId]: result.get(), ...prev }))
        projects$[projectId].task_count.set(c => c + 1)
      })
    } catch (error) {
      console.error(error)
    } finally {
      setShowAddTaskModal(false)
    }
  }, [projectId])

  const handleStatusTaskChange = useCallback((taskId: string) =>
    batch(() => {
      const task = projectTasks$[taskId]
      task.status.set(s =>
        s === StatusTask.COMPLETED
          ? StatusTask.PENDING
          : StatusTask.COMPLETED
      )

      projects$[task.project_id.get()].completed_tasks
        .set(prevCompletedTasks =>
          prevCompletedTasks + (task.status.get() === StatusTask.COMPLETED ? -1 : 1)
        )
    }), [])

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Confirm deletion',
      'Are you sure you want to delete this project?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (!projectId) return
            batch(() => {
              const projectTasks = Object.values(projectTasks$.peek() || {}).filter(task =>
                task.project_id === projectId
              ).map(task => task.id)
              for (const taskId of projectTasks) {
                projectTasks$[taskId].delete()
              }
              projects$[projectId].delete()
            })
            router.back()
          }
        }
      ]
    )
  }, [projectId, router])

  return (
    <ScreenWrapper>
      <View style={{ flex: 1 }}>
        <Header
          title='Details'
          onBack={() => router.back()}
          onOptions={() => setShowOptions(true)}
        />

        <View style={styles.container}>
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
              <Pressable
                key={t.key}
                onPress={() => setTab(t.key)}
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
              </Pressable>
            ))}
          </View>

          <FlatList
            data={filteredTasks}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            removeClippedSubviews
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            updateCellsBatchingPeriod={50}
            renderItem={({ item }) => <TaskItem task={item} colorTheme={color} onChangeStatus={handleStatusTaskChange}/>}
            ListEmptyComponent={
              <Typo size={15} color='secondary' style={styles.empty}>
                No tasks.
              </Typo>
            }
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
          // navegar a editar
          }}
          onDelete={handleDelete}
        />

        <AddTaskModal
          colorTheme={color!}
          visible={showAddTaskModal}
          onClose={() => setShowAddTaskModal(false)}
          onAddTask={onAddTask}
        />
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
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
  empty: {
    textAlign: 'center',
    marginTop: Sizes.spacing.s21
  }
})
