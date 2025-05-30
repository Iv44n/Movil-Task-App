import { StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/colors'

export default function HomeHeader() {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.subText}>Hi, Arip!</Text>
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
    fontSize: 14
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 28
  },
  titleUnderline: {
    color: Colors.textPrimary,
    fontSize: 30,
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  iconContainer: {
    borderRadius: 99999,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    height: 50
  }
})
