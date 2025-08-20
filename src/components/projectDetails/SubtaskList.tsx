import React, {
  memo,
  useCallback,
  useEffect,
  useState,
  useRef
} from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Keyboard
} from 'react-native'
import { Q, Query } from '@nozbe/watermelondb'
import Typo from '@/components/shared/Typo'
import { Sizes, Shapes, Colors } from '@/constants/theme'
import { Subtask } from '@/models'
import { LegendList, LegendListRef } from '@legendapp/list'
import SubtaskItem from './SubTaskItem'
import { useDatabase } from '@nozbe/watermelondb/react'
import Icon from '../icons/Icon'
import FormField from '../shared/FormField'
import { StatusTask } from '@/constants/constants'
import i18n from '@/i18n'

const EmptyStateComponent = memo(function EmptyStateComponent() {
  return (
    <View style={styles.emptyContainer}>
      <Typo size={15} color='secondary' style={styles.empty}>
        {i18n.t('projectDetails.subTaskPage.emptyState.title')}
      </Typo>
      <Typo size={13} color='secondary' style={styles.emptySubtext}>
        {i18n.t('projectDetails.subTaskPage.emptyState.subtext')}
      </Typo>
    </View>
  )
})

interface Props {
  taskId: string
  subtasksQuery: Query<Subtask>
}

const SubtaskList = memo(function SubtaskList({ taskId, subtasksQuery }: Props) {
  const db = useDatabase()
  const [subtasks, setSubtasks] = useState<Subtask[]>([])
  const listRef = useRef<LegendListRef>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [text, setText] = useState('')

  useEffect(() => {
    const subscription = subtasksQuery
      .extend(
        Q.where('task_id', taskId),
        Q.sortBy('completed', Q.asc),
        Q.sortBy('created_at', Q.desc)
      )
      .observeWithColumns(['text', 'completed'])
      .subscribe(setSubtasks)

    return () => subscription.unsubscribe()
  }, [taskId, subtasksQuery])

  useEffect(() => {
    if (subtasks.length > 0) {
      listRef.current?.scrollToIndex({ index: 0, animated: true })
    }
  }, [subtasks.length])

  const updateProgress = useCallback(async (subtask: Subtask) => {
    const task = await subtask.task
    const project = await task.project.fetch()
    const [subsLength, subsCompleted] = await Promise.all([
      subtasksQuery.count,
      subtasksQuery.extend(Q.where('completed', true)).count
    ])
    const newPct = subsLength > 0 ? Math.round((subsCompleted / subsLength) * 100) : 0
    const allSubsCompleted = subsLength === subsCompleted

    await db.write(async () => {
      await task.update(t => {
        t.progressPercentage = newPct
        t.status = allSubsCompleted ? StatusTask.COMPLETED : newPct > 0 ? StatusTask.IN_PROGRESS : StatusTask.PENDING
      })
    })

    const [taskLength, taskCompleted] = await Promise.all([
      project.tasks.count,
      project.tasks.extend(Q.where('status', StatusTask.COMPLETED)).count
    ])
    const projPct = taskLength > 0 ? Math.round((taskCompleted / taskLength) * 100) : 0

    if (projPct !== project.progressPercentage) {
      await project.updateProject({ progressPercentage: projPct })
    }
  }, [db, subtasksQuery])

  const handleToggle = useCallback(async (id: string) => {
    try {
      const subtask = await subtasksQuery.collection.find(id)
      await subtask.toggleCompleted()
      await updateProgress(subtask)
    } catch (error) {
      console.error('Error toggling subtask:', error)
    }
  }, [subtasksQuery, updateProgress])

  const handleCreate = useCallback(async () => {
    const trimmed = text.trim()
    if (!trimmed) return
    setText('')
    try {
      const newSubtask = await db.write(async () => {
        return await subtasksQuery.collection.create(s => {
          s.text = trimmed
          s.completed = false
          s.taskId = taskId
        })
      })
      await updateProgress(newSubtask)
      Keyboard.dismiss()
      setIsCreating(false)
    } catch (error) {
      console.error('Error creating subtask:', error)
    }
  }, [db, text, taskId, subtasksQuery, updateProgress])

  const handleCancel = useCallback(() => {
    setText('')
    setIsCreating(false)
    Keyboard.dismiss()
  }, [])

  const openForm = useCallback(() => setIsCreating(true), [])

  const renderItem = useCallback(({ item }: { item: Subtask }) => (
    <SubtaskItem
      id={item.id}
      text={item.text}
      completed={item.completed}
      onToggle={handleToggle}
    />
  ), [handleToggle])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typo size={13} weight='500' color='secondary'>
          {i18n.t('projectDetails.subTaskPage.info.subTaskLabel').toUpperCase()}
        </Typo>
        <TouchableOpacity onPress={openForm} style={styles.addButton} disabled={isCreating}>
          <Icon.Add size={21} />
        </TouchableOpacity>
      </View>

      {isCreating && (
        <View style={styles.formRow}>
          <FormField
            value={text}
            onChangeText={setText}
            placeholder={i18n.t('projectDetails.subTaskPage.list.newTask')}
            placeholderTextColor={Colors.secondary}
            style={styles.formInput}
            containerStyle={styles.formContainer}
            wrapperStyle={styles.formWrapper}
            returnKeyType='done'
            onSubmitEditing={handleCreate}
            maxLength={250}
          />
          <View style={styles.formActions}>
            <TouchableOpacity
              onPress={handleCancel}
              style={styles.iconButton}
            >
              <Icon.Close size={28.5} color={Colors.secondary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCreate}
              style={styles.iconButton}
            >
              <Icon.CheckCircle size={25} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <LegendList
        ref={listRef}
        data={subtasks}
        extraData={subtasks}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyStateComponent />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        recycleItems
        keyboardShouldPersistTaps='handled'
      />
    </View>
  )
})

export default SubtaskList

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Sizes.spacing.s7,
    paddingTop: Sizes.spacing.s5,
    paddingBottom: Sizes.spacing.s5
  },
  addButton: {
    padding: Sizes.spacing.s7,
    borderRadius: Shapes.rounded.circle,
    backgroundColor: Colors.card
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizes.spacing.s7
  },
  formContainer: { flex: 1, marginTop: Sizes.spacing.s5 },
  formWrapper: {
    borderWidth: 0,
    backgroundColor: Colors.card,
    borderRadius: Shapes.rounded.md,
    paddingHorizontal: Sizes.spacing.s5
  },
  formInput: { flex: 1, paddingVertical: Sizes.spacing.s7 },
  formActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Sizes.spacing.s9,
    marginBottom: Sizes.spacing.s11,
    gap: Sizes.spacing.s5
  },
  iconButton: { alignItems: 'center', justifyContent: 'center' },
  listContent: {
    gap: Sizes.spacing.s7,
    paddingHorizontal: Sizes.spacing.s7,
    paddingBottom: Sizes.spacing.s33
  },
  emptyContainer: { alignItems: 'center', marginTop: Sizes.spacing.s21 },
  empty: { textAlign: 'center' },
  emptySubtext: { textAlign: 'center', marginTop: Sizes.spacing.s5 }
})
