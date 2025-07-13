import { Modal, Pressable, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Typo from '../shared/Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'

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
              <Pressable onPress={onEdit} style={styles.optionButton}>
                <Typo size={15} color='primary' weight='500'>Editar proyecto</Typo>
              </Pressable>
              <Pressable onPress={onDelete} style={styles.optionButton}>
                <Typo size={15} color='error' weight='500'>Eliminar proyecto</Typo>
              </Pressable>
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
