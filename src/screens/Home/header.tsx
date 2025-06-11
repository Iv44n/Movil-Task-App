import { StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/colors'
import { fontFamily } from '@/constants/fontFamily'
import useBoundStore from '@/store/useBoundStore'

export default function HomeHeader() {
  const user = useBoundStore((state) => state.user)

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.subText}>Hi, {user?.username}</Text>
        <Text style={styles.title}>You Have</Text>
        <Text style={styles.titleUnderline}>4 Projects</Text>
      </View>
      <View style={styles.iconContainer}>
        <Ionicons
          name='mail-outline'
          size={24}
          color={Colors.textPrimary}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24
  },
  subText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontFamily: fontFamily.regular
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 28,
    fontFamily: fontFamily.regular
  },
  titleUnderline: {
    color: Colors.textPrimary,
    fontSize: 30,
    textDecorationLine: 'underline',
    fontFamily: fontFamily.semiBold
  },
  iconContainer: {
    borderRadius: 99999,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    height: 50
  }
})
