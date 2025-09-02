import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native'
import Avatar from '@/components/shared/Avatar'
import Typo from '@/components/shared/Typo'
import ScreenWrapper from '@/components/ScreenWrapper'
import Icon from '@/components/icons/Icon'
import { CapitalizeWords } from '@/utils/utils'
import { Colors, Sizes, Shapes } from '@/constants/theme'
import { useRouter } from 'expo-router'
import ActionButton from '@/components/shared/ActionButton'
import useUser from '@/hooks/auth/useUser'

export default function Account() {
  const { connectedAccounts, user, deleteAccount } = useUser()
  const router = useRouter()

  if (!user) return null

  const handleDelete = async () => {
    if (!user) {
      return Alert.alert('Error', 'You must be logged in to delete your account.')
    }

    try {
      await deleteAccount()
    } catch (error) {
      console.error('Error deleting account:', error)
    }
  }

  const confirmDelete = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: handleDelete, style: 'destructive' }
      ],
      { cancelable: false }
    )
  }

  return (
    <ScreenWrapper isScrollable>
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={router.back} style={styles.backButton} activeOpacity={0.7}>
            <Icon.ArrowLeft color={Colors.primary} size={23} />
          </TouchableOpacity>
          <View style={{ alignItems: 'flex-end' }}>
            <Typo weight='700' size={21} style={styles.headerTexts}>Account</Typo>
            <Typo size={15} color='secondary' style={styles.headerTexts}>Manage your account</Typo>
          </View>
        </View>

        <View style={styles.avatarRow}>
          <Avatar uri={user.profileImageUrl ?? undefined} size={56} />
          <View style={styles.nameBlock}>
            <Typo weight='700' size={20} style={styles.name} numberOfLines={1}>
              {user.firstName} {user.lastName}
            </Typo>
            <Typo size={14} color='secondary' style={styles.email} numberOfLines={1}>
              {user.email}
            </Typo>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <ActionButton
            style={styles.actionButton}
            onPress={() => router.push('/profile/edit')}
          >
            <Typo size={14} color='primary'>Edit profile</Typo>
            <Icon.PenNewSquare size={17} color={Colors.primary} />
          </ActionButton>
          <ActionButton
            style={styles.actionButton}
            onPress={confirmDelete}
          >
            <Typo size={14} color='error'>Delete account</Typo>
            <Icon.Trash size={17} color={Colors.error} />
          </ActionButton>
        </View>

        {connectedAccounts.length > 0 && (
          <View style={styles.section}>
            <Typo weight='600' size={16} style={styles.sectionTitle}>Connected accounts</Typo>
            <View style={styles.providersRow}>
              {connectedAccounts.map((acc) => (
                <ProviderChip key={acc.id} provider={acc.provider} email={acc.emailAddress} />
              ))}
            </View>
          </View>
        )}
      </View>
    </ScreenWrapper>
  )
}

function ProviderChip({ provider, email }: { provider: string; email?: string }) {
  const showGoogle = provider?.toLowerCase() === 'google'
  return (
    <View style={styles.chip} accessibilityRole='button'>
      {showGoogle ? <Icon.Google size={29} /> : <Icon.Google size={18} />}
      <View style={styles.chipTextBlock}>
        <Typo size={14} weight='600'>{CapitalizeWords(provider)}</Typo>
        {email && <Typo size={12} color='secondary'>{email}</Typo>}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Sizes.spacing.s15,
    marginBottom: Sizes.spacing.s21
  },
  headerTexts: {
    flex: 1
  },
  backButton: {
    borderRadius: Shapes.rounded.circle,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Sizes.spacing.s11
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.spacing.s15
  },
  nameBlock: {
    flex: 1
  },
  name: {
    marginBottom: Sizes.spacing.s3
  },
  email: {
    opacity: 0.9
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: Sizes.spacing.s17,
    gap: Sizes.spacing.s9
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    paddingVertical: Sizes.spacing.s9,
    gap: Sizes.spacing.s5
  },
  actionText: {
    marginLeft: Sizes.spacing.s7
  },
  section: {
    marginTop: Sizes.spacing.s21
  },
  sectionTitle: {
    marginBottom: Sizes.spacing.s11
  },
  providersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizes.spacing.s9
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingVertical: Sizes.spacing.s7,
    paddingHorizontal: Sizes.spacing.s9,
    borderRadius: Shapes.rounded.sm,
    marginRight: Sizes.spacing.s7
  },
  chipTextBlock: {
    marginLeft: Sizes.spacing.s7
  }
})
