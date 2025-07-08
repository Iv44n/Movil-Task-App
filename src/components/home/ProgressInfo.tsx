import { useMemo, useState } from 'react'
import { StyleSheet, View, FlatList, ListRenderItem, Pressable } from 'react-native'
import ProgressIcon from '@/components/icons/ProgressIcon'
import CheckCircleIcon from '@/components/icons/CheckCircleIcon'
import CircleIcon from '@/components/icons/CircleIcon'
import Svg, { Circle } from 'react-native-svg'
import Typo from '@/components/shared/Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'

const PRIORITY_TASKS: string[] = [
  'Diseñar el dashboard de analiticas',
  'Daily Meeting',
  'Design Homepage',
  'Design About Page',
  'Design Logo',
  'Daily Meeting',
  'Design Homepage',
  'Design About Page'
]

const PriorityItem = ({ label }: { label: string }) => {
  const [checked, setChecked] = useState(false)

  return(
    <View style={styles.priorityItem}>
      <Pressable
        onPress={() => setChecked(!checked)}
        style={{
          flexDirection: 'row'
        }}
      >
        <View>
          {
            checked
              ? <CheckCircleIcon size={19} color={Colors.secondary} />
              : <CircleIcon size={19} color={Colors.primary}/>
          }
        </View>
        <Typo
          size={13}
          color={checked ? 'secondary' : 'primary'}
          style={{
            textDecorationLine: checked ? 'line-through' : 'none',
            maxWidth: '85%',
            marginLeft: Sizes.spacing.s7
          }}
          ellipsizeMode='tail'
          numberOfLines={1}
        >
          {label}
        </Typo>
      </Pressable>
    </View>
  )
}

interface ProgressSummaryProps {
  label: string
  percent?: number
  count: number
  total?: number
  useIcon?: boolean
}

const ProgressSummary = ({ label, percent = 0, count, total = 0, useIcon = false }: ProgressSummaryProps) => {
  const radius = 25
  const strokeWidth = 3
  const normalizedRadius = radius - strokeWidth / 2
  const circumference = 2 * Math.PI * normalizedRadius
  const strokeDashoffset = circumference - (percent / 100) * circumference

  return (
    <View style={styles.progressSummary}>
      <View style={styles.circleProgressPlaceholder}>
        {useIcon ? (
          <ProgressIcon color={Colors.primary} />
        ) : (
          <>
            <Svg height={radius * 2} width={radius * 2}>
              <Circle
                stroke={Colors.background}
                fill='transparent'
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <Circle
                stroke={Colors.green}
                fill='transparent'
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap='round'
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                transform='rotate(-90, 25, 25)'
              />
            </Svg>
            <View style={styles.circleTextWrapper}>
              <Typo size={11} weight='700'>{`${percent}%`}</Typo>
            </View>
          </>
        )}
      </View>
      <View>
        <Typo size={13} weight='500' color='secondary'>{label}</Typo>
        <Typo size={15} weight='800'>
          {
            useIcon ? (
              <>{count} <Typo size={11} weight='500'>Task</Typo></>
            ) : (
              <>{count}/{total} <Typo size={11} weight='500'>Tasks</Typo></>
            )
          }
        </Typo>
      </View>
    </View>
  )
}

export default function ProgressInfo () {
  const completed = useMemo(() => ({ percent: 10, count: 56, total: 64 }), [])
  const inProgress = useMemo(() => ({ count: 6 }), [])

  const renderPriority: ListRenderItem<string> = ({ item }) => (
    <PriorityItem label={item} />
  )

  return (
    <View style={styles.container}>
      <Typo size={19} weight='500'>Your Progress</Typo>
      <View style={styles.content}>
        {/* Priority tasks */}
        <View style={styles.card}>
          <Typo
            size={15}
            weight='600'
            style={{ marginBottom: Sizes.spacing.s9 }}
          >
            Priority Tasks
          </Typo>
          <FlatList
            data={PRIORITY_TASKS.slice(0, 4)}
            keyExtractor={(item) => item}
            renderItem={renderPriority}
            scrollEnabled={false}
          />
        </View>

        {/* Progress indicators */}
        <View style={styles.indicatorContainer}>
          <ProgressSummary
            label='Completed'
            percent={completed.percent}
            count={completed.count}
            total={completed.total}
          />

          <ProgressSummary
            label='In Progress'
            useIcon
            count={inProgress.count}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: Sizes.spacing.s21
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Sizes.spacing.s13
  },
  card: {
    width: '49%',
    backgroundColor: Colors.card,
    padding: Sizes.spacing.s13,
    borderRadius: Shapes.rounded.md,
    borderWidth: 1,
    borderColor: Colors.border
  },
  priorityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.spacing.s11,
    marginLeft: -1
  },
  indicatorContainer: {
    width: '49%',
    gap: Sizes.spacing.s9,
    justifyContent: 'space-between'
  },
  progressSummary: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    padding: '10%',
    borderRadius: Shapes.rounded.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center'
  },
  circleProgressPlaceholder: {
    width: 53,
    height: 53,
    borderRadius: Shapes.rounded.circle,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Sizes.spacing.s9
  },
  circleTextWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 53,
    height: 53,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
