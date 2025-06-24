import ScreenWrapper from '@/components/ScreenWrapper'
import ProjectDetails from '@/screens/Project/details'
import { useLocalSearchParams } from 'expo-router'

export default function Details() {
  const { id: projectIdParam } = useLocalSearchParams()

  return (
    <ScreenWrapper>
      <ProjectDetails id={projectIdParam.toString()} />
    </ScreenWrapper>
  )
}
