import ScreenWrapper from '@/components/ScreenWrapper'
import RegisterFields from '@/modules/auth/components/RegisterFields'
import SocialAuth from '@/modules/auth/components/SocialAuth'
import { Colors, Sizes } from '@/constants/theme'
import { View } from 'react-native'
import Typo from '@/components/Typo'

export default function register(){
  return(
    <ScreenWrapper style={{ justifyContent: 'center', paddingHorizontal: Sizes.spacing.s15 }}>
      <View style={{ marginBottom: Sizes.spacing.s33 }}>
        <Typo size={25} fontWeight='bold' color={Colors.yellow}>Create an account</Typo>

        <Typo size={15} color={Colors.textSecondary}>
          Start building your own projects. Sign up to continue.
        </Typo>
      </View>
      <RegisterFields />
      <SocialAuth/>
    </ScreenWrapper>
  )
}
