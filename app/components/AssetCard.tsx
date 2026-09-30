import { StyleSheet, View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';

type Props = { code: string; index: number; onRemove: (code: string) => void };

export default function AssetCard({ code, index, onRemove }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
      <View style={[styles.index, { backgroundColor: colors.primaryContainer }]}>
        <Text style={[styles.indexText, { color: colors.onPrimaryContainer }]}>{index}</Text>
      </View>
      <Text style={styles.code} numberOfLines={1}>{code}</Text>
      <IconButton icon="close" size={18} onPress={() => onRemove(code)} style={styles.remove} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderRadius: 12, paddingLeft: 10, paddingVertical: 2,
  },
  index: { minWidth: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  indexText: { fontSize: 11, fontWeight: '700' },
  code: { flex: 1, fontSize: 15, fontWeight: '700', letterSpacing: 0.5 },
  remove: { margin: 0 },
});