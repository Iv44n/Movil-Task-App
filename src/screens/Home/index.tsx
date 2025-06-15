import { View } from 'react-native'
import HomeHeader from './components/Header'
import ProgressInfo from './components/ProgressInfo'
import ProjectsSlider from './components/ProjectsSlider'
import ToDoItem from './components/ToDoItem'
import { Sizes } from '@/constants/theme'
import Typo from '@/components/Typo'

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

export default function HomeScreen() {
  return (
    <>
      <HomeHeader />
      <ProjectsSlider />
      <ProgressInfo />
      <View
        style={{
          marginTop: Sizes.spacing.s21,
          marginBottom: todos.length <= 2 ? 0 : Sizes.spacing.s71
        }}
      >
        <Typo size={18} fontWeight='medium'>To Do List</Typo>
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
    </>
  )
}
