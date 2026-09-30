import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Modal, Portal, Text, useTheme } from 'react-native-paper';
import LocationSelect from './LocationSelect';
import { Catalogs, Changes, ReviewRow, needsLocation } from './types';
import PaperSelect from './PaperSelect';

type Props = {
  row: ReviewRow | null;
  initial: Changes;
  catalogs: Catalogs;
  onDismiss: () => void;
  onSave: (assetNumber: string, changes: Changes) => void;
  onReset: (assetNumber: string) => void;
};

const KEEP = { value: 0, label: 'Keep current' };
const asKeep = (o: any) => (o.value === 0 ? KEEP : o);

// Ajuste individual: sobrescribe los valores del lote solo para este activo.
export default function EditAssetModal({ row, initial, catalogs, onDismiss, onSave, onReset }: Props) {
  const { colors } = useTheme();
  const [values, setValues] = useState<Changes>(initial);

  useEffect(() => { setValues(initial); }, [row, initial]);

  if (!row) return null;

  return (
    <Portal>
      <Modal visible={!!row} onDismiss={onDismiss} contentContainerStyle={[styles.modal, { backgroundColor: colors.surface }]}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>{row.assetNumber}</Text>
          <Text style={[styles.sub, { color: colors.onSurfaceVariant }]}>Values for this asset only</Text>

          <View style={styles.fields}>
            <PaperSelect
              label="Organization"
              options={[KEEP, ...catalogs.organizations]}
              selectedValue={asKeep(values.organization)}
              onSelect={(o: any) => setValues({ ...values, organization: o })}
            />
            <PaperSelect
              label="Center"
              options={[KEEP, ...catalogs.centers]}
              selectedValue={asKeep(values.center)}
              onSelect={(o: any) => setValues({ ...values, center: o, location: KEEP })}
            />
            <LocationSelect
              idCenter={values.center.value}
              selectedValue={asKeep(values.location)}
              onSelect={(o) => setValues({ ...values, location: o })}
              firstOption={KEEP}
              required={values.center.value !== 0}
            />
            <PaperSelect
              label="Status"
              options={[KEEP, ...catalogs.statuses]}
              selectedValue={asKeep(values.status)}
              onSelect={(o: any) => setValues({ ...values, status: o })}
            />
          </View>

          <View style={styles.actions}>
            {row.edited && (
              <Button compact onPress={() => onReset(row.assetNumber)} style={styles.reset}>
                Use batch
              </Button>
            )}
            <Button compact onPress={onDismiss}>Cancel</Button>
            <Button
              compact
              mode="contained"
              disabled={needsLocation(values)}
              onPress={() => onSave(row.assetNumber, values)}
            >
              Save
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: { margin: 16, borderRadius: 16, padding: 16, maxHeight: '90%' },
  title: { fontSize: 16, fontWeight: '700' },
  sub: { fontSize: 12, marginTop: 2 },
  fields: { gap: 10, marginTop: 12 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 16 },
  reset: { marginRight: 'auto' },
});