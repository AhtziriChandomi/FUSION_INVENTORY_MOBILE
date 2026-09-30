import { View, StyleSheet, ScrollView } from 'react-native';

export const Container = ({ children }) => (
  <View style={styles.container}>
    <ScrollView>
        {children}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: '100%',
    alignSelf: 'center',
  },
});