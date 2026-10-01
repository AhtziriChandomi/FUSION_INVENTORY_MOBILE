import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert, BackHandler, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Appbar, Button, Icon, IconButton, ProgressBar, Text, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';

import BottomBar from '../components/BottomBar';
import { PendingRow, SYNC_STATUS } from '../../services/pendingUpdateService';
import {
  discardErrors, discardPending, getPendingList, syncPending,
  SyncOutcome, SyncProgress, SyncResult,
} from '../../services/inventoryService';
import AppHeader from '../components/AppHeader';

type Filter = 'all' | SyncOutcome;
 
// Colores e íconos por resultado
const OUTCOME: Record<SyncOutcome, { label: string; icon: string; color: string; bg: string }> = {
  updated: { label: 'Updated', icon: 'check-circle', color: '#15803D', bg: '#DCFCE7' },
  notfound: { label: 'Not found', icon: 'help-circle', color: '#B45309', bg: '#FEF3C7' },
  error: { label: 'Error', icon: 'close-circle', color: '#B91C1C', bg: '#FEE2E2' },
  other: { label: 'Other', icon: 'alert-circle', color: '#475569', bg: '#E2E8F0' },
};
 
export default function Sync() {
  const { colors } = useTheme();
 
  const { token } = useSelector((state: any) => state.user);
  const { forceOffline, isConnected } = useSelector((state: any) => state.app);
  const isOfflineMode = !isConnected || forceOffline;
 
  const [rows, setRows] = useState<PendingRow[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState<SyncProgress>({ done: 0, total: 0, updated: 0, failed: 0 });
  const [result, setResult] = useState<SyncResult | null>(null); // si existe, se muestra el detalle
  const [filter, setFilter] = useState<Filter>('all');
 
  const load = useCallback(async () => {
    try {
      setRows(await getPendingList());
    } catch (e) {
      console.log('Pending load error', e);
    }
  }, []);
 
  useFocusEffect(useCallback(() => { load(); }, [load]));
 
  // Atrás: bloqueado mientras sincroniza; en el detalle regresa a la lista de pendientes
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        if (syncing) return true;
        if (result) { setResult(null); return true; }
        return false;
      });
      return () => sub.remove();
    }, [syncing, result])
  );
 
  const pendingCount = rows.filter((r) => r.syncStatus === SYNC_STATUS.PENDING).length;
  const errorCount = rows.filter((r) => r.syncStatus === SYNC_STATUS.ERROR).length;
 
  const handleSync = async () => {
    setProgress({ done: 0, total: rows.length, updated: 0, failed: 0 });
    setSyncing(true);
    try {
      const res = await syncPending(token, setProgress);
      setFilter('all');
      setResult(res);
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Sync failed');
    } finally {
      await load();
      setSyncing(false);
    }
  };
 
  const confirmDiscard = (row: PendingRow) =>
    Alert.alert('Discard change', `Discard the pending change for ${row.assetNumber}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: async () => { await discardPending(row.idPending); load(); } },
    ]);
 
  const confirmDiscardErrors = () =>
    Alert.alert('Discard errors', `Discard ${errorCount} failed change${errorCount !== 1 ? 's' : ''}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: async () => { await discardErrors(); load(); } },
    ]);
 
  const filteredDetails = useMemo(
    () => (result ? result.details.filter((d) => filter === 'all' || d.outcome === filter) : []),
    [result, filter]
  );
 
  /* =============================== DETALLE =============================== */
  if (result) {
    return (
      <View style={[styles.flex, { backgroundColor: colors.background }]}>
        <AppHeader title="Sync result" />
 
        {!!result.aborted && (
          <View style={[styles.banner, { backgroundColor: colors.errorContainer }]}>
            <Icon source="wifi-off" size={18} color={colors.error} />
            <Text style={[styles.bannerText, { color: colors.onErrorContainer }]}>{result.aborted}</Text>
          </View>
        )}
 
        {/* Contadores por resultado: tócalos para filtrar */}
        <View style={styles.grid}>
          {(Object.keys(OUTCOME) as SyncOutcome[]).map((key) => {
            const o = OUTCOME[key];
            const active = filter === key;
            return (
              <Pressable
                key={key}
                onPress={() => setFilter(active ? 'all' : key)}
                style={[
                  styles.gridItem,
                  { backgroundColor: o.bg, borderColor: active ? o.color : 'transparent' },
                ]}
              >
                <Icon source={o.icon} size={18} color={o.color} />
                <Text style={[styles.gridValue, { color: o.color }]}>{result.counts[key]}</Text>
                <Text style={[styles.gridLabel, { color: o.color }]} numberOfLines={1}>{o.label}</Text>
              </Pressable>
            );
          })}
        </View>
 
        <Text style={[styles.filterText, { color: colors.onSurfaceVariant }]}>
          {filter === 'all' ? `All · ${result.total}` : `${OUTCOME[filter].label} · ${filteredDetails.length}`}
          {filter !== 'all' ? '   (tap again to show all)' : ''}
        </Text>
 
        <FlatList
          data={filteredDetails}
          keyExtractor={(d) => String(d.idPending)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const o = OUTCOME[item.outcome];
            return (
              <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
                <View style={styles.detailIcon}>
                  <Icon source={o.icon} size={20} color={o.color} />
                </View>
                <View style={styles.cardBody}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.code} numberOfLines={1}>{item.assetNumber}</Text>
                    <View style={[styles.badge, { backgroundColor: o.bg }]}>
                      <Text style={[styles.badgeText, { color: o.color }]}>{o.label}</Text>
                    </View>
                  </View>
                  <Text style={[styles.summary, { color: colors.onSurfaceVariant }]} numberOfLines={2}>
                    {item.summary}
                  </Text>
                  {item.outcome !== 'updated' && (
                    <Text style={[styles.error, { color: o.color }]} numberOfLines={3}>{item.message}</Text>
                  )}
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>Nothing in this group</Text>
          }
        />
 
        <BottomBar>
          <Button mode="contained" style={styles.flex} contentStyle={styles.btnContent} onPress={() => setResult(null)}>
            {rows.length ? `Done · ${rows.length} still pending` : 'Done'}
          </Button>
        </BottomBar>
      </View>
    );
  }
 
  /* =============================== PENDIENTES =============================== */
  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <AppHeader title="Sync" disabled={syncing} />
 
      {isOfflineMode && (
        <View style={[styles.banner, { backgroundColor: colors.errorContainer }]}>
          <Icon source="wifi-off" size={18} color={colors.error} />
          <Text style={[styles.bannerText, { color: colors.onErrorContainer }]}>
            You're offline. Connect to a network to sync.
          </Text>
        </View>
      )}

      {syncing && (
        <View style={[styles.progressCard, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>
              {progress.done === 0 ? 'Uploading...' : 'Syncing...'}
            </Text>
            <Text style={[styles.progressPercent, { color: colors.primary }]}>
              {progress.total ? Math.round((progress.done / progress.total) * 100) : 0}%
            </Text>
          </View>
 
          {/* Indeterminada mientras llega la primera respuesta */}
          <ProgressBar
            progress={progress.total ? progress.done / progress.total : 0}
            indeterminate={progress.done === 0}
            color={colors.primary}
            style={styles.progressBar}
          />
 
          <View style={styles.progressFooter}>
            <Text style={[styles.progressText, { color: colors.onSurfaceVariant }]}>
              {progress.done} of {progress.total} assets
            </Text>
          </View>
          <Text style={[styles.progressHint, { color: colors.onSurfaceVariant }]}>
            Keep the app open until it finishes
          </Text>
        </View>
      )}
 
      <FlatList
        data={rows}
        keyExtractor={(r) => String(r.idPending)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const failed = item.syncStatus === SYNC_STATUS.ERROR;
          const o = failed ? OUTCOME[(item.syncResult as SyncOutcome) || 'error'] ?? OUTCOME.error : null;
          return (
            <View
              style={[
                styles.card,
                { backgroundColor: colors.surface, borderColor: o ? o.color : colors.outlineVariant },
              ]}
            >
              <View style={styles.cardBody}>
                <View style={styles.cardHeader}>
                  <Text style={styles.code} numberOfLines={1}>{item.assetNumber}</Text>
                  <View style={[styles.badge, { backgroundColor: o ? o.bg : colors.secondaryContainer }]}>
                    <Text style={[styles.badgeText, { color: o ? o.color : colors.onSecondaryContainer }]}>
                      {o ? o.label : 'Pending'}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.summary, { color: colors.onSurfaceVariant }]} numberOfLines={2}>
                  {item.summary}
                </Text>
                {o && !!item.errorMessage && (
                  <Text style={[styles.error, { color: o.color }]} numberOfLines={2}>{item.errorMessage}</Text>
                )}
                <Text style={[styles.date, { color: colors.onSurfaceVariant }]}>{item.insertDate}</Text>
              </View>
              <IconButton icon="trash-can-outline" size={18} onPress={() => confirmDiscard(item)} disabled={syncing} />
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon source="cloud-check-outline" size={48} color={colors.outline} />
            <Text style={[styles.emptyTitle, { color: colors.onSurface }]}>Everything is synced</Text>
          </View>
        }
      />
 
      <BottomBar>
        {errorCount > 0 && (
          <Button mode="outlined" contentStyle={styles.btnContent} onPress={confirmDiscardErrors} disabled={syncing}>
            Discard failed
          </Button>
        )}
        <Button
          mode="contained"
          style={styles.flex}
          contentStyle={styles.btnContent}
          icon="cloud-upload-outline"
          loading={syncing}
          disabled={syncing || isOfflineMode || rows.length === 0}
          onPress={handleSync}
        >
          {syncing ? 'Syncing...' : `Sync (${rows.length})`}
        </Button>
      </BottomBar>
    </View>
  );
}
 
const styles = StyleSheet.create({
  flex: { flex: 1 },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 12, marginTop: 8, padding: 10, borderRadius: 12 },
  bannerText: { flex: 1, fontSize: 12, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 12, paddingTop: 10 },
  gridItem: {
    width: '48%', flexGrow: 1, flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: 12, borderWidth: 2, paddingHorizontal: 10, paddingVertical: 8,
  },
  gridValue: { fontSize: 18, fontWeight: '800' },
  gridLabel: { flex: 1, fontSize: 12, fontWeight: '700' },
  filterText: { fontSize: 11, paddingHorizontal: 12, paddingTop: 8 },
  progressCard: { marginHorizontal: 12, marginTop: 10, padding: 12, borderRadius: 12, borderWidth: 1, gap: 8 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressTitle: { fontSize: 14, fontWeight: '700' },
  progressPercent: { fontSize: 18, fontWeight: '800' },
  progressBar: { height: 8, borderRadius: 4 },
  progressFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressCounts: { flexDirection: 'row', gap: 12 },
  progressCount: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  progressText: { fontSize: 12, fontWeight: '600' },
  progressHint: { fontSize: 10, textAlign: 'center' },
  list: { padding: 12, gap: 6, flexGrow: 1 },
  card: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingLeft: 10, paddingVertical: 6, paddingRight: 4 },
  detailIcon: { width: 24, alignItems: 'center', marginRight: 8 },
  cardBody: { flex: 1, gap: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  code: { flex: 1, fontSize: 14, fontWeight: '700' },
  badge: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 1 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  summary: { fontSize: 12 },
  error: { fontSize: 11, fontWeight: '600' },
  date: { fontSize: 10, opacity: 0.8 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 6 },
  emptyTitle: { fontSize: 15, fontWeight: '700' },
  emptyText: { textAlign: 'center', padding: 24, fontSize: 12 },
  btnContent: { height: 46 },
});