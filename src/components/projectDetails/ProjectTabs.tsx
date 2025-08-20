import { TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { memo } from 'react'
import Typo from '@/components/shared/Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import { StatusTask } from '@/constants/constants'
import i18n from '@/i18n'

export type Status = StatusTask | 'all'

interface ProjectTabsProps {
  tab: Status
  onChange: (status: Status) => void
  color: string
}

const TABS: readonly { key: Status }[] = [
  { key: 'all' },
  { key: StatusTask.PENDING },
  { key: StatusTask.IN_PROGRESS },
  { key: StatusTask.COMPLETED }
] as const

const ProjectTabs = memo<ProjectTabsProps>(({
  tab,
  onChange,
  color
}) => {
  const renderTab = ({ key }: { key: Status }) => {
    const isActive = tab === key

    return (
      <TouchableOpacity
        key={key}
        activeOpacity={0.7}
        onPress={() => onChange(key)}
        style={[
          styles.tabItem,
          isActive ?
            { backgroundColor: color } :
            styles.inactiveTab
        ]}
      >
        <Typo
          size={14}
          weight='600'
          color={isActive ? 'black' : 'secondary'}
          style={{ textAlign: 'center' }}
        >
          {i18n.t(`projectDetails.status.plural.${key}`)}
        </Typo>
      </TouchableOpacity>
    )
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.tabBar}
    >
      {TABS.map(renderTab)}
    </ScrollView>
  )
})

ProjectTabs.displayName = 'ProjectTabs'

export default ProjectTabs

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    maxHeight: Sizes.height.h57 + Sizes.spacing.s15,
    paddingBottom: Sizes.spacing.s11,
    paddingHorizontal: Sizes.spacing.s3
  },
  tabBar: {
    flexDirection: 'row',
    marginTop: Sizes.spacing.s21,
    gap: Sizes.spacing.s11
  },
  tabItem: {
    paddingHorizontal: Sizes.spacing.s21,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Shapes.rounded.lg,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  inactiveTab: {
    backgroundColor: Colors.card,
    borderColor: Colors.border
  }
})
