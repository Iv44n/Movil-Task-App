import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  FlatList,
  ListRenderItemInfo,
  InteractionManager
} from 'react-native'
import Typo from '../shared/Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import Icon from '../icons/Icon'

interface Props {
  label: string
  value: Date | null
  onChange: (value: Date | null) => void
  placeholder?: string
  yearRange?: number
}

type DayItem = { day: number; label: string }
type MonthItem = { name: string; value: number }
type YearItem = { value: number }

const ITEM_HEIGHT = 40
const VISIBLE_PADDING = 4

type PickerColumnProps<T> = {
  data: T[]
  selectedValue: number
  onSelect: (val: number) => void
  listRef: React.RefObject<FlatList<T> | null>
  keyExtractor: (item: T, index: number) => string
  labelAccessor: (item: T) => string
  valueAccessor: (item: T) => number
}

function PickerColumnInner<T>({
  data,
  selectedValue,
  onSelect,
  listRef,
  keyExtractor,
  labelAccessor,
  valueAccessor
}: PickerColumnProps<T>) {
  const renderItem = useCallback(({ item }: ListRenderItemInfo<T>) => {
    const numericValue = valueAccessor(item)
    const isSelected = numericValue === selectedValue

    return (
      <Pressable onPress={() => onSelect(numericValue)} style={styles.itemWrapper}>
        <Typo
          size={14}
          weight={isSelected ? '600' : '400'}
          color={isSelected ? 'primary' : 'secondary'}
          style={styles.itemText}
        >
          {labelAccessor(item)}
        </Typo>
      </Pressable>
    )
  }, [onSelect, valueAccessor, labelAccessor, selectedValue])

  return (
    <View style={styles.pickerContainerSmall}>
      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate='fast'
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  )
}

const PickerColumn = React.memo(PickerColumnInner) as typeof PickerColumnInner

export default function DatePicker({
  label,
  value,
  onChange,
  placeholder = 'Seleccionar fecha',
  yearRange = 10
}: Props) {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [tempDate, setTempDate] = useState<Date>(value || new Date())

  useEffect(() => {
    if (!showModal) setTempDate(value || new Date())
  }, [value, showModal])

  const nowYear = useMemo(() => new Date().getFullYear(), [])
  const minYear = useMemo(() => nowYear - yearRange, [nowYear, yearRange])
  const maxYear = useMemo(() => nowYear + yearRange, [nowYear, yearRange])

  const months = useMemo<MonthItem[]>(() => [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ].map((name, index) => ({ name, value: index })), [])

  const days = useMemo<DayItem[]>(() => {
    const daysInMonth = new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 0).getDate()
    return Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1, label: `${i + 1}` }))
  }, [tempDate])

  const years = useMemo<YearItem[]>(() =>
    Array.from({ length: maxYear - minYear + 1 }, (_, i) => ({ value: minYear + i }))
  , [minYear, maxYear])

  const dayRef = useRef<FlatList<DayItem> | null>(null)
  const monthRef = useRef<FlatList<MonthItem> | null>(null)
  const yearRef = useRef<FlatList<YearItem> | null>(null)

  const openPicker = useCallback(() => setShowModal(true), [])
  const closePicker = useCallback(() => setShowModal(false), [])

  const confirmPicker = useCallback(() => {
    onChange(tempDate)
    setShowModal(false)
  }, [onChange, tempDate])

  const clearPicker = useCallback(() => {
    onChange(null)
    setShowModal(false)
  }, [onChange])

  const handleDayChange = useCallback((day: number) => {
    setTempDate(d => new Date(d.getFullYear(), d.getMonth(), day))
  }, [])

  const handleMonthChange = useCallback((month: number) => {
    setTempDate(d => {
      const daysInNewMonth = new Date(d.getFullYear(), month + 1, 0).getDate()
      const adjustedDay = Math.min(d.getDate(), daysInNewMonth)
      return new Date(d.getFullYear(), month, adjustedDay)
    })
  }, [])

  const handleYearChange = useCallback((year: number) => {
    setTempDate(d => {
      const daysInNewMonth = new Date(year, d.getMonth() + 1, 0).getDate()
      const adjustedDay = Math.min(d.getDate(), daysInNewMonth)
      return new Date(year, d.getMonth(), adjustedDay)
    })
  }, [])

  useEffect(() => {
    if (!showModal) return

    const task = InteractionManager.runAfterInteractions(() => {
      const dayIndex = tempDate.getDate() - 1
      const monthIndex = tempDate.getMonth()
      const yearIndex = tempDate.getFullYear() - minYear

      try {
        if (dayRef.current && dayIndex >= 0 && dayIndex < days.length) {
          dayRef.current.scrollToIndex({ index: dayIndex, animated: true })
        }

        if (monthRef.current && monthIndex >= 0 && monthIndex < months.length) {
          monthRef.current.scrollToIndex({ index: monthIndex, animated: true })
        }

        if (yearRef.current && yearIndex >= 0 && yearIndex < years.length) {
          yearRef.current.scrollToIndex({ index: yearIndex, animated: true })
        }
      } catch (e) {
        console.error(e)
      }
    })

    return () => task.cancel()
  }, [showModal, tempDate, minYear, days.length, months.length, years.length])

  const formatDisplayDate = useCallback((date: Date | null) => {
    if (!date) return placeholder
    return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
  }, [placeholder])

  return (
    <View>
      <Pressable onPress={openPicker} style={styles.trigger}>
        <Typo size={14} color={value ? 'primary' : 'secondary'} ellipsizeMode='tail' numberOfLines={1}>
          {formatDisplayDate(value)}
        </Typo>
        <Icon.Calendar size={22} color={Colors.secondary} />
      </Pressable>

      <Modal visible={showModal} animationType='fade' transparent onRequestClose={closePicker}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            <View style={styles.headerRow}>
              <Pressable onPress={closePicker}>
                <Icon.CloseCircle color={Colors.primary} />
              </Pressable>

              <Typo size={16} weight='600'>{label}</Typo>

              <Pressable onPress={confirmPicker}>
                <Icon.CheckCircle color={Colors.primary} />
              </Pressable>
            </View>

            <View style={styles.previewRow}>
              <Typo size={18} weight='600' color='primary'>{formatDisplayDate(tempDate)}</Typo>
            </View>

            <View style={styles.pickersRow}>
              <View style={styles.col}>
                <Typo size={13} weight='600' color='secondary' style={styles.colLabel}>Día</Typo>
                <PickerColumn
                  data={days}
                  selectedValue={tempDate.getDate()}
                  onSelect={handleDayChange}
                  listRef={dayRef}
                  keyExtractor={(it, i) => `d-${i}`}
                  labelAccessor={(it) => it.label}
                  valueAccessor={(it) => it.day}
                />
              </View>

              <View style={styles.col}>
                <Typo size={13} weight='600' color='secondary' style={styles.colLabel}>Mes</Typo>
                <PickerColumn
                  data={months}
                  selectedValue={tempDate.getMonth()}
                  onSelect={handleMonthChange}
                  listRef={monthRef}
                  keyExtractor={(it) => `m-${it.value}`}
                  labelAccessor={(it) => it.name}
                  valueAccessor={(it) => it.value}
                />
              </View>

              <View style={styles.col}>
                <Typo size={13} weight='600' color='secondary' style={styles.colLabel}>Año</Typo>
                <PickerColumn
                  data={years}
                  selectedValue={tempDate.getFullYear()}
                  onSelect={handleYearChange}
                  listRef={yearRef}
                  keyExtractor={(it) => `y-${it.value}`}
                  labelAccessor={(it) => String(it.value)}
                  valueAccessor={(it) => it.value}
                />
              </View>
            </View>

            {value && (
              <Pressable onPress={clearPicker} style={styles.clearRow}>
                <Typo size={15} color='secondary'>Limpiar fecha</Typo>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  trigger: {
    borderRadius: Shapes.rounded.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Sizes.spacing.s11,
    paddingHorizontal: Sizes.spacing.s13,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    backgroundColor: Colors.card
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: Shapes.rounded.sm,
    borderTopRightRadius: Shapes.rounded.sm,
    paddingTop: Sizes.spacing.s15,
    paddingBottom: Sizes.spacing.s21,
    paddingHorizontal: Sizes.spacing.s17,
    maxHeight: '63%'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Sizes.spacing.s9,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border
  },
  previewRow: {
    alignItems: 'center',
    paddingVertical: Sizes.spacing.s9
  },
  pickersRow: {
    flexDirection: 'row',
    gap: Sizes.spacing.s9,
    height: ITEM_HEIGHT * (VISIBLE_PADDING * 2 + 2.04),
    paddingBottom: Sizes.spacing.s13
  },
  col: { flex: 1 },
  colLabel: { textAlign: 'center', paddingBottom: Sizes.spacing.s9 },
  pickerContainerSmall: {
    flex: 1,
    borderRadius: Shapes.rounded.base,
    backgroundColor: Colors.background,
    overflow: 'hidden'
  },
  flatListContent: { paddingVertical: ITEM_HEIGHT * VISIBLE_PADDING },
  itemWrapper: { height: ITEM_HEIGHT, justifyContent: 'center', alignItems: 'center' },
  itemText: { textAlign: 'center' },
  clearRow: {
    alignItems: 'center',
    paddingVertical: Sizes.spacing.s13,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border
  }
})
