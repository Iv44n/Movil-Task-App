import Typo from '../shared/Typo'
import { Sizes } from '@/constants/theme'
import { View } from 'react-native'
import { projectsStore$ } from '@/store/projects.store'
import { use$ } from '@legendapp/state/react'
import { useAuth } from '@/hooks/auth/useAuth'

export default function Header({ userName }: { userName: string }) {
  const { user } = useAuth()
  const totalProjects = use$(() => Object.values(projectsStore$(user?.id || '').projects).length)

  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: Sizes.spacing.s21,
      marginTop: Sizes.spacing.s9
    }}
    >
      <View>
        <Typo
          size={15}
          color='secondary'
          style={{
            marginBottom: Sizes.spacing.s7
          }}
        >
          Hi, {userName}!
        </Typo>
        <Typo size={27}>You Have</Typo>
        <Typo
          size={29}
          weight='600'
          style={{ textDecorationLine: 'underline' }}
        >
          {totalProjects} Projects
        </Typo>
      </View>
      {/*       <View style={styles.iconContainer}>
        <Ionicons
          name='mail-outline'
          size={24}
          color={Colors.primary}
        />
      </View> */}
    </View>
  )
}
