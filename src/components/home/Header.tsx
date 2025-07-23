import Typo from '../shared/Typo'
import { Sizes } from '@/constants/theme'
import { View } from 'react-native'
import { projects$ } from '@/store/projects.store'
import { use$ } from '@legendapp/state/react'

export default function Header({ userName }: { userName: string }) {
  const totalProjects = use$(() => Object.keys(projects$.get(true) || {}).length)

  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: Sizes.spacing.s21
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
