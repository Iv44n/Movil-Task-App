import ScreenWrapper from '@/components/ScreenWrapper'
import RegisterFields from '@/components/auth/RegisterFields'
import SocialAuth from '@/components/auth/SocialAuth'
import { Sizes } from '@/constants/theme'
import { View } from 'react-native'
import Typo from '@/components/shared/Typo'

export default function register(){
  return(
    <ScreenWrapper style={{ justifyContent: 'center', paddingHorizontal: Sizes.spacing.s15 }}>
      <View style={{ marginBottom: Sizes.spacing.s33 }}>
        <Typo size={25} weight='700' color='yellow'>Create an account</Typo>

        <Typo size={15} color='secondary'>
          Start building your own projects. Sign up to continue.
        </Typo>
      </View>
      <RegisterFields />
      <SocialAuth/>
    </ScreenWrapper>
  )
}
