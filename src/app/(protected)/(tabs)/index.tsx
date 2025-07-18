import ScreenWrapper from '@/components/ScreenWrapper'
import { Colors, Sizes } from '@/constants/theme'
import Typo from '@/components/shared/Typo'
import ProjectsSlider from '@/components/home/ProjectsSlider'
import ProgressInfo from '@/components/home/ProgressInfo'
import { useAuth } from '@/hooks/auth/useAuth'
import { observer } from '@legendapp/state/react'
import { useState } from 'react'
import { Pressable, View } from 'react-native'
import Header from '@/components/home/Header'
import { AddProjectModal } from '@/components/home/AddProjectModal'
import Icon from '@/components/icons/Icon'

interface TodoItem {
  id: string
  title: string
  subtitle: string
  completed: boolean,
  repeat: string
}

export const todos: TodoItem[] = [
  {
    id: '1',
    title: 'Tomar un litro de agua',
    subtitle: 'Todos los días',
    completed: false,
    repeat: 'daily'
  },
  {
    id: '2',
    title: 'Revisar correo de trabajo',
    subtitle: 'Antes de las 10 a.m.',
    completed: true,
    repeat: 'daily'
  },
  {
    id: '3',
    title: 'Llamar a mamá',
    subtitle: 'Domingo por la tarde',
    completed: false,
    repeat: 'weekly'
  },
  {
    id: '4',
    title: 'Hacer ejercicio',
    subtitle: 'Lunes, miércoles y viernes',
    completed: false,
    repeat: 'weekly'
  },
  {
    id: '5',
    title: 'Pagar facturas',
    subtitle: 'Cada primer día del mes',
    completed: false,
    repeat: 'monthly'
  },
  {
    id: '6',
    title: 'Llevar el coche al taller',
    subtitle: 'Cada 3 meses',
    completed: false,
    repeat: 'quarterly'
  },
  {
    id: '7',
    title: 'Leer 30 minutos',
    subtitle: 'Todas las noches',
    completed: true,
    repeat: 'daily'
  },
  {
    id: '8',
    title: 'Limpiar el escritorio',
    subtitle: 'Viernes por la tarde',
    completed: false,
    repeat: 'weekly'
  },
  {
    id: '9',
    title: 'Respaldo de datos',
    subtitle: 'Cada domingo',
    completed: false,
    repeat: 'weekly'
  },
  {
    id: '10',
    title: 'Reunión de planificación',
    subtitle: 'Primer lunes de cada mes',
    completed: false,
    repeat: 'monthly'
  }
]

interface ToDoItemProps {
  title: string
  subtitle: string
  checked?: boolean
  onToggleChecked?: () => void
  onPressMenu?: () => void
}

const ToDoItem = observer(function ToDoItem({ title, subtitle, checked, onToggleChecked, onPressMenu }: ToDoItemProps) {
  const [isChecked, setIsChecked] = useState(checked || false)

  return (
    <View style={{
      flexDirection: 'row',
      gap: Sizes.spacing.s11,
      alignItems: 'center',
      paddingVertical: Sizes.spacing.s15
    }}
    >
      <Pressable onPress={() => setIsChecked(!isChecked)}>
        {isChecked ? (
          <Icon.CheckCircle size={29} color={Colors.secondary} />
        ) : (
          <Icon.Circle size={29} />
        )}
      </Pressable>

      <View style={{
        flex: 1,
        flexDirection: 'column',
        gap: Sizes.spacing.s3
      }}
      >
        <Typo
          color={isChecked ? 'secondary' : 'primary'}
          size={15}
          weight='600'
          ellipsizeMode='tail'
          numberOfLines={1}
          style={{
            textDecorationLine: isChecked ? 'line-through' : 'none'
          }}
        >
          {title}
        </Typo>
        <Typo size={13} color='secondary'>
          {subtitle}
        </Typo>
      </View>

      <Pressable onPress={onPressMenu}>
        <Icon.HorizontalDotMenu size={29} color={Colors.secondary} />
      </Pressable>
    </View>
  )
})

export default function Index() {
  const { user } = useAuth()
  const [showAddProjectModal, setShowAddProjectModal] = useState(false)

  return (
    <ScreenWrapper isScrollable>
      <Header userName={user?.user_metadata.firstName} />
      <ProjectsSlider setShowAddProjectModal={setShowAddProjectModal}/>
      <ProgressInfo />
      <View
        style={{
          marginTop: Sizes.spacing.s21,
          marginBottom: todos.length <= 2 ? 0 : Sizes.spacing.s71
        }}
      >
        <Typo size={18} weight='500'>To Do List</Typo>
        {
          todos.slice(0, 5).map(todo => (
            <ToDoItem
              key={todo.id}
              title={todo.title}
              subtitle={todo.subtitle}
              checked={todo.completed}
              onToggleChecked={() => {
                console.log(`Checked ${todo.id}`)
              }}
              onPressMenu={() => console.log(`Menu ${todo.id}`)}
            />
          ))
        }
      </View>

      <AddProjectModal
        visible={showAddProjectModal}
        onClose={() => setShowAddProjectModal(false)}
      />
    </ScreenWrapper>
  )
}
