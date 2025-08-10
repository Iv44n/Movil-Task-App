import React, { useCallback, useMemo } from 'react'
import { Image, StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native'
import Icon from '@/components/icons/Icon'
import ScreenWrapper from '@/components/ScreenWrapper'
import ActionButton from '@/components/shared/ActionButton'
import Typo from '@/components/shared/Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/auth/useAuth'
import { useRouter } from 'expo-router'
import i18n from '@/i18n'

type MenuItemProps = {
  id: string
  label: string
  subtitle: string
  onPress: () => void
  icon: React.ReactNode
  rightNode?: React.ReactNode
  isLast?: boolean
}

const MenuItem = ({
  label,
  subtitle,
  onPress,
  icon,
  rightNode,
  isLast
}: Omit<MenuItemProps, 'id'>) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.menuItem, isLast && styles.menuItemNoBorder]}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <View style={styles.menuTextContainer}>
          <Typo color='primary' size={15}>{label}</Typo>
          <Typo size={12.5} color='secondary'>{subtitle}</Typo>
        </View>
      </View>
      <View style={styles.menuItemRight}>
        {rightNode}
        <Icon.AltArrowRight size={17} color={Colors.secondary} />
      </View>
    </TouchableOpacity>
  )
}

export default function Profile() {
  const { user } = useAuth()
  const metadata = user?.user_metadata || {}
  const router = useRouter()

  const handleSignOut = useCallback(async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error(error)
    }
  }, [])

  const displayName = useMemo(() => {
    const first = metadata.firstName || ''
    const last = metadata.lastName || ''
    const full = `${first} ${last}`.trim()
    return full || 'User'
  }, [metadata.firstName, metadata.lastName])

  const displayEmail = metadata.email || 'user@example.com'

  const menuItems: MenuItemProps[] = [
    {
      id: 'account',
      label: i18n.t('profile.menu.account.title'),
      subtitle: i18n.t('profile.menu.account.subtitle'),
      onPress: () => console.log('Account'),
      icon: <Icon.User size={23} color={Colors.secondary} />
    },
    {
      id: 'notifications',
      label: i18n.t('profile.menu.notifications.title'),
      subtitle: i18n.t('profile.menu.notifications.subtitle'),
      onPress: () => console.log('Notifications'),
      icon: <Icon.Bell size={23} color={Colors.secondary} />
    },
    {
      id: 'security',
      label: i18n.t('profile.menu.security.title'),
      subtitle: i18n.t('profile.menu.security.subtitle'),
      onPress: () => console.log('Security'),
      icon: <Icon.Shield size={23} color={Colors.secondary} />
    },
    {
      id: 'language',
      label: i18n.t('profile.menu.language.title'),
      subtitle: i18n.t('profile.menu.language.subtitle'),
      onPress: () => router.push('/profile/language'),
      icon: <Icon.Global size={23} color={Colors.secondary} />,
      rightNode: <Typo size={12.5} color='secondary' weight='500'>{(i18n.locale || '').toUpperCase()}</Typo>
    },
    {
      id: 'privacy',
      label: i18n.t('profile.menu.privacyPolicy.title'),
      subtitle: i18n.t('profile.menu.privacyPolicy.subtitle'),
      onPress: () => console.log('Privacy Policy'),
      icon: <Icon.DangerCircle size={23} color={Colors.secondary} />,
      isLast: true
    }
  ]

  const userInfo = useMemo(() => (
    <View style={styles.userContainer}>
      {metadata.avatar_url ? (
        <Image source={{ uri: metadata.avatar_url }} style={styles.avatarImage} />
      ) : (
        <View style={styles.avatarDefault}>
          <Icon.User color={Colors.primary} />
        </View>
      )}

      <View>
        <Typo weight='700' size={15} color='primary'>{displayName}</Typo>
        <Typo size={13} color='secondary' ellipsizeMode='tail' numberOfLines={1}>
          {displayEmail}
        </Typo>
      </View>
    </View>
  ), [metadata.avatar_url, displayName, displayEmail])

  return (
    <ScreenWrapper style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Typo size={23} weight='700' color='primary'>
              {i18n.t('profile.header')}
            </Typo>
            <Typo size={15} color='secondary' style={styles.headerSubtitle}>
              {i18n.t('profile.headerSubtitle')}
            </Typo>
          </View>

          {userInfo}

          <View style={{ overflow: 'hidden' }}>
            {menuItems.map((item) => (
              <MenuItem
                key={item.id}
                label={item.label}
                subtitle={item.subtitle}
                onPress={item.onPress}
                icon={item.icon}
                rightNode={item.rightNode}
                isLast={item.isLast}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomSection}>
        <ActionButton
          style={styles.signOutButton}
          typoProps={{ color: 'error' }}
          onPress={handleSignOut}
        >
          {i18n.t('profile.actions.signOut')}
        </ActionButton>
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  scrollView: {
    flex: 1
  },
  content: {
    paddingBottom: Sizes.spacing.s21
  },
  header: {
    alignItems: 'center',
    marginBottom: Sizes.spacing.s21,
    paddingTop: Sizes.spacing.s9
  },
  headerSubtitle: {
    marginTop: Sizes.spacing.s5
  },
  userContainer: {
    marginBottom: Sizes.spacing.s17,
    backgroundColor: Colors.card,
    borderRadius: Shapes.rounded.lg,
    borderColor: Colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: Sizes.spacing.s9,
    paddingHorizontal: Sizes.spacing.s11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.spacing.s9
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: Shapes.rounded.circle
  },
  avatarDefault: {
    width: 50,
    height: 50,
    borderRadius: Shapes.rounded.circle,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center'
  },
  menuItem: {
    padding: Sizes.spacing.s13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border
  },
  menuItemNoBorder: {
    borderBottomWidth: 0
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Sizes.spacing.s11
  },
  menuTextContainer: {
    flex: 1,
    gap: Sizes.spacing.s3
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.spacing.s9
  },
  bottomSection: {
    paddingTop: Sizes.spacing.s11
  },
  signOutButton: {
    backgroundColor: Colors.error + '10',
    marginBottom: Sizes.spacing.s91
  }
})
