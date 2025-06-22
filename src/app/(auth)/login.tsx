import ScreenWrapper from '@/components/ScreenWrapper'
import UserLogin from '@/screens/Auth/login'

export default function login() {
  return(
    <ScreenWrapper style={{ justifyContent: 'center' }}>
      <UserLogin />
    </ScreenWrapper>
  )
}
