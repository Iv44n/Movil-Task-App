import { useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  Modal,
  TouchableOpacity
} from 'react-native'
import { Stack, useRouter } from 'expo-router'
import Typo from '@/components/Typo'
import { Colors, Sizes, Shapes } from '@/constants/theme'
import useBoundStore from '@/store/useBoundStore'
import { Project } from '@/types/project'
import { Task } from '@/types/task'
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon'
import HorizontalDotMenuIcon from '@/components/icons/HorizontalDotMenuIcon'
import { CapitalizeWords } from '@/utils/utils'

export default function ProjectDetails({ id }: { id: string }) {
  const projectId = Number(id)
  const router = useRouter()

  const getProjectWithTasksById = useBoundStore(state => state.getProjectWithTasksById)
  const deleteProjectById = useBoundStore(state => state.deleteProjectById)

  const [project, setProject] = useState<Project | null>(null)
  const [showOptions, setShowOptions] = useState(false)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectWithTasksById(projectId)
        setProject(data)
      } catch (err: any) {
        console.error(err)
      } finally {
      }
    }
    if (projectId) fetchProject()
  }, [projectId, getProjectWithTasksById])

  const handleDelete = () => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar este proyecto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProjectById(projectId)
              router.back()
            } catch (err: any) {
              console.error(err)
            }
          }
        }
      ]
    )
  }

  const { name, tasks } = project || {}
  const words = name?.trim().split(' ').filter(Boolean).map(CapitalizeWords) || []

  let [firstWord = '', ...rest] = words

  if (rest.length > 0 && rest[0].length < 4) {
    firstWord = `${firstWord} ${rest[0]}`
    rest = rest.slice(1)
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Details',
          headerShown: true,
          header: () => (
            <View
              style={{
                backgroundColor: Colors.background,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <View>
                <Pressable
                  style={{
                    padding: Sizes.spacing.s11,
                    borderColor: Colors.border,
                    borderWidth: 1,
                    borderRadius: Shapes.rounded.full
                  }}
                  onPress={() => router.back()}
                >
                  <ArrowLeftIcon />
                </Pressable>
              </View>
              <Typo size={19} fontWeight='semiBold' color={Colors.textPrimary}>
                Details
              </Typo>
              <View>
                <Pressable
                  style={{
                    padding: Sizes.spacing.s11,
                    borderColor: Colors.border,
                    borderWidth: 1,
                    borderRadius: Shapes.rounded.full
                  }}
                  onPress={() => setShowOptions(!showOptions)}
                >
                  <HorizontalDotMenuIcon />
                </Pressable>
              </View>
            </View>
          )
        }}
      />

      <Modal
        visible={showOptions}
        transparent
        animationType='fade'
        backdropColor='transparent'
        hardwareAccelerated
        statusBarTranslucent
        navigationBarTranslucent
        onDismiss={() => setShowOptions(false)}
        onRequestClose={() => setShowOptions(false)}
        style={styles.modal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setShowOptions(false)}
        >
          <View style={styles.modalContent}>
            <Pressable
              style={styles.optionButton}
              onPress={() => {
                setShowOptions(false)
                console.log('Editar proyecto')
              }}
            >
              <Typo size={16} color={Colors.textPrimary}>
                Editar proyecto
              </Typo>
            </Pressable>
            <Pressable
              style={styles.optionButton}
              onPress={() => {
                setShowOptions(false)
                handleDelete()
              }}
            >
              <Typo size={16} color='red'>
                Eliminar proyecto
              </Typo>
            </Pressable>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.header}>
        <View>
          <Typo
            size={27}
          >
            {firstWord}
          </Typo>
          {rest && rest.length > 0 && (
            <Typo
              size={27}
              color={Colors.textSecondary}
            >
              {rest.join(' ')}
            </Typo>
          )}
        </View>
      </View>

      <Typo size={18} fontWeight='medium' color={Colors.textPrimary} style={styles.sectionTitle}>
        Tasks {tasks?.length ?? 0}
      </Typo>
      {tasks && tasks.length > 0 ? (
        <FlatList
          data={tasks}
          keyExtractor={(t: Task) => t.task_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Typo size={16} color={item.status === 'completed' ? 'green' : Colors.textPrimary}>
                • {item.title}
              </Typo>
            </View>
          )}
        />
      ) : (
        <Typo size={16} color={Colors.textSecondary}>
          No tasks assigned.
        </Typo>
      )}

    </>
  )
}

const styles = StyleSheet.create({
  header: {
    marginTop: Sizes.spacing.s15,
    marginBottom: Sizes.spacing.s5
  },
  sectionTitle: {
    marginTop: Sizes.spacing.s21,
    marginBottom: Sizes.spacing.s3
  },
  taskItem: {
    paddingVertical: Sizes.spacing.s3
  },
  modal: {
    position: 'absolute',
    top: 0,
    flex: 1
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: Colors.background,
    padding: Sizes.spacing.s21,
    borderTopLeftRadius: Shapes.rounded.medium,
    borderTopRightRadius: Shapes.rounded.medium,
    gap: Sizes.spacing.s11
  },
  optionButton: {
    paddingVertical: Sizes.spacing.s11,
    paddingHorizontal: Sizes.spacing.s21,
    backgroundColor: Colors.card,
    borderRadius: Shapes.rounded.medium
  }
})
