import RegisterFields from '@/components/auth/RegisterFields'
import AuthLayout from '@/components/auth/AuthLayout'
import i18n from '@/i18n'

export default function Register() {
  return (
    <AuthLayout
      title={i18n.t('auth.register.title')}
      subtitle={i18n.t('auth.register.subtitle')}
    >
      <RegisterFields />
    </AuthLayout>
  )
}
