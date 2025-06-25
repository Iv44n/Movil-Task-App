import AddIcon from '@/components/icons/AddIcon'
import CheckIcon from '@/components/icons/CheckIcon'
import Typo from '@/components/Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import useBoundStore from '@/store/useBoundStore'
import { useCallback } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import ColorPickerCard from './ColorPickerCard'

interface ColorSelectorProps {
  onSelect: (color: string) => void
  selected: string
}

export default function ColorSelector({ onSelect, selected }: ColorSelectorProps) {
  const colors = useBoundStore((state) => state.colors)
  const showOverlay = useBoundStore((state) => state.showOverlay)
  const hideOverlay = useBoundStore((state) => state.hideOverlay)
  const createColor = useBoundStore((state) => state.createColor)

  const handleColorAdd = useCallback(async (color: string) => {
    try {
      const newColor = await createColor(color)
      if(newColor) onSelect(newColor?.color)
    } catch (error) {
      console.error('Failed to create color:', error)
    }
    hideOverlay()
  }, [onSelect, createColor, hideOverlay])

  const showColorPickerModal = useCallback(() => {
    showOverlay(
      <ColorPickerCard
        colors={colors}
        onCancel={hideOverlay}
        onConfirm={handleColorAdd}
      />
    )
  }, [showOverlay, hideOverlay, handleColorAdd, colors])

  return (
    <View style={{ marginBottom: Sizes.spacing.s71, gap: Sizes.spacing.s15 }}>
      <Typo size={15} fontWeight='medium'>
        Select a Background Color
      </Typo>
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable
            onPress={showColorPickerModal}
            style={{
              marginLeft: Sizes.spacing.s5,
              width: Sizes.width.w33,
              height: Sizes.height.h33,
              borderRadius: Shapes.rounded.small,
              borderColor: Colors.border,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: Sizes.spacing.s11,
              padding: Sizes.spacing.s15
            }}
          >
            <AddIcon color={Colors.textPrimary} size={25} />
          </Pressable>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {
              colors.map((color, index) => (
                <Pressable
                  onPress={() => onSelect(color.color)}
                  key={index}
                  style={{
                    width: Sizes.width.w33,
                    height: Sizes.height.h33,
                    borderRadius: Shapes.rounded.small,
                    backgroundColor: color.color,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: Sizes.spacing.s11
                  }}
                >
                  {
                    color.color === selected &&
                  <CheckIcon color={Colors.textBlack} size={39} />
                  }
                </Pressable>
              ))
            }
          </ScrollView>
        </View>
      </View>
    </View>
  )
}
