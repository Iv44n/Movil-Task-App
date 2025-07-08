import ScreenWrapper from '@/components/ScreenWrapper'
import LoginFields from '@/components/auth/LoginFields'
import SocialAuth from '@/components/auth/SocialAuth'
import { View } from 'react-native'
import Typo from '@/components/shared/Typo'
import { Sizes } from '@/constants/theme'

export default function Login() {
  return(
    <ScreenWrapper style={{ justifyContent: 'center', paddingHorizontal: Sizes.spacing.s15 }}>
      <View style={{ marginBottom: Sizes.spacing.s33 }}>
        <Typo size={25} weight='700' color='yellow'>Welcome back</Typo>

        <Typo size={15} color='secondary'>
          Today is a new day. It&apos;s your day. You shape it. Sign in to start managing your projects.
        </Typo>
      </View>
      <LoginFields/>
      <SocialAuth/>
    </ScreenWrapper>
  )
}
