import ForgotPasswordFields from '@/components/auth/ForgotPasswordFields'
import AuthLayout from '@/components/auth/AuthLayout'
import i18n from '@/i18n'

export default function ForgotPassword() {
  return (
    <AuthLayout
      title={i18n.t('auth.forgotPassword.title')}
      subtitle={i18n.t('auth.forgotPassword.subtitle')}
      showSocialAuth={false}
    >
      <ForgotPasswordFields />
    </AuthLayout>
  )
}
