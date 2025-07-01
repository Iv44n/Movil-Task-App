import ScreenWrapper from '@/components/ScreenWrapper'
import LoginFields from '@/modules/auth/components/LoginFields'
import SocialAuth from '@/modules/auth/components/SocialAuth'
import { View } from 'react-native'
import Typo from '@/components/Typo'
import { Colors, Sizes } from '@/constants/theme'

export default function Login() {
  return(
    <ScreenWrapper style={{ justifyContent: 'center', paddingHorizontal: Sizes.spacing.s15 }}>
      <View style={{ marginBottom: Sizes.spacing.s33 }}>
        <Typo size={25} fontWeight='bold' color={Colors.yellow}>Welcome back</Typo>

        <Typo size={15} color={Colors.textSecondary}>
          Today is a new day. It&apos;s your day. You shape it. Sign in to start managing your projects.
        </Typo>
      </View>
      <LoginFields/>
      <SocialAuth/>
    </ScreenWrapper>
  )
}
