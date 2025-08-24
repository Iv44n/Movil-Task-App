import { useLocalSearchParams } from 'expo-router'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/shared/Typo'

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams() as { id?: string }

  if (!id) throw new Error('Task ID is required')

  return (
    <ScreenWrapper>
      <Typo size={20} weight='600' color='primary'>
        Edit Task
      </Typo>
    </ScreenWrapper>
  )
}
