import { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';

const STEPS = ['Scan', 'Changes', 'Review'];

export default function StepHeader({ step }: { step: number }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.row, { backgroundColor: colors.surface, borderBottomColor: colors.outlineVariant }]}>
      {STEPS.map((label, i) => {
        const done = i < step;
        const active = i === step;
        const bg = done || active ? colors.primary : colors.surfaceVariant;
        const fg = done || active ? colors.onPrimary : colors.onSurfaceVariant;

        return (
          <Fragment key={label}>
            <View style={styles.item}>
              <View style={[styles.dot, { backgroundColor: bg }]}>
                {done ? (
                  <Icon source="check" size={14} color={fg} />
                ) : (
                  <Text style={[styles.dotText, { color: fg }]}>{i + 1}</Text>
                )}
              </View>
              <Text
                style={[
                  styles.label,
                  { color: active ? colors.primary : colors.onSurfaceVariant, fontWeight: active ? '700' : '500' },
                ]}
              >
                {label}
              </Text>
            </View>
            {i < STEPS.length - 1 && (
              <View style={[styles.line, { backgroundColor: i < step ? colors.primary : colors.outlineVariant }]} />
            )}
          </Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1,
  },
  item: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  dotText: { fontSize: 12, fontWeight: '700' },
  label: { fontSize: 12 },
  line: { flex: 1, height: 2, marginHorizontal: 6, borderRadius: 1 },
});
