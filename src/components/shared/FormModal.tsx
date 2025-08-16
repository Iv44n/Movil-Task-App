import { memo, useCallback } from 'react'
import {
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  ViewStyle
} from 'react-native'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import Typo from './Typo'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from '../icons/Icon'
import ActionButton from './ActionButton'

interface FormModalProps {
  visible: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  primaryActionText: string
  onPrimaryAction: () => void
  secondaryActionText?: string
  onSecondaryAction?: () => void
  primaryActionColor?: string
  primaryActionTypoColor?: string
  secondaryActionTypoColor?: string
  contentContainerStyle?: ViewStyle
}

const FormModal = memo(function FormModal({
  visible,
  onClose,
  title,
  children,
  primaryActionText,
  onPrimaryAction,
  secondaryActionText,
  onSecondaryAction,
  primaryActionColor,
  primaryActionTypoColor,
  secondaryActionTypoColor,
  contentContainerStyle
}: FormModalProps) {
  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  return (
    <Modal
      visible={visible}
      animationType='slide'
      hardwareAccelerated
      presentationStyle='pageSheet'
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerIndicator} />
            <View style={styles.headerTitleContainer}>
              <Typo size={18} weight='600' style={styles.headerTitle}>
                {title}
              </Typo>

              <TouchableOpacity style={{ marginTop: 2 }} onPress={handleClose}>
                <Icon.Close size={20} color={Colors.secondary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
        >
          {children}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          {secondaryActionText && onSecondaryAction && (
            <ActionButton
              onPress={onSecondaryAction}
              typoProps={{ color: 'primary' }}
              style={[styles.footerButton, { backgroundColor: Colors.card }]}
            >
              {secondaryActionText}
            </ActionButton>
          )}

          <ActionButton
            onPress={onPrimaryAction}
            style={[
              styles.footerButton,
              { backgroundColor: primaryActionColor || Colors.primary }
            ]}
            typoProps={{ color: 'black' }}
          >
            {primaryActionText}
          </ActionButton>
        </View>
      </SafeAreaView>
    </Modal>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  header: {
    paddingTop: Sizes.spacing.s9,
    paddingBottom: Sizes.spacing.s13
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: Sizes.spacing.s21
  },
  headerIndicator: {
    width: Sizes.spacing.s33,
    height: Sizes.spacing.s3,
    backgroundColor: Colors.border,
    borderRadius: Shapes.rounded.md,
    marginBottom: Sizes.spacing.s13
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    marginLeft: Sizes.spacing.s13
  },
  content: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: Sizes.spacing.s15,
    paddingTop: Sizes.spacing.s15,
    paddingBottom: Sizes.spacing.s15
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: Sizes.spacing.s15,
    paddingVertical: Sizes.spacing.s15,
    paddingBottom: Sizes.spacing.s21,
    gap: Sizes.spacing.s15
  },
  footerButton: {
    flex: 1
  }
})

export default FormModal
