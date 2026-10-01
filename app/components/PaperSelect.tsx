import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Divider, Icon, IconButton, Modal, Portal, Searchbar, Text, TextInput, useTheme } from 'react-native-paper';
import appStyles from '../../styles/styles';

type Option = { value: any; label: string };

type Props = {
  label: string;
  options?: Option[];
  selectedValue?: Option;
  onSelect: (option: Option) => void;
  placeholder?: string;
};

const ITEM_HEIGHT = 48;
const SEARCH_THRESHOLD = 8; // el buscador aparece solo si hay más de 8 opciones

// Búsqueda sin acentos ni mayúsculas: "mexicali" encuentra "Mexicalí"
const normalize = (text: string) =>
  String(text ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/**
 * Misma API que antes (label, options, selectedValue, onSelect, placeholder),
 * así que no hay que cambiar las pantallas que ya lo usan.
 * Usa Modal + FlatList en lugar de Menu: solo dibuja las opciones visibles.
 */
export default function PaperSelect({ label, options = [], selectedValue, onSelect, placeholder }: Props) {
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');

  const selectedLabel = useMemo(
    () => options.find((opt) => opt.value === selectedValue?.value)?.label || '',
    [options, selectedValue]
  );

  const filtered = useMemo(() => {
    const q = normalize(search.trim());
    if (!q) return options;
    return options.filter((opt) => normalize(opt.label).includes(q));
  }, [options, search]);

  const open = () => {
    setSearch('');
    setVisible(true);
  };

  const close = () => setVisible(false);

  const handleSelect = useCallback(
    (option: Option) => {
      onSelect(option);
      setVisible(false);
    },
    [onSelect]
  );

  const renderItem = useCallback(
    ({ item }: { item: Option }) => {
      const selected = item.value === selectedValue?.value;
      return (
        <Pressable
          onPress={() => handleSelect(item)}
          android_ripple={{ color: colors.surfaceVariant }}
          style={[styles.item, selected && { backgroundColor: colors.primaryContainer }]}
        >
          <Text
            style={[styles.itemText, selected && { color: colors.primary, fontWeight: '700' }]}
            numberOfLines={1}
          >
            {item.label}
          </Text>
          {selected && <Icon source="check" size={18} color={colors.primary} />}
        </Pressable>
      );
    },
    [selectedValue, colors, handleSelect]
  );

  return (
    <View>
      <Text style={appStyles.label}>{label}:</Text>

      <Pressable onPress={open}>
        <View pointerEvents="none">
          <TextInput
            mode="outlined"
            value={selectedLabel}
            editable={false}
            right={<TextInput.Icon icon={visible ? 'chevron-up' : 'chevron-down'} />}
            placeholder={placeholder || 'Select an option'}
            style={{ backgroundColor: 'white' }}
          />
        </View>
      </Pressable>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={close}
          contentContainerStyle={[styles.modal, { backgroundColor: colors.surface }]}
        >
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>{label}</Text>
            <IconButton icon="close" size={20} onPress={close} style={styles.close} />
          </View>

          {options.length > SEARCH_THRESHOLD && (
            <Searchbar
              placeholder="Search"
              value={search}
              onChangeText={setSearch}
              style={styles.search}
              inputStyle={styles.searchInput}
              autoCorrect={false}
            />
          )}

          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.value)}
            renderItem={renderItem}
            ItemSeparatorComponent={Divider}
            keyboardShouldPersistTaps="handled"
            // Virtualización: solo se dibujan las opciones cercanas a la pantalla
            initialNumToRender={15}
            maxToRenderPerBatch={20}
            windowSize={5}
            getItemLayout={(_, index) => ({ length: ITEM_HEIGHT + 1, offset: (ITEM_HEIGHT + 1) * index, index })}
            ListEmptyComponent={
              <Text style={[styles.empty, { color: colors.onSurfaceVariant }]}>
                {options.length === 0 ? 'No hay opciones' : 'Sin resultados'}
              </Text>
            }
          />
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: { marginHorizontal: 16, marginVertical: 40, borderRadius: 16, paddingBottom: 8, maxHeight: '80%', overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingTop: 8 },
  title: { flex: 1, fontSize: 16, fontWeight: '700' },
  close: { margin: 0 },
  search: { marginHorizontal: 12, marginBottom: 8, height: 42, elevation: 0 },
  searchInput: { minHeight: 0, fontSize: 14 },
  item: { height: ITEM_HEIGHT, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 8 },
  itemText: { flex: 1, fontSize: 14 },
  empty: { textAlign: 'center', padding: 24, fontSize: 13 },
});