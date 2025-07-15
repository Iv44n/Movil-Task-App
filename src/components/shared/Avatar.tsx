import { View, Image, StyleSheet } from 'react-native'
import { Colors } from '@/constants/theme'

interface AvatarProps {
  uri?: string;
  size: number;
}

export default function Avatar({ uri, size }: AvatarProps) {
  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2
  }

  return (
    <View style={[styles.container, avatarStyle]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={avatarStyle}
          resizeMode='cover'
        />
      ) : (
        <View style={[styles.placeholder, avatarStyle]} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border
  },
  placeholder: {
    borderColor: Colors.secondary,
    backgroundColor: Colors.background
  }
})
