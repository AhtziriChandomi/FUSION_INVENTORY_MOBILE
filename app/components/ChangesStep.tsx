import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Icon, Text, useTheme } from 'react-native-paper';
import BottomBar from './BottomBar';
import LocationSelect from './LocationSelect';
import { Catalogs, Changes, NO_CHANGE, needsLocation } from './types';
import PaperSelect from './PaperSelect';

type Props = {
  count: number;
  catalogs: Catalogs;
  changes: Changes;
  onChange: (c: Changes) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function ChangesStep({ count, catalogs, changes, onChange, onBack, onNext }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.flex}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={[styles.info, { backgroundColor: colors.secondaryContainer }]}>
          <Icon source="information-outline" size={18} color={colors.onSecondaryContainer} />
          <Text style={[styles.infoText, { color: colors.onSecondaryContainer }]}>
            Applies to <Text style={styles.bold}>{count} asset{count !== 1 ? 's' : ''}</Text>. Leave “No change” to keep
            the current value.
          </Text>
        </View>

        <PaperSelect
          label="Organization"
          options={[NO_CHANGE, ...catalogs.organizations]}
          selectedValue={changes.organization}
          onSelect={(o: any) => onChange({ ...changes, organization: o })}
        />

        <PaperSelect
          label="Center"
          options={[NO_CHANGE, ...catalogs.centers]}
          selectedValue={changes.center}
          // Al cambiar el centro, la location anterior ya no aplica
          onSelect={(o: any) => onChange({ ...changes, center: o, location: NO_CHANGE })}
        />

        {/* Las locations se cargan según el centro elegido */}
        <LocationSelect
          idCenter={changes.center.value}
          selectedValue={changes.location}
          onSelect={(o) => onChange({ ...changes, location: o })}
          firstOption={NO_CHANGE}
          required={changes.center.value !== 0}
        />

        <PaperSelect
          label="Status"
          options={[NO_CHANGE, ...catalogs.statuses]}
          selectedValue={changes.status}
          onSelect={(o: any) => onChange({ ...changes, status: o })}
        />
      </ScrollView>

      <BottomBar>
        <Button mode="outlined" contentStyle={styles.btnContent} icon="arrow-left" onPress={onBack}>
          Back
        </Button>
        <Button
          mode="contained"
          style={styles.flex}
          contentStyle={[styles.btnContent, { flexDirection: 'row-reverse' }]}
          icon="arrow-right"
          disabled={needsLocation(changes)}
          onPress={onNext}
        >
          Review
        </Button>
      </BottomBar>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 12, gap: 12 },
  info: { flexDirection: 'row', gap: 8, padding: 10, borderRadius: 12 },
  infoText: { flex: 1, fontSize: 12, lineHeight: 17 },
  bold: { fontWeight: '700' },
  btnContent: { height: 46 },
});