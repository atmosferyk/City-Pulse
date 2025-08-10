import { StyleSheet, Text, View } from 'react-native';

export default function AirQualityScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🌬️ Air Quality</Text>
        <Text style={styles.subtitle}>Monitor air pollution levels</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Air Quality Details</Text>
        <Text style={styles.description}>
          Detailed air quality information will be displayed here.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b0b",
  },
  header: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: "#151718",
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: "#ECEDEE",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#9BA1A6",
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: "#ECEDEE",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#9BA1A6",
    lineHeight: 24,
  },
});
