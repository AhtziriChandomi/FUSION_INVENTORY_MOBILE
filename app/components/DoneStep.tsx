import { StyleSheet, View } from 'react-native';
import { Button, Icon, Text, useTheme } from 'react-native-paper';
import BottomBar from './BottomBar';
import { SaveResult } from '../../services/inventoryService';

// Los cambios quedan guardados en el dispositivo; se suben con el botón de sincronizar.
export default function DoneStep({ result, onNew }: { result: SaveResult; onNew: () => void }) {
  const { colors } = useTheme();

  return (
    <View style={styles.flex}>
      <View style={styles.content}>
        <View style={[styles.circle, { backgroundColor: colors.primaryContainer }]}>
          <Icon source="content-save-check-outline" size={40} color={colors.primary} />
        </View>
        <Text style={styles.title}>
          {result.saved} asset{result.saved !== 1 ? 's' : ''} saved
        </Text>
        <Text style={[styles.text, { color: colors.onSurfaceVariant }]}>Pending sync</Text>
      </View>

      <BottomBar>
        <Button mode="contained" style={styles.flex} contentStyle={{ height: 46 }} icon="barcode-scan" onPress={onNew}>
          New batch
        </Button>
      </BottomBar>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 6 },
  circle: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  title: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
  text: { fontSize: 13, textAlign: 'center' },
});