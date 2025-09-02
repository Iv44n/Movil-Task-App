import Typo from '../shared/Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import useUser from '@/hooks/auth/useUser'
import i18n from '@/i18n'
import { useCallback, useEffect, useState } from 'react'
import { useDatabase } from '@nozbe/watermelondb/react'
import { TABLE_NAMES } from '@/lib/schema'
import { Q } from '@nozbe/watermelondb'
import { Project } from '@/models'
import { useRouter } from 'expo-router'

export default function Header({ userName }: { userName: string }) {
  const { user } = useUser()
  const database = useDatabase()
  const router = useRouter()
  const [totalProjects, setTotalProjects] = useState(0)

  useEffect(() => {
    if (!user) return

    const sb = database.collections
      .get<Project>(TABLE_NAMES.PROJECTS)
      .query(Q.where('user_id', user.id))
      .observeCount()
      .subscribe(setTotalProjects)

    return () => sb.unsubscribe()
  }, [database, user])

  const getInitials = useCallback((firstName?: string, lastName?: string) => {
    if (!firstName) return '?'
    if (lastName) return `${firstName[0]}${lastName[0]}`
    return firstName[0]
  }, [])

  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: Sizes.spacing.s21,
      marginTop: Sizes.spacing.s9
    }}
    >
      <View style={{ flex: 1 }}>
        <Typo
          size={15}
          color='secondary'
          style={{
            marginBottom: Sizes.spacing.s7
          }}
        >
          {i18n.t('home.headerTexts.greeting', { name: userName })}
        </Typo>
        <Typo size={27}>{i18n.t('home.headerTexts.youHave')}</Typo>
        <Typo
          size={29}
          weight='600'
          style={{ textDecorationLine: 'underline' }}
        >
          {
            totalProjects === 1
              ? i18n.t('home.headerTexts.projects.one', { count: totalProjects })
              : i18n.t('home.headerTexts.projects.other', { count: totalProjects })
          }
        </Typo>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.push('/profile')}
        style={styles.avatarContainer}
      >
        {user?.profileImageUrl ? (
          <Image
            source={{ uri: user.profileImageUrl }}
            style={styles.avatarImage}
          />
        ) : (
          <View style={styles.avatarInner}>
            <Typo color='secondary' weight='700'>
              {getInitials(user?.firstName, user?.lastName)}
            </Typo>
          </View>
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  avatarContainer: {
    position: 'relative',
    marginRight: 1
  },
  avatarInner: {
    width: Sizes.width.w43,
    height: Sizes.height.h43,
    borderRadius: Shapes.rounded.circle,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.secondary
  },
  avatarImage: {
    width: Sizes.width.w41,
    height: Sizes.height.h41 + 1,
    borderRadius: Shapes.rounded.circle
  }
})
