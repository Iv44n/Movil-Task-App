import ScreenWrapper from '@/components/ScreenWrapper'
import LoginFields from '@/components/auth/LoginFields'
import SocialAuth from '@/components/auth/SocialAuth'
import { View } from 'react-native'
import Typo from '@/components/shared/Typo'
import { Sizes } from '@/constants/theme'
import i18n from '@/i18n'

export default function Login() {
  return(
    <ScreenWrapper style={{ justifyContent: 'center', paddingHorizontal: Sizes.spacing.s15 }}>
      <View style={{ marginBottom: Sizes.spacing.s33 }}>
        <Typo size={25} weight='700' color='yellow'>{i18n.t('auth.login.title')}</Typo>

        <Typo size={15} color='secondary'>
          {i18n.t('auth.login.subtitle')}
        </Typo>
      </View>
      <LoginFields/>
      <SocialAuth/>
    </ScreenWrapper>
  )
}
