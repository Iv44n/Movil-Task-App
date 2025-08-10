import ScreenWrapper from '@/components/ScreenWrapper'
import RegisterFields from '@/components/auth/RegisterFields'
import SocialAuth from '@/components/auth/SocialAuth'
import { Sizes } from '@/constants/theme'
import { View } from 'react-native'
import Typo from '@/components/shared/Typo'
import i18n from '@/i18n'

export default function register(){
  return(
    <ScreenWrapper style={{ justifyContent: 'center', paddingHorizontal: Sizes.spacing.s15 }}>
      <View style={{ marginBottom: Sizes.spacing.s33 }}>
        <Typo size={25} weight='700' color='yellow'>{i18n.t('auth.register.title')}</Typo>

        <Typo size={15} color='secondary'>
          {i18n.t('auth.register.subtitle')}
        </Typo>
      </View>
      <RegisterFields />
      <SocialAuth/>
    </ScreenWrapper>
  )
}
