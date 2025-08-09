import { Controller, useForm } from 'react-hook-form'
import {
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView
} from 'react-native'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import Typo from '../shared/Typo'
import ActionButton from '../shared/ActionButton'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useCallback } from 'react'
import FormField from '../shared/FormField'
import Icon from '../icons/Icon'
import { InsertProjectTaskForForm } from '@/types/ProjectTask'

interface AddTaskModalProps {
  readonly colorTheme: string;
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly onAddTask: (task: Omit<InsertProjectTaskForForm, 'project_id'>) => void;
}

type FormData = {
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  due_date: string
  start_date: string
}

const PRIORITY_OPTIONS = ['low', 'medium', 'high'] as const

export default function AddTaskModal({ visible, onClose, onAddTask, colorTheme }: AddTaskModalProps) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      due_date: '',
      start_date: ''
    }
  })

  const onSubmit = useCallback((data: FormData) => {
    const taskData = {
      title: data.title.trim(),
      description: data.description.trim() || undefined,
      priority: data.priority,
      start_date: data.start_date ? new Date(data.start_date).toISOString() : undefined,
      due_date: data.due_date ? new Date(data.due_date).toISOString() : undefined
    }
    onAddTask(taskData)
    reset()
    onClose()
  }, [onAddTask, onClose, reset])

  return (
    <Modal
      visible={visible}
      animationType='slide'
      hardwareAccelerated
      presentationStyle='pageSheet'
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Typo size={19} weight='600'>Create New Task</Typo>
          <TouchableOpacity onPress={onClose}>
            <Icon.Close />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Controller
            name='title'
            control={control}
            rules={{ required: 'Task title is required' }}
            render={({ field: { onChange, value } }) => (
              <FormField
                label='Task Title'
                placeholder='Enter task title'
                value={value}
                error={errors.title?.message}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            name='description'
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormField
                label='Description'
                placeholder='Add description (optional)'
                value={value}
                error={errors.description?.message}
                onChangeText={onChange}
                multiline
                style={{ height: Sizes.height.h99, textAlignVertical: 'top' }}
              />
            )}
          />

          <Controller
            name='priority'
            control={control}
            render={({ field: { onChange, value } }) => (
              <View style={styles.section}>
                <Typo size={15} weight='600'>Priority</Typo>
                <View style={styles.priorityContainer}>
                  {PRIORITY_OPTIONS.map(p => {
                    const selected = value === p
                    const color = p === 'high' ? 'error' : p === 'medium' ? 'yellow' : 'green'

                    return (
                      <TouchableOpacity
                        key={p}
                        style={[
                          styles.priorityButton,
                          selected && {
                            backgroundColor: Colors[color] + '20',
                            borderColor: Colors[color]
                          }
                        ]}
                        onPress={() => onChange(p)}
                      >
                        <Typo color={selected ? color : 'secondary'} weight='600' size={13}>
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </Typo>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </View>
            )}
          />

          <Controller
            name='start_date'
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormField
                label='Start Date'
                placeholder='YYYY-MM-DD (optional)'
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            name='due_date'
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormField
                label='Due Date'
                placeholder='YYYY-MM-DD (optional)'
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </ScrollView>

        <View style={styles.footer}>
          <ActionButton
            style={styles.cancelButton}
            label='Cancel'
            typoProps={{ color: 'primary', size: 15 }}
            onPress={onClose}
          />
          <ActionButton
            style={[styles.submitButton, { backgroundColor: colorTheme }]}
            label='Create Task'
            typoProps={{ size: 15 }}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Sizes.spacing.s17,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  content: { flex: 1, padding: Sizes.spacing.s15 },
  section: { marginBottom: Sizes.spacing.s15 },
  priorityContainer: {
    flexDirection: 'row',
    gap: Sizes.spacing.s11,
    marginTop: Sizes.spacing.s5
  },
  priorityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizes.spacing.s15,
    paddingVertical: Sizes.spacing.s9,
    borderRadius: Shapes.rounded.base,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card
  },
  footer: {
    flexDirection: 'row',
    padding: Sizes.spacing.s15,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Sizes.spacing.s9,
    justifyContent: 'center'
  },
  cancelButton: {
    width: '49%',
    alignItems: 'center',
    backgroundColor: Colors.card
  },
  submitButton: {
    width: '49%',
    alignItems: 'center'
  }
})
