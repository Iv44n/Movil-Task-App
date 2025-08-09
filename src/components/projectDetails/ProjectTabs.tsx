import { TouchableOpacity, View, StyleSheet } from 'react-native'
import Typo from '@/components/shared/Typo'
import { Sizes } from '@/constants/theme'
import { StatusTask } from '@/constants/constants'

export type Status = StatusTask | 'all'

type TabItem = {
  readonly key: Status
  readonly label: string
}

const tabs: TabItem[] = [
  { key: 'all', label: 'All' },
  { key: StatusTask.PENDING, label: 'Pending' },
  { key: StatusTask.COMPLETED, label: 'Completed' }
]

export default function ProjectTabs({ tab, onChange, color }: {
  tab: Status
  onChange: (t: Status) => void
  color: string
}) {
  return (
    <View style={styles.tabBar}>
      {tabs.map(t => (
        <TouchableOpacity
          key={t.key}
          activeOpacity={0.7}
          onPress={() => onChange(t.key)}
          style={[
            styles.tabItem,
            tab === t.key && styles.tabItemActive,
            { borderBottomColor: color }
          ]}
        >
          <Typo
            size={15}
            weight={tab === t.key ? '600' : '400'}
            color={tab === t.key ? 'primary' : 'secondary'}
          >
            {t.label}
          </Typo>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    marginTop: Sizes.spacing.s21,
    justifyContent: 'space-between'
  },
  tabItem: {
    flex: 1,
    paddingVertical: Sizes.spacing.s7,
    alignItems: 'center'
  },
  tabItemActive: {
    borderBottomWidth: 2
  }
})
