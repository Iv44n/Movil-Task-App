import useBoundStore from '@/store/useBoundStore'
import { StyleSheet, View } from 'react-native'

export default function OverlayHost() {
  const overlayContent = useBoundStore((state) => state.overlayContent)

  if (!overlayContent) return null

  return (
    <View style={styles.container}>
      {overlayContent}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }
})
