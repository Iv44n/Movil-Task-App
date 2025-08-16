import { StyleSheet, View } from 'react-native'
import Icon from '@/components/icons/Icon'
import Svg, { Circle } from 'react-native-svg'
import Typo from '@/components/shared/Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import useProgress from '@/hooks/data/useProgress'
import i18n from '@/i18n'
import { useAuth } from '@/hooks/auth/useAuth'
import PriorityTasksSection from './PriorityTasksSection'

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
          <Icon.Progress color={Colors.primary} />
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
              <>{count} <Typo size={11} weight='500'>{count === 1 ? i18n.t('home.progressInfo.task') : i18n.t('home.progressInfo.tasks')}</Typo></>
            ) : (
              <>{count}/{total} <Typo size={11} weight='500'>{total === 1 ? i18n.t('home.progressInfo.task') : i18n.t('home.progressInfo.tasks')}</Typo></>
            )
          }
        </Typo>
      </View>
    </View>
  )
}

export default function ProgressInfo() {
  const { user } = useAuth()
  const { completed, completedToday } = useProgress({ userId: user?.id ?? '' })

  return (
    <View style={styles.container}>
      <Typo size={19} weight='500'>{i18n.t('home.progressInfo.title')}</Typo>
      <View style={styles.content}>
        {/* Priority tasks */}
        <PriorityTasksSection />

        {/* Progress indicators */}
        <View style={styles.indicatorContainer}>
          <ProgressSummary
            label={i18n.t('home.progressInfo.completed')}
            percent={completed.percent}
            count={completed.count}
            total={completed.total}
          />

          <ProgressSummary
            label={i18n.t('home.progressInfo.doneToday')}
            useIcon
            count={completedToday}
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
  indicatorContainer: {
    width: '49%',
    marginRight: 1,
    gap: Sizes.spacing.s9,
    justifyContent: 'space-between'
  },
  progressSummary: {
    flexDirection: 'row',
    paddingHorizontal: '8%',
    paddingVertical: '9%',
    backgroundColor: Colors.card,
    borderRadius: Shapes.rounded.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: Sizes.spacing.s9
  },
  circleProgressPlaceholder: {
    width: 53,
    height: 53,
    borderRadius: Shapes.rounded.circle,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center'
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
