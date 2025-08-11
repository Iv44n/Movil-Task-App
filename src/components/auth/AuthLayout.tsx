import ScreenWrapper from '@/components/ScreenWrapper'
import SocialAuth from '@/components/auth/SocialAuth'
import { View } from 'react-native'
import Typo from '@/components/shared/Typo'
import { Sizes } from '@/constants/theme'
import React from 'react'

type AuthLayoutProps = {
  title: string
  subtitle: string
  children: React.ReactNode
}

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <ScreenWrapper style={{ justifyContent: 'center', paddingHorizontal: Sizes.spacing.s15 }}>
      <View style={{ marginBottom: Sizes.spacing.s33 }}>
        <Typo size={25} weight='700' color='yellow'>{title}</Typo>
        <Typo size={15} color='secondary'>
          {subtitle}
        </Typo>
      </View>
      {children}
      <SocialAuth />
    </ScreenWrapper>
  )
}
