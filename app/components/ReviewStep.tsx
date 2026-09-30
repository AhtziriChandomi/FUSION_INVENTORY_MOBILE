import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Button, Icon, Text, useTheme } from 'react-native-paper';
import BottomBar from './BottomBar';
import { Changes, ReviewRow } from './types';

type Props = {
  rows: ReviewRow[];
  saving: boolean;
  onEdit: (row: ReviewRow) => void;
  onBack: () => void;
  onConfirm: () => void;
};

// "Status → Active · Center → Tijuana"
function describe(c: Changes) {
  const parts = [
    c.organization.value && `Org → ${c.organization.label}`,
    c.center.value && `Center → ${c.center.label}`,
    c.location.value && `Loc → ${c.location.label}`,
    c.status.value && `Status → ${c.status.label}`,
  ].filter(Boolean);
  return parts.length ? parts.join('\n') : 'No changes';
}

export default function ReviewStep({ rows, saving, onEdit, onBack, onConfirm }: Props) {
  const { colors } = useTheme();
  const changedCount = rows.filter((r) => r.changed).length;

  return (
    <View style={styles.flex}>
      <View style={styles.summary}>
        <Text style={[styles.summaryText, { color: colors.onSurfaceVariant }]}>
          {rows.length} assets · <Text style={{ color: colors.primary, fontWeight: '700' }}>{changedCount} will change</Text>
        </Text>
        <Text style={[styles.hint, { color: colors.onSurfaceVariant }]}>Tap to edit</Text>
      </View>

      <FlatList
        data={rows}
        keyExtractor={(r) => r.assetNumber}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onEdit(item)}
            android_ripple={{ color: colors.surfaceVariant }}
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: item.changed ? colors.primary : colors.outlineVariant,
                opacity: item.changed ? 1 : 0.7,
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.code} numberOfLines={1}>{item.assetNumber}</Text>
              {item.edited && (
                <View style={[styles.badge, { backgroundColor: colors.tertiaryContainer }]}>
                  <Text style={[styles.badgeText, { color: colors.onTertiaryContainer }]}>Individual</Text>
                </View>
              )}
              <Icon source="pencil-outline" size={16} color={colors.onSurfaceVariant} />
            </View>
            <Text
              style={[styles.changes, { color: item.changed ? colors.primary : colors.onSurfaceVariant }]}
              numberOfLines={4}
            >
              {describe(item.changes)}
            </Text>
          </Pressable>
        )}
      />

      <BottomBar>
        <Button mode="outlined" contentStyle={styles.btnContent} icon="arrow-left" onPress={onBack} disabled={saving}>
          Back
        </Button>
        <Button
          mode="contained"
          style={styles.flex}
          contentStyle={styles.btnContent}
          icon="content-save-outline"
          loading={saving}
          disabled={saving || changedCount === 0}
          onPress={onConfirm}
        >
          Save ({changedCount})
        </Button>
      </BottomBar>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  summary: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 8,
  },
  summaryText: { fontSize: 12, fontWeight: '600' },
  hint: { fontSize: 11 },
  list: { paddingHorizontal: 12, paddingBottom: 12, gap: 6 },
  card: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  code: { flex: 1, fontSize: 14, fontWeight: '700' },
  badge: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 1 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  changes: { fontSize: 12, lineHeight: 17 },
  btnContent: { height: 46 },
});