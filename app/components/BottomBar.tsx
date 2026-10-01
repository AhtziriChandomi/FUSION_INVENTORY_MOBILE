import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

// Barra fija inferior: los botones principales siempre quedan al alcance del pulgar.
// El margen del sistema lo maneja la barra de pestañas que está debajo.
export default function BottomBar({ children }: { children: ReactNode }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.bar, { backgroundColor: colors.surface, borderTopColor: colors.outlineVariant }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', gap: 8, paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1 },
});