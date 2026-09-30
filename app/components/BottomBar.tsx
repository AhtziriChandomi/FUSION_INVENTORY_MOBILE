import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Barra fija inferior: los botones principales siempre quedan al alcance del pulgar.
export default function BottomBar({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: colors.surface, borderTopColor: colors.outlineVariant, paddingBottom: 10 + insets.bottom },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', gap: 8, paddingHorizontal: 12, paddingTop: 10, borderTopWidth: 1 },
});
