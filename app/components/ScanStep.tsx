import { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Icon, Text, TextInput, useTheme } from 'react-native-paper';
import AssetCard from './AssetCard';
import BottomBar from './BottomBar';

type Feedback = { type: 'ok' | 'warn' | 'error'; text: string } | null;

type Props = {
  items: string[];
  feedback: Feedback;
  onScan: (code: string) => void;
  onRemove: (code: string) => void;
  onClear: () => void;
  onNext: () => void;
};

/**
 * El escáner del Eyoyo funciona como teclado: "escribe" el código y manda Enter.
 * Aquí solo se guarda el asset number; no se consulta nada.
 */
export default function ScanStep({ items, feedback, onScan, onRemove, onClear, onNext }: Props) {
  const { colors } = useTheme();
  const inputRef = useRef<any>(null);
  const [code, setCode] = useState('');
  const [manual, setManual] = useState(__DEV__); // en desarrollo arranca con teclado

  const focusInput = () => setTimeout(() => inputRef.current?.focus(), 50);

  useEffect(() => { focusInput(); }, []);

  const submit = () => {
    const value = code.trim();
    setCode('');
    if (value) onScan(value);
    focusInput();
  };

  const toggleManual = () => {
    setManual((m) => !m);
    inputRef.current?.blur();
    setTimeout(() => inputRef.current?.focus(), 150);
  };

  const feedbackColor =
    feedback?.type === 'ok' ? colors.primary : feedback?.type === 'warn' ? '#B45309' : colors.error;

  return (
    <View style={styles.flex}>
      <View style={[styles.scanBox, { backgroundColor: colors.surface }]}>
        <TextInput
          ref={inputRef}
          mode="outlined"
          dense
          value={code}
          onChangeText={setCode}
          onSubmitEditing={submit}
          submitBehavior="submit"
          returnKeyType="done"
          showSoftInputOnFocus={manual}
          autoCapitalize="characters"
          autoCorrect={false}
          placeholder={manual ? 'Type asset number' : 'Scan asset number'}
          left={<TextInput.Icon icon="barcode-scan" />}
          right={<TextInput.Icon icon={manual ? 'keyboard-off-outline' : 'keyboard-outline'} onPress={toggleManual} />}
        />
        <Text style={[styles.feedback, { color: feedback ? feedbackColor : colors.onSurfaceVariant }]} numberOfLines={1}>
          {feedback?.text ?? 'Ready to scan'}
        </Text>
      </View>

      <View style={styles.listHeader}>
        <Text style={[styles.count, { color: colors.onSurfaceVariant }]}>
          {items.length} asset{items.length !== 1 ? 's' : ''}
        </Text>
        {items.length > 0 && (
          <Button compact mode="text" onPress={onClear} icon="delete-sweep-outline">
            Clear
          </Button>
        )}
      </View>

      <FlatList
        data={items}
        keyExtractor={(c) => c}
        renderItem={({ item, index }) => (
          <AssetCard
            code={item}
            index={items.length - index} // el más reciente arriba con el número más alto
            onRemove={(c) => { onRemove(c); focusInput(); }}
          />
        )}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon source="barcode-scan" size={48} color={colors.outline} />
            <Text style={[styles.emptyTitle, { color: colors.onSurface }]}>Scan assets to start</Text>
            <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>
              Scan one for an individual update or many for a bulk update.
            </Text>
          </View>
        }
      />

      <BottomBar>
        <Button
          mode="contained"
          style={styles.flex}
          contentStyle={styles.btnContent}
          icon="arrow-right"
          disabled={items.length === 0}
          onPress={onNext}
        >
          Next ({items.length})
        </Button>
      </BottomBar>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scanBox: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 6 },
  feedback: { fontSize: 12, marginTop: 4, marginLeft: 4, fontWeight: '600' },
  listHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 12, minHeight: 36,
  },
  count: { fontSize: 12, fontWeight: '600' },
  list: { paddingHorizontal: 12, paddingBottom: 12, gap: 6, flexGrow: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 6 },
  emptyTitle: { fontSize: 15, fontWeight: '700', marginTop: 4 },
  emptyText: { fontSize: 12, textAlign: 'center' },
  btnContent: { height: 46, flexDirection: 'row-reverse' },
});