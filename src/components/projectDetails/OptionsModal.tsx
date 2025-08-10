import { Modal, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Typo from '../shared/Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import i18n from '@/i18n'

interface Props {
  visible: boolean
  onClose(): void
  onEdit(): void
  onDelete(): void
}

export default function OptionsModal({
  visible,
  onClose,
  onEdit,
  onDelete
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      statusBarTranslucent
      navigationBarTranslucent
      hardwareAccelerated
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onEdit}
                style={styles.optionButton}
              >
                <Typo size={15} color='primary' weight='500'>{i18n.t('projectDetails.options.edit')}</Typo>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onDelete}
                style={styles.optionButton}
              >
                <Typo size={15} color='error' weight='500'>{i18n.t('projectDetails.options.delete')}</Typo>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Shapes.rounded.md,
    borderTopRightRadius: Shapes.rounded.md,
    padding: Sizes.spacing.s15,
    gap: Sizes.spacing.s11
  },
  optionButton: {
    paddingVertical: Sizes.spacing.s11,
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Shapes.rounded.md
  }
})
