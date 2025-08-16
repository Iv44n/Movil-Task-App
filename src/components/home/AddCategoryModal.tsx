import { memo, useCallback, useState } from 'react'
import { Modal, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'

import Typo from '../shared/Typo'
import FormField from '../shared/FormField'
import ActionButton from '../shared/ActionButton'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import i18n from '@/i18n'

interface AddCategoryModalProps {
  visible: boolean
  onCancel: () => void
  onSubmit: (name: string) => void
}

const AddCategoryModal = memo<AddCategoryModalProps>(({
  visible,
  onCancel,
  onSubmit
}) => {
  const [name, setName] = useState('')
  const isValidName = name.trim().length > 0

  const handleSubmit = useCallback(() => {
    if (!isValidName) return

    onSubmit(name.trim())
    setName('')
  }, [name, onSubmit, isValidName])

  const handleCancel = useCallback(() => {
    setName('')
    onCancel()
  }, [onCancel])

  const handleModalPress = useCallback((e: any) => {
    e.stopPropagation()
  }, [])

  if (!visible) return null

  return (
    <Modal
      visible
      animationType='fade'
      transparent
      hardwareAccelerated
      statusBarTranslucent
      onRequestClose={handleCancel}
    >
      <TouchableWithoutFeedback onPress={handleCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={handleModalPress}>
            <View style={styles.modalContent}>
              <View style={styles.header}>
                <Typo size={18} weight='600'>
                  {i18n.t('home.addProjectModal.form.newCategoryTitle')}
                </Typo>
              </View>

              <View style={styles.body}>
                <FormField
                  placeholder={i18n.t('home.addProjectModal.form.newCategoryPlaceholder')}
                  value={name}
                  onChangeText={setName}
                  autoFocus
                  onSubmitEditing={handleSubmit}
                  returnKeyType='done'
                />

                <View style={styles.buttonRow}>
                  <ActionButton
                    style={styles.cancelButton}
                    onPress={handleCancel}
                    typoProps={{ color: 'primary', weight: '500' }}
                  >
                    {i18n.t('home.addProjectModal.actions.cancel')}
                  </ActionButton>

                  <ActionButton
                    style={styles.submitButton}
                    onPress={handleSubmit}
                  >
                    {i18n.t('home.addProjectModal.actions.create', {
                      name: i18n.t('home.addProjectModal.form.category')
                    })}
                  </ActionButton>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
})

AddCategoryModal.displayName = 'AddCategoryModal'
export default AddCategoryModal

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Sizes.spacing.s15
  },
  modalContent: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: Shapes.rounded.md,
    overflow: 'hidden'
  },
  header: {
    alignItems: 'center',
    paddingVertical: Sizes.spacing.s15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border
  },
  body: {
    padding: Sizes.spacing.s15
  },
  buttonRow: {
    marginTop: Sizes.spacing.s11,
    flexDirection: 'row',
    gap: Sizes.spacing.s9
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.card
  },
  submitButton: {
    flex: 1
  }
})
