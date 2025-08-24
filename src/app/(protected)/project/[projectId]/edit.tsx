import { useLocalSearchParams } from 'expo-router'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/shared/Typo'

export default function ProjectEditScreen() {
  const { projectId } = useLocalSearchParams() as { projectId?: string }

  if (!projectId) throw new Error('Project ID is required')

  return (
    <ScreenWrapper>
      <Typo size={20} weight='600' color='primary'>
        {projectId}
      </Typo>
    </ScreenWrapper>
  )
}
