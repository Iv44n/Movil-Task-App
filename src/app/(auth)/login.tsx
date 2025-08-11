import LoginFields from '@/components/auth/LoginFields'
import AuthLayout from '@/components/auth/AuthLayout'
import i18n from '@/i18n'

export default function Login() {
  return (
    <AuthLayout
      title={i18n.t('auth.login.title')}
      subtitle={i18n.t('auth.login.subtitle')}
    >
      <LoginFields />
    </AuthLayout>
  )
}
