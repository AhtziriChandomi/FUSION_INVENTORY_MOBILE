import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Icon, Text, useTheme } from 'react-native-paper';
import BottomBar from './BottomBar';
import {
  getBatchPendingCount,
  SaveResult,
  subscribePendingChanges,
} from '../../services/inventoryService';

type Props = { result: SaveResult; isOfflineMode: boolean; onNew: () => void; onSync: () => void };

/**
 * Pantalla final después de guardar. Revisa en vivo si los cambios guardados
 * ya se sincronizaron: se actualiza sola al sincronizar desde la pestaña Sync.
 */
export default function DoneStep({ result, isOfflineMode, onNew, onSync }: Props) {
  const { colors } = useTheme() as any;
  const [remaining, setRemaining] = useState(result.saved);

  const refresh = useCallback(async () => {
    const c = await getBatchPendingCount(result.idBatch);
    setRemaining(c.pending + c.errors);
  }, [result.idBatch]);

  // Al abrir la pantalla y cada vez que cambian los pendientes (sincronizar, descartar)
  useEffect(() => {
    refresh();
    return subscribePendingChanges(refresh);
  }, [refresh]);

  // Al regresar a esta pestaña
  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  const synced = remaining === 0;

  return (
    <View style={styles.flex}>
      <View style={styles.content}>
        <View
          style={[
            styles.circle,
            { backgroundColor: synced ? (colors.successContainer ?? colors.primaryContainer) : colors.primaryContainer },
          ]}
        >
          <Icon
            source={synced ? 'cloud-check-outline' : 'cloud-upload-outline'}
            size={40}
            color={synced ? (colors.success ?? colors.primary) : colors.primary}
          />
        </View>

        <Text style={styles.title}>
          {synced ? 'All changes are synced' : 'Changes pending sync'}
        </Text>
        <Text style={[styles.text, { color: colors.onSurfaceVariant }]}>
          {synced
            ? 'Your changes were sent successfully.'
            : isOfflineMode
              ? 'Sync when you are back online.'
              : 'Tap Sync now to send your changes.'}
        </Text>
      </View>

      <BottomBar>
        <Button
          mode={synced ? 'contained' : 'outlined'}
          style={synced ? styles.flex : undefined}
          contentStyle={styles.btnContent}
          icon="barcode-scan"
          onPress={onNew}
        >
          Scan assets
        </Button>

        {!synced && (
          <Button
            mode="contained"
            style={styles.flex}
            contentStyle={styles.btnContent}
            icon="cloud-upload-outline"
            disabled={isOfflineMode}
            onPress={onSync}
          >
            Sync now
          </Button>
        )}
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
  btnContent: { height: 46 },
});