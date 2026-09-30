import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, BackHandler, StyleSheet, Vibration, View } from 'react-native';
import { Appbar, Text, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import ChangesStep from '../components/ChangesStep';
import DoneStep from '../components/DoneStep';
import EditAssetModal from '../components/EditAssetModal';
import ReviewStep from '../components/ReviewStep';
import ScanStep from '../components/ScanStep';
import StepHeader from '../components/StepHeader';
import { Catalogs, Changes, ReviewRow, emptyChanges, hasAnyChange } from '../components/types';
import { getCatalogs, saveUpdates, SaveResult } from '../../services/inventoryService';
import { setUserInfo } from '../../store/slices/userSlice';

type Feedback = { type: 'ok' | 'warn' | 'error'; text: string } | null;

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const { userInfo, token } = useSelector((state: any) => state.user);
  const { forceOffline, isConnected } = useSelector((state: any) => state.app);
  const isOfflineMode = !isConnected || forceOffline;

  // 0 Scan · 1 Changes · 2 Review · 3 Done
  const [step, setStep] = useState(0);
  const [items, setItems] = useState<string[]>([]); // solo asset numbers
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [catalogs, setCatalogs] = useState<Catalogs>({ organizations: [], centers: [], statuses: [] });
  const [changes, setChanges] = useState<Changes>(emptyChanges());
  const [overrides, setOverrides] = useState<Record<string, Changes>>({});
  const [editing, setEditing] = useState<ReviewRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<SaveResult | null>(null);

  const scannedRef = useRef(new Set<string>()); // evita duplicados aunque se escanee muy rápido

  useEffect(() => {
    if (!userInfo) router.replace('/');
  }, [userInfo]);

  useEffect(() => {
    getCatalogs(token, isOfflineMode).then(setCatalogs).catch((e) => console.log('Catalogs error', e));
  }, [token, isOfflineMode]);

  // Botón físico "atrás" de Android navega entre pasos
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        if (step === 3) { resetBatch(); return true; }
        if (step > 0) { setStep((s) => s - 1); return true; }
        return false;
      });
      return () => sub.remove();
    }, [step])
  );

  // ---------------- Scan: solo agrega el asset number ----------------
  const handleScan = (code: string) => {
    if (scannedRef.current.has(code)) {
      Vibration.vibrate(150);
      setFeedback({ type: 'warn', text: `${code} already in the list` });
      return;
    }
    scannedRef.current.add(code);
    setItems((prev) => [code, ...prev]);
    setFeedback({ type: 'ok', text: `✓ ${code} added` });
  };

  const handleRemove = (code: string) => {
    scannedRef.current.delete(code);
    setItems((prev) => prev.filter((c) => c !== code));
    setOverrides(({ [code]: _, ...rest }) => rest);
  };

  const handleClear = () =>
    Alert.alert('Clear list', 'Remove all scanned assets?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: resetBatch },
    ]);

  function resetBatch() {
    scannedRef.current.clear();
    setItems([]);
    setChanges(emptyChanges());
    setOverrides({});
    setFeedback(null);
    setResult(null);
    setStep(0);
  }

  // ---------------- Review ----------------
  const rows: ReviewRow[] = useMemo(
    () =>
      items.map((code) => {
        const c = overrides[code] ?? changes;
        return { assetNumber: code, changes: c, edited: !!overrides[code], changed: hasAnyChange(c) };
      }),
    [items, changes, overrides]
  );

  const handleSave = async () => {
    // 0 = sin cambio: el backend debe conservar el valor actual en ese campo
    const payload = rows
      .filter((r) => r.changed)
      .map((r) => ({
        assetNumber: r.assetNumber,
        idOrganization: r.changes.organization.value,
        idCenter: r.changes.center.value,
        idLocation: r.changes.location.value,
        idStatus: r.changes.status.value,
        idPersonnal: userInfo?.idPersonnal ?? 0,
      }));

    setSaving(true);
    try {
      const res = await saveUpdates(payload);
      setResult(res);
      setStep(3);
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Could not save the changes');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () =>
    Alert.alert('Sign out', items.length ? 'Scanned assets will be lost.' : 'Do you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => { dispatch(setUserInfo(null)); router.replace('/'); } },
    ]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header mode="small" style={styles.appbar}>
        <Appbar.Content
          title={
            <View>
              <Text style={styles.appTitle}>Inventory</Text>
              <Text style={[styles.appSub, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
                {isOfflineMode ? '🔴 Offline' : '🟢 Online'}{userInfo?.name ? ` · ${userInfo.name}` : ''}
              </Text>
            </View>
          }
        />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>

      {step < 3 && <StepHeader step={step} />}

      {step === 0 && (
        <ScanStep
          items={items}
          feedback={feedback}
          onScan={handleScan}
          onRemove={handleRemove}
          onClear={handleClear}
          onNext={() => setStep(1)}
        />
      )}

      {step === 1 && (
        <ChangesStep
          count={items.length}
          catalogs={catalogs}
          changes={changes}
          onChange={setChanges}
          onBack={() => setStep(0)}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <ReviewStep
          rows={rows}
          saving={saving}
          onEdit={setEditing}
          onBack={() => setStep(1)}
          onConfirm={handleSave}
        />
      )}

      {step === 3 && result && <DoneStep result={result} onNew={resetBatch} />}

      <EditAssetModal
        row={editing}
        initial={editing ? overrides[editing.assetNumber] ?? changes : changes}
        catalogs={catalogs}
        onDismiss={() => setEditing(null)}
        onSave={(code, c) => { setOverrides((o) => ({ ...o, [code]: c })); setEditing(null); }}
        onReset={(code) => { setOverrides(({ [code]: _, ...rest }) => rest); setEditing(null); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  appbar: { height: 52 },
  appTitle: { fontSize: 17, fontWeight: '700' },
  appSub: { fontSize: 11 },
});