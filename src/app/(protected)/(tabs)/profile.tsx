import { useCallback } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import Icon from '@/components/icons/Icon'
import ScreenWrapper from '@/components/ScreenWrapper'
import ActionButton from '@/components/shared/ActionButton'
import Typo from '@/components/shared/Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/auth/useAuth'

export default function Profile() {
  const { user } = useAuth()
  const metadata = user?.user_metadata || {}

  const handleSignOut = useCallback(async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error(error)
    }
  }, [])

  const renderMenuItem = (
    label: string,
    onPress: () => void,
    options: {
      icon: React.ReactNode,
      isLast?: boolean
    }
  ) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.menuItem, options.isLast && styles.menuItemLast]}
    >
      <View style={styles.menuItemLeft}>
        {options.icon}
        <Typo weight='500'>{label}</Typo>
      </View>
      <Icon.AltArrowRight size={19} />
    </TouchableOpacity>
  )

  const renderUserInfo = () => (
    <TouchableOpacity activeOpacity={0.7} style={styles.container}>
      <View style={styles.rowSpaceBetween}>
        <View style={styles.rowWithGap}>
          <View style={styles.avatarWrapper}>
            {metadata.avatar_url ? (
              <Image source={{ uri: metadata.avatar_url }} style={styles.avatarImage} />
            ) : (
              <Icon.User color={Colors.card} />
            )}
          </View>
          <View>
            <Typo weight='700' color='yellow'>
              {`${metadata.firstName || ''} ${metadata.lastName || ''}`}
            </Typo>
            <Typo size={13} color='secondary'>{metadata.email}</Typo>
          </View>
        </View>
        <Icon.AltArrowRight size={19} />
      </View>
    </TouchableOpacity>
  )

  return (
    <ScreenWrapper style={styles.screen}>
      <View>
        <View style={styles.header}>
          <Typo size={19} weight='600'>
            Profile
          </Typo>
        </View>
        {renderUserInfo()}
        <View style={styles.menuContainer}>
          {renderMenuItem(
            'Privacy Policy',
            () => console.log('Privacy Policy'),
            {
              icon: <Icon.DangerCircle color={Colors.secondary} />,
              isLast: true
            }
          )}
        </View>
      </View>

      <ActionButton
        label='Sign Out'
        style={styles.signOutButton}
        typoProps={{ color: 'yellow', size: 15 }}
        onPress={handleSignOut}
      />
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'space-between'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Sizes.spacing.s21
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingVertical: Sizes.spacing.s13,
    paddingHorizontal: Sizes.spacing.s11,
    borderRadius: Shapes.rounded.lg,
    borderColor: Colors.border,
    borderWidth: 1,
    marginBottom: Sizes.spacing.s9
  },
  avatarWrapper: {
    width: 45,
    height: 45,
    borderRadius: Shapes.rounded.circle,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  avatarImage: {
    width: 45,
    height: 45
  },
  rowWithGap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.spacing.s9
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1
  },
  menuContainer: {
    backgroundColor: Colors.card,
    borderRadius: Shapes.rounded.lg,
    borderColor: Colors.border,
    borderWidth: 1,
    marginBottom: Sizes.spacing.s9
  },
  menuItem: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: Sizes.spacing.s15,
    paddingVertical: Sizes.spacing.s11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  menuItemLast: {
    borderBottomWidth: 0
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.spacing.s9
  },
  signOutButton: {
    backgroundColor: Colors.card,
    borderColor: Colors.border,
    borderWidth: 1,
    paddingVertical: Sizes.spacing.s11,
    marginBottom: Sizes.spacing.s91
  }
})
