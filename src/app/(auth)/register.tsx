import ScreenWrapper from '@/components/ScreenWrapper'
import UserRegister from '@/screens/Auth/register'

export default function register(){
  return(
    <ScreenWrapper style={{ justifyContent: 'center' }}>
      <UserRegister />
    </ScreenWrapper>
  )
}
