import ScreenWrapper from '@/components/ScreenWrapper'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import useProjects from '@/hooks/data/useProjects'
import useProjectTasks from '@/hooks/data/useProjectTasks'
import { formatProjectName } from '@/utils/utils'
import { Alert, FlatList, Pressable, StyleSheet, View } from 'react-native'
import Header from '@/components/project/Header'
import Typo from '@/components/shared/Typo'
import OptionsModal from '@/components/project/OptionsModal'
import { Sizes } from '@/constants/theme'
import TaskItem from '@/components/project/TaskItem'
import FloatingButton from '@/components/project/FloatingButton'

type Status = 'pending' | 'completed' | 'all'

type TabItem = {
  readonly key: Status
  readonly label: string
}

const tabs: TabItem[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' }
]

export default function Details() {
  const { id } = useLocalSearchParams() as { id: string | undefined }
  const router = useRouter()
  const [showOptions, setShowOptions] = useState(false)
  const [tab, setTab] = useState<Status>('all')
  const { getProjectsById, deleteProjectById } = useProjects()

  const { name: projectName, description, color } = getProjectsById(id || '') || {}
  const tasks = useProjectTasks().tasks.filter(t => t.project_id === id)

  const { firstPart, remaining } = formatProjectName(projectName || '')

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
            if (!id) return
            deleteProjectById(id)
            router.back()
          }
        }
      ]
    )
  }, [deleteProjectById, id, router])

  const filteredTasks = useMemo(() => {
    if (tab === 'all') return tasks

    return tasks.filter(t => {
      if (tab === 'pending') return t.status === 'pending'
      return t.status === 'completed'
    })
  }, [tasks, tab])

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
            <Typo size={23} weight='400' color='secondary'>
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
            ListEmptyComponent={
              <Typo size={15} color='secondary' style={styles.empty}>
                No tasks.
              </Typo>
            }
            renderItem={({ item }) => <TaskItem task={item} />}
          />
        </View>

        <FloatingButton
          onPress={() => { /* abrir modal de nueva tarea */ }}
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
