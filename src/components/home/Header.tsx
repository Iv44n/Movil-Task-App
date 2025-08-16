import Typo from '../shared/Typo'
import { Sizes } from '@/constants/theme'
import { View } from 'react-native'
import { useAuth } from '@/hooks/auth/useAuth'
import i18n from '@/i18n'
import { useEffect, useState } from 'react'
import { useDatabase } from '@nozbe/watermelondb/react'
import { TABLE_NAMES } from '@/lib/schema'
import { Q } from '@nozbe/watermelondb'
import { Project } from '@/models'

export default function Header({ userName }: { userName: string }) {
  const { user } = useAuth()
  const database = useDatabase()
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

  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: Sizes.spacing.s21,
      marginTop: Sizes.spacing.s9
    }}
    >
      <View>
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
      {/*       <View style={styles.iconContainer}>
        <Ionicons
          name='mail-outline'
          size={24}
          color={Colors.primary}
        />
      </View> */}
    </View>
  )
}
