import ScreenWrapper from '@/components/ScreenWrapper'
import { Sizes } from '@/constants/theme'
import Typo from '@/components/shared/Typo'
import ProjectsSlider from '@/components/home/ProjectsSlider'
import ProgressInfo from '@/components/home/ProgressInfo'
import { useAuth } from '@/hooks/auth/useAuth'
import { useState } from 'react'
import { View } from 'react-native'
import Header from '@/components/home/Header'
import AddProjectModal from '@/components/home/AddProjectModal'

export default function Index() {
  const { user } = useAuth()
  const [showAddProjectModal, setShowAddProjectModal] = useState(false)

  return (
    <ScreenWrapper isScrollable>
      <Header userName={user?.firstName || ''} />
      <ProjectsSlider setShowAddProjectModal={setShowAddProjectModal} userId={user?.id || ''}/>
      <ProgressInfo />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: Sizes.spacing.s21
        }}
      >
        <Typo size={18} weight='500'>Calendar feature soon!</Typo>
      </View>

      <AddProjectModal
        visible={showAddProjectModal}
        onClose={() => setShowAddProjectModal(false)}
      />
    </ScreenWrapper>
  )
}
